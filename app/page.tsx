import Link from "next/link";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { CollectionCard } from "@/components/collection-card";
import { CartWidget } from "@/components/cart/cart-widget";
import { Footer } from "@/components/footer";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getSiteSettings()]);
  const featured = products.filter((product) => product.is_featured).slice(0, 4);
  const heroProduct = featured[0] || products[0];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#fffaf4] py-5 sm:py-7">
          <div className="luxury-container">
            <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-[#dfc3a4] shadow-[0_18px_50px_rgba(42,27,18,0.10)] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[680px] sm:rounded-[2.6rem]">
              <Image
                src="/brand/homepage-candles.jpg"
                alt="Moments by Isha homepage candles"
                fill
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#2a1b12]/12" />
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                <div className="max-w-3xl">
                  <h1 className="serif-title text-4xl font-black leading-[1.08] text-[#fffaf4] drop-shadow-[0_2px_12px_rgba(31,23,19,0.22)] sm:text-6xl lg:text-7xl xl:text-8xl">
                    candles with
                    <br />
                    personality
                  </h1>
                  <div className="mt-8 flex justify-center">
                    <Link href="/catalogue" className="inline-flex min-w-40 items-center justify-center rounded-full bg-[#fffaf4] px-8 py-4 text-lg lowercase tracking-[0.04em] text-ink shadow-[0_16px_36px_rgba(31,23,19,0.10)] transition hover:scale-[1.02] sm:min-w-48 sm:px-10 sm:py-6 sm:text-2xl">
                      shop all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf4] py-8 sm:py-12">
          <div className="luxury-container">
            <h2 className="serif-title text-center text-4xl font-black lowercase leading-none sm:text-6xl md:text-7xl">
              meet the newbies
            </h2>
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 md:gap-6">
              {(featured.length ? featured : products).slice(0, 2).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative block"
                >
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    sizes="(min-width: 768px) 40vw, 48vw"
                    variant="card"
                  />
                  {index === 0 ? (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-2xl bg-[#ead4bd] px-3 py-2 text-sm font-semibold text-[#2a1b12] shadow-[0_10px_24px_rgba(31,23,19,0.12)] sm:bottom-4 sm:left-4 sm:px-4 sm:py-3 sm:text-xl">
                      10% off
                      <X size={22} strokeWidth={2} className="text-ink/70" />
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="collections" className="luxury-container py-14">
          <div className="mb-8 text-center">
            <p className="text-sm lowercase tracking-[0.08em] text-taupe">something for every mood</p>
            <h2 className="serif-title mt-2 text-4xl font-semibold lowercase sm:text-5xl md:text-6xl">shop by collection</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category, index) => <CollectionCard key={category.id} category={category} index={index} />)}
          </div>
        </section>

        <section className="luxury-container pb-24 pt-16 sm:pb-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm lowercase tracking-[0.08em] text-taupe">shop bestsellers</p>
              <h2 className="serif-title mt-2 text-4xl font-semibold lowercase sm:text-5xl md:text-6xl">customer favourites</h2>
            </div>
            <Link href="/catalogue" className="button-line hidden text-sm lowercase md:inline-block">view catalogue</Link>
          </div>
          <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
            {(featured.length ? featured : products.slice(0, 4)).map((product) => <ProductCard key={product.id} product={product} settings={settings} />)}
          </div>
        </section>

        <section className="bg-[#dfc3a4]">
          <div className="luxury-container grid gap-10 py-12 md:grid-cols-[1fr_0.82fr] md:items-center lg:py-16">
            <div>
              <p className="text-sm lowercase tracking-[0.08em] text-ink/60">save with curated sets</p>
              <h2 className="serif-title mt-3 max-w-xl text-4xl font-semibold leading-none lowercase sm:text-6xl">
                bundle your favourite moments
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-ink/68">
                Pair a signature aroma with a gift-ready candle or mist and create a thoughtful set for your space or someone special.
              </p>
              <Link href="/catalogue" className="button-line mt-7 inline-flex items-center gap-2 lowercase">
                shop bundles
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-[2.35rem] bg-[#dfc3a4]">
              {products[1] ? (
                <ProductImage
                  src={products[1].image_url}
                  alt="Moments by Isha fragrance story"
                  sizes="(min-width: 768px) 45vw, 92vw"
                  variant="detail"
                />
              ) : null}
            </div>
          </div>
        </section>

        <section id="story" className="bg-ink text-porcelain">
          <div className="luxury-container grid gap-10 py-14 md:grid-cols-[0.78fr_1fr] md:items-center lg:py-16">
            <div className="relative overflow-hidden rounded-[2.35rem] bg-clay">
              {products[2] ? (
                <ProductImage
                  src={products[2].image_url}
                  alt="Moments by Isha fragrance details"
                  sizes="(min-width: 768px) 45vw, 92vw"
                  variant="detail"
                />
              ) : null}
            </div>
            <div>
              <p className="text-sm lowercase tracking-[0.08em] text-porcelain/62">created by isha</p>
              <h2 className="serif-title mt-3 text-4xl font-semibold lowercase sm:text-5xl md:text-6xl">fragrance with a handmade heart.</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-porcelain/72">
                Moments by Isha is imagined as a soft, premium aroma house: warm palettes,
                thoughtful details, and products that make ordinary rooms feel composed.
              </p>
              <Link href="/catalogue" className="button-line mt-8 inline-flex items-center gap-2 text-sm lowercase">
                explore catalogue
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f4eadc] py-14">
          <div className="luxury-container grid gap-8 border-y border-ink/10 py-12 text-center md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
            <div>
              <p className="text-sm lowercase tracking-[0.08em] text-taupe">direct ordering</p>
              <h2 className="serif-title mt-2 text-4xl font-semibold lowercase sm:text-5xl">no checkout, just conversation.</h2>
            </div>
            <div className="hidden h-24 w-px bg-ink/10 md:block" />
            <div className="md:justify-self-end">
              <p className="max-w-md text-sm leading-7 text-ink/62">
                Choose one piece or build a small ritual set. Every detail is kept simple, warm, and personal.
              </p>
              <a
                href={`https://wa.me/${(settings.whatsapp_number || "").replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="button-line mt-5 inline-flex items-center gap-2 text-sm lowercase"
              >
                start an order
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <CartWidget settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
