import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CartWidget } from "@/components/cart/cart-widget";
import { Footer } from "@/components/footer";
import { ProductActions } from "@/components/product-actions";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products, settings] = await Promise.all([getProductBySlug(slug), getProducts(), getSiteSettings()]);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== product.slug && item.category_id === product.category_id).slice(0, 4);
  const galleryImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main className="luxury-container pb-24 pt-6 sm:pt-8 sm:pb-8">
        <Link href="/catalogue" className="button-line mb-8 inline-flex items-center gap-2 text-sm lowercase text-ink/70">
          <ArrowLeft size={16} />
          back to catalogue
        </Link>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:items-start lg:gap-12">
          <div>
            <ProductImage
              src={product.image_url}
              alt={product.name}
              priority
              sizes="(min-width: 1024px) 45vw, 92vw"
              variant="detail"
            />
            {galleryImages.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {galleryImages.slice(0, 8).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4eadc]">
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs lowercase tracking-[0.08em] text-taupe sm:text-sm">{product.categories?.name || "Moments by Isha"}</p>
            <h1 className="serif-title mt-3 text-4xl font-semibold leading-none lowercase sm:text-6xl md:text-7xl">{product.name}</h1>
            <p className="mt-4 text-sm text-ink/54">5.0 / 5.0</p>
            <p className="mt-5 text-2xl font-semibold">{product.price}</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink/70">{product.description}</p>
            <div className="mt-8 max-w-sm">
              <ProductActions product={product} settings={settings} />
            </div>
            <div className="mt-8 grid max-w-xl gap-3 border-y border-ink/10 py-5 text-sm lowercase leading-6 text-ink/60 sm:grid-cols-3">
              <p>whatsapp order</p>
              <p>gift-ready finish</p>
              <p>small batch aroma</p>
            </div>
          </div>
        </section>
        {related.length ? (
          <section className="py-14">
            <p className="text-xs uppercase tracking-[0.22em] text-taupe">You may also like</p>
            <div className="mt-6 grid grid-cols-2 items-stretch gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
              {related.map((item) => <ProductCard key={item.id} product={item} settings={settings} />)}
            </div>
          </section>
        ) : null}
      </main>
      <CartWidget settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
