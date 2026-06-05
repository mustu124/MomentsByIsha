# Supabase Catalogue Import

The website was showing demo products because the Google Drive images and PDF catalogue had not been imported into Supabase yet. Google Drive folder URLs do not become product records automatically.

This project now includes a one-command import workflow.

## Source Files

Catalogue PDF used:

```text
C:\Users\Mustafa\Downloads\shah_artisans_aroma_catalog.pdf.pdf
```

Drive folder:

```text
https://drive.google.com/drive/folders/1JawIE2fJyHjoTLdKK3TPpbAEnCjd5iFC
```

Download the Drive folder and place all product images here:

```text
assets/source-product-images/
```

The script supports `.heic`, `.heif`, `.png`, `.jpg`, `.jpeg`, and `.webp`.

## Product Manifest

Extracted catalogue products live in:

```text
data/catalog-products.json
```

Review this file before importing. If a product should use a specific image, add an `image_url` manually after upload, or order the local source images to match the product order.

Current product order:

1. Simple Sachet
2. Colour Wax Sachet with Embedded Flowers
3. Colour Wax Sachet with Wax Embedded Design
4. Premium Colour Wax Sachet
5. Sunshine Bouquet
6. Brewed Bliss
7. Sunkissed Shore
8. Lavender Bloom
9. The Arch Aura

## Environment

Use either a service role key:

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
npm run catalog:import
```

Or sign in as the Supabase admin user:

```powershell
$env:SUPABASE_ADMIN_EMAIL="admin@forver.com"
$env:SUPABASE_ADMIN_PASSWORD="isha1212"
npm run catalog:import
```

The script also reads:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

from `.env.local`.

## What The Import Does

1. Converts local Drive images to optimized 4:5 WebP.
2. Saves converted files to `public/products/`.
3. Uploads converted files to Supabase Storage bucket `product-images`.
4. Upserts categories by `slug`.
5. Upserts products by `slug`.
6. Assigns uploaded image URLs to products in manifest order.

## Command

```powershell
npm run catalog:import
```

After import, refresh:

```text
http://127.0.0.1:3000/catalogue
```
