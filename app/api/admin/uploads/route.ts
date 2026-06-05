import { adminJson, getServiceSupabase, requireAdmin } from "@/lib/admin-api-auth";
import sharp from "sharp";

const bucketName = "product-images";

function safeFilePart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "product-image";
}

async function ensureBucket() {
  const supabase = getServiceSupabase();
  if (!supabase) return { supabase: null, error: "Supabase service role is not configured." };

  const { error } = await supabase.storage.getBucket(bucketName);
  if (!error) return { supabase, error: null };

  const created = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 1024 * 1024 * 20,
    allowedMimeTypes: ["image/webp"],
  });

  if (created.error && !created.error.message.toLowerCase().includes("already exists")) {
    return { supabase, error: created.error.message };
  }

  return { supabase, error: null };
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return adminJson({ error: auth.message }, auth.status);

  const { supabase, error: bucketError } = await ensureBucket();
  if (!supabase) return adminJson({ error: bucketError }, 500);
  if (bucketError) return adminJson({ error: bucketError }, 400);

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = safeFilePart(String(formData.get("folder") || "products"));

  if (!(file instanceof File)) return adminJson({ error: "No image file was received." }, 400);
  const looksLikeImage = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name || "");
  if (!looksLikeImage) return adminJson({ error: "Please upload an image file." }, 400);

  const originalName = file.name || "product-image";
  const nameWithoutExtension = originalName.replace(/\.[^.]+$/, "");
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeFilePart(nameWithoutExtension)}.webp`;
  const bytes = await file.arrayBuffer();
  let webp: Buffer;

  try {
    webp = await sharp(Buffer.from(bytes), { failOn: "none" })
      .rotate()
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86 })
      .toBuffer();
  } catch {
    return adminJson({ error: "This image could not be processed. Try another photo or export it as JPG/PNG." }, 400);
  }

  const { error } = await supabase.storage.from(bucketName).upload(path, webp, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: false,
  });

  if (error) return adminJson({ error: error.message }, 400);

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return adminJson({ path, publicUrl: data.publicUrl });
}
