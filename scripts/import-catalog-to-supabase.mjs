import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const manifestPath = path.join(root, "data/catalog-products.json");
const sourceImagesDir = path.join(root, "assets/source-product-images");
const convertedDir = path.join(root, "public/products");
const bucket = "product-images";
const allowed = new Set([".heic", ".heif", ".png", ".jpg", ".jpeg", ".webp"]);
const isDryRun = process.argv.includes("--dry-run");

async function loadLocalEnv() {
  const envPath = path.join(root, ".env.local");
  const content = await fs.readFile(envPath, "utf-8").catch(() => "");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

function getEnv(name) {
  return process.env[name] || "";
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    throw new Error("Missing dependency: sharp. Install it with `npm install -D sharp`.");
  }
}

async function listImages(dir, baseDir = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const images = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      const folderSlug = slugify(entry.name);
      if (folderSlug === "logo" || folderSlug === "homepage") continue;
      images.push(...await listImages(fullPath, baseDir));
      continue;
    }

    if (!entry.isFile() || !allowed.has(path.extname(entry.name).toLowerCase())) continue;

    const parent = path.dirname(relativePath);
    const categorySlug = parent === "." ? "" : slugify(parent);
    images.push({
      name: entry.name,
      relativePath,
      categorySlug,
      absolutePath: fullPath,
    });
  }

  return images.sort((a, b) => a.relativePath.localeCompare(b.relativePath, undefined, { numeric: true }));
}

function normalizeCategorySlug(slug) {
  return slug.replace(/s$/, "");
}

async function convertImages() {
  const sharp = await loadSharp();
  await fs.mkdir(convertedDir, { recursive: true });
  const images = await listImages(sourceImagesDir);

  const converted = [];
  for (const image of images) {
    const input = image.absolutePath;
    const outputName = `${slugify(image.relativePath)}.webp`;
    const output = path.join(convertedDir, outputName);

    try {
      await sharp(input, { failOn: "none" })
        .rotate()
        .resize({ width: 1600, height: 2000, fit: "cover", position: "centre", withoutEnlargement: false })
        .modulate({ brightness: 1.03, saturation: 0.88 })
        .linear(0.96, 8)
        .webp({ quality: 84, effort: 6 })
        .toFile(output);

      converted.push({ source: image.relativePath, categorySlug: image.categorySlug, fileName: outputName, path: output });
      console.log(`converted ${image.relativePath} -> ${outputName}`);
    } catch (error) {
      console.warn(`skipped ${image.relativePath}: ${error.message}`);
    }
  }

  return converted;
}

async function createSupabaseClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL") || getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY");

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");

  if (serviceRoleKey) {
    return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }

  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.");

  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const email = getEnv("SUPABASE_ADMIN_EMAIL");
  const password = getEnv("SUPABASE_ADMIN_PASSWORD");
  if (!email || !password) {
    throw new Error("Set SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD, or use SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Admin login failed: ${error.message}`);
  return client;
}

async function uploadImage(client, file) {
  const bytes = await fs.readFile(file.path);
  const storagePath = `catalog/${file.fileName}`;
  const { error } = await client.storage.from(bucket).upload(storagePath, bytes, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${file.fileName}: ${error.message}`);

  const { data } = client.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main() {
  await loadLocalEnv();
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));

  if (isDryRun) {
    const localImages = await listImages(sourceImagesDir);
    console.log(`Dry run only. No Supabase changes will be made.`);
    console.log(`Manifest categories: ${manifest.categories.length}`);
    console.log(`Manifest products: ${manifest.products.length}`);
    console.log(`Local source images: ${localImages.length}`);
    console.log(`Source folder: ${sourceImagesDir}`);
    manifest.products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} | ${product.price || "no price"} | category: ${product.category_slug}`);
    });
    return;
  }

  const client = await createSupabaseClient();
  const convertedImages = await convertImages();
  const { error: sizeColumnError } = await client.from("products").select("size_ml").limit(1);
  const supportsSizeMl = !sizeColumnError;

  if (!convertedImages.length) {
    console.warn(`No images found in ${sourceImagesDir}. Products will import without image URLs.`);
  }

  const { data: categoryRows, error: categoryError } = await client
    .from("categories")
    .upsert(manifest.categories, { onConflict: "slug" })
    .select("*");

  if (categoryError) throw new Error(categoryError.message);

  const categoryBySlug = new Map(categoryRows.map((category) => [category.slug, category]));
  const uploadedImages = [];

  for (const file of convertedImages) {
    uploadedImages.push({ ...file, publicUrl: await uploadImage(client, file) });
  }

  const uploadedByCategory = new Map();
  const rootImages = [];
  for (const image of uploadedImages) {
    if (!image.categorySlug) {
      rootImages.push(image);
      continue;
    }
    const normalized = normalizeCategorySlug(image.categorySlug);
    if (!uploadedByCategory.has(normalized)) uploadedByCategory.set(normalized, []);
    uploadedByCategory.get(normalized).push(image);
  }

  const categoryImageIndexes = new Map();
  let rootImageIndex = 0;

  function takeImagesForCategory(categorySlug, count = 1) {
    const normalized = normalizeCategorySlug(categorySlug || "");
    const categoryImages = uploadedByCategory.get(normalized);
    const taken = [];

    if (categoryImages?.length) {
      for (let offset = 0; offset < count; offset += 1) {
        const index = categoryImageIndexes.get(normalized) || 0;
        categoryImageIndexes.set(normalized, index + 1);
        taken.push(categoryImages[index % categoryImages.length].publicUrl);
      }
      return taken;
    }

    if (rootImages.length) {
      for (let offset = 0; offset < count; offset += 1) {
        const image = rootImages[rootImageIndex % rootImages.length];
        rootImageIndex += 1;
        taken.push(image.publicUrl);
      }
      return taken;
    }

    return [];
  }

  const products = manifest.products.map((product, index) => {
    const category = categoryBySlug.get(product.category_slug);
    const assignedImages = takeImagesForCategory(product.category_slug, 8);
    const imageUrl = product.image_url || assignedImages[0] || "";
    const galleryImages = [
      ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
      ...assignedImages.filter((image) => image !== imageUrl),
    ];

    const row = {
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price || "",
      category_id: category?.id || null,
      image_url: imageUrl,
      gallery_images: galleryImages,
      is_featured: Boolean(product.is_featured),
      is_visible: product.is_visible !== false,
      sort_order: product.sort_order || index + 1,
    };

    if (supportsSizeMl) row.size_ml = product.size_ml || null;
    return row;
  });

  const { error: productError } = await client.from("products").upsert(products, { onConflict: "slug" });
  if (productError) throw new Error(productError.message);

  console.log(`Imported ${manifest.categories.length} categories and ${products.length} products.`);
  console.log(`Uploaded ${uploadedImages.length} product image(s) to Supabase Storage.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
