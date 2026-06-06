import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { CartWidget } from "@/components/cart/cart-widget";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getProducts, getSiteSettings } from "@/lib/data";
import { toTitleCase } from "@/lib/display-text";
import type { Product, SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const occasions = [
  {
    title: "Wedding Favours",
    text: "Elegant keepsakes for mehendi, haldi, wedding suites, and guest tables.",
    href: "/catalogue?category=wax-sachets",
  },
  {
    title: "Corporate Gifting",
    text: "Premium fragrance gifts for clients, teams, launches, and festive celebrations.",
    href: "/catalogue",
  },
  {
    title: "Custom Hampers",
    text: "Curated candles, sachets, tags, and packaging for personal occasions.",
    href: "/catalogue",
  },
  {
    title: "Birthday Gifts",
    text: "Warm, memorable pieces made to feel personal, thoughtful, and beautiful.",
    href: "/catalogue",
  },
];

const proofStats = [
  { value: "500+", label: "Orders Crafted" },
  { value: "120+", label: "Custom Gifts Packed" },
  { value: "25+", label: "Events & Bulk Orders" },
  { value: "4.9/5", label: "Average Customer Love" },
];

const testimonials = [
  {
    quote: "The packaging, the fragrance, everything was beyond beautiful. Perfect for gifting.",
    name: "Ananya R.",
    context: "Birthday Hamper",
  },
  {
    quote: "Absolutely in love with the quality and presentation. It felt premium from the moment it arrived.",
    name: "Priya S.",
    context: "Personal Order",
  },
  {
    quote: "Our wedding favours were a huge hit. Everyone loved the candles and the finish looked so elegant.",
    name: "Neha & Arjun",
    context: "Wedding Favours",
  },
  {
    quote: "Elegant, premium and so thoughtfully made. The team gifts felt personal instead of generic.",
    name: "Rohan Mehta",
    context: "Corporate Gifting",
  },
  {
    quote: "The hamper looked luxurious and smelled amazing. It made the whole celebration feel warmer.",
    name: "Meera K.",
    context: "Housewarming Gift",
  },
  {
    quote: "Beautiful attention to detail. The tags, fragrance and presentation all felt made with care.",
    name: "Aditi P.",
    context: "Custom Hamper",
  },
];

function imageFor(products: Product[], index: number) {
  return products[index % Math.max(products.length, 1)];
}

function whatsappHref(settings: SiteSettings, message: string) {
  const phone = (settings.whatsapp_number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const featured = products.filter((product) => product.is_featured);
  const displayProducts = featured.length ? featured : products;
  const heroProduct = displayProducts[0] || products[0];
  const storyProduct = imageFor(displayProducts, 1);
  const galleryProducts = displayProducts.length ? displayProducts.slice(0, 6) : products.slice(0, 6);
  const giftingMessage = "Hi, I would like to discuss gifting, wedding favours, corporate gifting, or custom hampers with Moments by Isha.";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate min-h-[760px] overflow-hidden bg-ink text-porcelain sm:min-h-[780px]">
          {heroProduct?.image_url ? (
            <Image
              src={heroProduct.image_url}
              alt={`${heroProduct.name} by Moments by Isha`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-70 mix-blend-screen saturate-[0.78] sepia-[0.16]"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,27,18,0.9)_0%,rgba(42,27,18,0.64)_42%,rgba(42,27,18,0.24)_100%)]" />
          <div className="luxury-shine absolute inset-0" />

          <div className="luxury-container relative flex min-h-[760px] items-start pb-28 pt-28 sm:min-h-[780px] sm:items-center sm:py-14">
            <div className="luxury-reveal max-w-4xl">
              <p className="font-serif text-base italic text-[#ead4bd] sm:text-2xl">Light, Love, Memories.</p>
              <h1 className="serif-title mt-4 max-w-4xl text-[3.15rem] font-semibold leading-[0.92] sm:mt-5 sm:text-7xl lg:text-8xl xl:text-[8.6rem]">
                Every Moment Deserves A Fragrance.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-porcelain/78 sm:mt-7 sm:text-lg sm:leading-8">
                Handcrafted candles, wax sachets, and luxury gifting experiences designed for weddings,
                celebrations, corporate gestures, and memories that stay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <Link href="/catalogue" className="luxury-button inline-flex min-h-12 items-center justify-center rounded-full bg-porcelain px-7 text-sm font-semibold tracking-[0.05em] text-ink">
                  Explore Collection
                </Link>
                <a
                  href={whatsappHref(settings, giftingMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-porcelain/46 px-7 text-sm font-semibold tracking-[0.05em] text-porcelain transition hover:bg-porcelain hover:text-ink"
                >
                  <MessageCircle size={16} />
                  Plan A Gift
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="gifting" className="bg-[#fffaf4] py-12 sm:py-16">
          <div className="luxury-container">
            <div className="luxury-reveal mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Made For Life's Special Moments</p>
              <h2 className="serif-title mx-auto mt-3 max-w-4xl text-4xl font-semibold leading-none sm:text-6xl">
                Gifting, Favours, And Hampers With A Handmade Heart.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {occasions.map((occasion, index) => {
                const product = imageFor(displayProducts, index);
                return (
                  <Link key={occasion.title} href={occasion.href} className="luxury-card group block overflow-hidden border border-ink/10 bg-white shadow-[0_18px_50px_rgba(42,27,18,0.07)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#ead4bd]">
                      {product?.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={occasion.title}
                          fill
                          sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
                          className="object-cover object-center brightness-[1.05] contrast-[0.92] saturate-[0.78] sepia-[0.16] transition duration-700 group-hover:scale-[1.045]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(42,27,18,0.34))]" />
                    </div>
                    <div className="p-5">
                      <h3 className="serif-title text-2xl font-semibold">{occasion.title}</h3>
                      <p className="mt-3 min-h-20 text-sm leading-6 text-ink/62">{occasion.text}</p>
                      <span className="button-line mt-4 inline-block text-xs tracking-[0.08em]">Explore</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f4eadc] py-14">
          <div className="luxury-container grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:items-center">
            <div className="luxury-image-panel relative min-h-[520px] overflow-hidden bg-[#dfc3a4] shadow-[0_20px_60px_rgba(42,27,18,0.10)]">
              {storyProduct?.image_url ? (
                <Image
                  src={storyProduct.image_url}
                  alt="Moments By Isha luxury gifting detail"
                  fill
                  sizes="(min-width: 1024px) 55vw, 92vw"
                  className="object-cover object-center brightness-[1.04] contrast-[0.9] saturate-[0.76] sepia-[0.16]"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.08),rgba(42,27,18,0.28))]" />
              <div className="absolute bottom-6 left-6 max-w-sm bg-[#fffaf4]/88 p-5 text-ink backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-clay">Signature Experience</p>
                <p className="serif-title mt-2 text-3xl font-semibold leading-none">Fragrance That Feels Personal.</p>
              </div>
            </div>
            <div className="luxury-reveal">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Beyond A Candle Store</p>
              <h2 className="serif-title mt-3 text-4xl font-semibold leading-none sm:text-6xl">
                A Luxury Gifting House For Thoughtful Celebrations.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-ink/68">
                Moments By Isha is built around the emotion behind the gift: the message on a tag,
                the fragrance that fills a room, the favour guests carry home, and the care that makes
                every celebration feel considered.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {["Weddings", "Teams", "Custom Hampers"].map((item) => (
                  <div key={item} className="border-y border-ink/12 py-4">
                    <p className="serif-title text-2xl font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <a href={whatsappHref(settings, giftingMessage)} target="_blank" rel="noreferrer" className="button-line mt-8 inline-flex items-center gap-2 text-sm">
                Enquire For Gifting
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section id="collections" className="bg-[#fffaf4] py-14">
          <div className="luxury-container">
            <div className="luxury-reveal mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-clay">Campaign Edit</p>
                <h2 className="serif-title mt-2 text-4xl font-semibold sm:text-6xl">A Warmer Visual Story.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-ink/58">
                Real product photography is treated with a softer, warmer finish so the collection feels cohesive,
                premium, and ready for gifting.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4 md:grid-rows-[260px_260px]">
              {galleryProducts.slice(0, 5).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`luxury-card group relative aspect-[4/5] overflow-hidden bg-[#ead4bd] shadow-[0_18px_48px_rgba(42,27,18,0.08)] md:aspect-auto ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes={index === 0 ? "(min-width: 768px) 48vw, 92vw" : "(min-width: 768px) 24vw, 92vw"}
                    className="object-cover object-center brightness-[1.05] contrast-[0.9] saturate-[0.76] sepia-[0.16] transition duration-700 group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.08),rgba(42,27,18,0.38))]" />
                  <div className="absolute bottom-4 left-4 right-4 text-porcelain">
                    <p className="text-xs uppercase tracking-[0.18em] text-porcelain/72">{product.categories?.name ? toTitleCase(product.categories.name) : "Moments"}</p>
                    <h3 className="serif-title mt-1 text-2xl font-semibold leading-none">{product.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="bg-ink text-porcelain">
          <div className="luxury-container py-14 lg:py-18">
            <div className="luxury-reveal mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-[#ead4bd]">Hi, I Am Isha</p>
              <h2 className="serif-title mt-3 text-4xl font-semibold leading-none sm:text-6xl md:text-7xl">
                The Heart Behind Moments By Isha.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-porcelain/72">
                Every candle and sachet is created with the feeling of gifting in mind. From selecting the fragrance
                to finishing the packaging, each piece is made to help people celebrate love, gratitude, milestones,
                and quiet everyday rituals.
              </p>
              <div className="mt-8 grid gap-4 border-y border-porcelain/12 py-6 text-sm leading-7 text-porcelain/66 sm:grid-cols-3">
                <p>Handcrafted With Care</p>
                <p>Personalized For Occasions</p>
                <p>Packed For Beautiful Memories</p>
              </div>
              <Link href="/about" className="button-line mt-8 inline-flex items-center gap-2 text-sm">
                Read Our Story
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf4] py-14">
          <div className="luxury-container">
            <div className="luxury-reveal grid gap-6 border-y border-ink/10 py-10 md:grid-cols-[0.82fr_1fr] md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-clay">Customer Love</p>
                <h2 className="serif-title mt-3 text-4xl font-semibold leading-none sm:text-6xl">
                  Trusted For Memories, Milestones, And Beautiful Gifting.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-ink/62 md:justify-self-end">
                From wedding favours to corporate hampers and personal celebrations, Moments By Isha
                has become a go-to for fragrance-led gifting that feels warm, premium, and personal.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proofStats.map((stat) => (
                <div key={stat.label} className="luxury-card border border-ink/10 bg-[#f4eadc] px-5 py-6 text-center">
                  <p className="serif-title text-4xl font-semibold text-ink sm:text-5xl">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink/52">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="luxury-card border border-ink/10 bg-white p-6 shadow-[0_18px_45px_rgba(42,27,18,0.06)]">
                  <div className="flex gap-1 text-[#b98d5d]" aria-label="5 star review">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} />
                    ))}
                  </div>
                  <p className="mt-5 min-h-24 text-sm leading-7 text-ink/68">"{testimonial.quote}"</p>
                  <div className="mt-5 border-t border-ink/10 pt-4">
                    <p className="font-medium text-ink">- {testimonial.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-clay">{testimonial.context}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="luxury-container pb-24 pt-14 sm:pb-16">
          <div className="luxury-reveal mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Shop The Signature Edit</p>
              <h2 className="serif-title mt-2 text-4xl font-semibold sm:text-6xl">Chosen For Gifting.</h2>
            </div>
            <Link href="/catalogue" className="button-line hidden text-sm md:inline-block">View Catalogue</Link>
          </div>
          <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
            {(displayProducts.length ? displayProducts : products).slice(0, 5).map((product) => <ProductCard key={product.id} product={product} settings={settings} />)}
          </div>
        </section>

        <section className="bg-[#dfc3a4]">
          <div className="luxury-container grid gap-8 py-12 md:grid-cols-[1fr_auto_1fr] md:items-center lg:py-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/56">Start With A Conversation</p>
              <h2 className="serif-title mt-2 text-4xl font-semibold leading-none sm:text-5xl">Let Us Create Something Beautiful Together.</h2>
            </div>
            <div className="hidden h-28 w-px bg-ink/12 md:block" />
            <div className="md:justify-self-end">
              <p className="max-w-md text-sm leading-7 text-ink/62">
                Planning a wedding, corporate event, birthday hamper, or a personal gift? Share the occasion
                and Moments By Isha will help you shape the right fragrance experience.
              </p>
              <a
                href={whatsappHref(settings, giftingMessage)}
                target="_blank"
                rel="noreferrer"
                className="luxury-button mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-porcelain"
              >
                <MessageCircle size={16} />
                Chat On WhatsApp
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
