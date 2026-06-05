# Moments by Isha Product Image System

## Source Photos

Client source folder:
https://drive.google.com/drive/folders/1JawIE2fJyHjoTLdKK3TPpbAEnCjd5iFC

Known source set:
- Folder title: Moments By Isha
- 33 images total
- 30 HEIC
- 3 PNG
- Approx total size: 44.26 MB

## Conversion Workflow

1. Download the Drive folder locally.
2. Place source photos in `assets/source-product-images/`.
3. Install Sharp if needed:

```powershell
npm install -D sharp
```

4. Run:

```powershell
npm run images:convert
```

The script writes optimized WebP files to `public/products/`.

Conversion settings:
- Output format: WebP
- Output ratio: 4:5
- Output size: 1600 x 2000
- Crop: center
- Tone: slightly warmer, softer contrast, lower saturation
- No distortion: images are resized with cover crop, not stretched

## Website Treatment

All product images use `components/product-image.tsx`.

The shared frame applies:
- 4:5 ratio for product cards and admin previews
- consistent neutral warm background
- center object positioning
- `object-fit: cover`
- soft contrast
- reduced saturation
- subtle sepia warmth
- light overlay to normalize mixed lighting
- same hover treatment across catalogue cards

The product detail page uses a larger version of the same treatment so images remain consistent between homepage, catalogue, product pages, and admin.

## Upload Guidance

For best results in Supabase Storage:
- Prefer WebP or JPG.
- Avoid uploading HEIC directly to the website.
- Use consistent file names such as `amber-souk-aroma-jar.webp`.
- Keep product centered in the crop.

## Future Photo Guidance

Recommend the client shoot future product photos with:
- Same background
- Same lighting angle
- Same camera distance
- Same product placement
- Same vertical or square framing
- Minimal background clutter
- Consistent warmth and brightness
- Product centered with breathing room around it
- No harsh shadows or high saturation
