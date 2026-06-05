import Link from "next/link";
import { ProductActions } from "@/components/product-actions";
import { ProductImage } from "@/components/product-image";
import type { Product, SiteSettings } from "@/lib/types";

export function ProductCard({ product, settings }: { product: Product; settings: SiteSettings }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
            variant="card"
          />
          {product.is_featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#fffaf4]/92 px-3 py-1 text-[10px] lowercase tracking-[0.08em] text-ink shadow-[0_8px_18px_rgba(42,27,18,0.08)] sm:text-[11px]">
              bestseller
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3 sm:pt-5">
        <div className="grid min-h-[72px] grid-cols-[1fr_auto] items-start gap-2 sm:min-h-[82px] sm:gap-3 lg:min-h-[76px]">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-taupe sm:text-[11px]">{product.categories?.name || "Aroma"}</p>
            <Link href={`/products/${product.slug}`} className="mt-1 block text-[13px] font-semibold uppercase leading-snug sm:text-[15px] xl:text-base">{product.name}</Link>
          </div>
          {product.price ? <p className="whitespace-nowrap text-xs font-semibold leading-5 sm:text-sm">{product.price}</p> : null}
        </div>
        <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-5 text-ink/60 sm:min-h-12 sm:text-sm sm:leading-6">{product.description}</p>
        <ProductActions product={product} settings={settings} compact />
      </div>
    </article>
  );
}
