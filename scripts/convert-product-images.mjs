import fs from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve("assets/source-product-images");
const outputDir = path.resolve("public/products");
const allowed = new Set([".heic", ".heif", ".png", ".jpg", ".jpeg", ".webp"]);

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.error("Missing dependency: sharp");
    console.error("Install it with: npm install -D sharp");
    process.exit(1);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const sharp = await loadSharp();
  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true }).catch(() => {
    console.error(`Create ${sourceDir} and place the downloaded Drive product photos there.`);
    process.exit(1);
  });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => allowed.has(path.extname(name).toLowerCase()));

  for (const file of files) {
    const input = path.join(sourceDir, file);
    const output = path.join(outputDir, `${slugify(file)}.webp`);

    await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: 1600,
        height: 2000,
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      })
      .modulate({
        brightness: 1.03,
        saturation: 0.88,
      })
      .linear(0.96, 8)
      .webp({
        quality: 84,
        effort: 6,
      })
      .toFile(output);

    console.log(`Converted ${file} -> ${path.relative(process.cwd(), output)}`);
  }

  console.log(`Done. Converted ${files.length} image(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
