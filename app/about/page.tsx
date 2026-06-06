import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Heart, MessageCircle, Sparkles } from "lucide-react";
import { CartWidget } from "@/components/cart/cart-widget";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getProducts, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const principles = [
  {
    icon: Heart,
    title: "Warmth",
    text: "Every piece is created to feel personal, gentle, and emotionally considered.",
  },
  {
    icon: Sparkles,
    title: "Luxury",
    text: "Soft finishes, premium aromas, and details that make gifting feel elevated.",
  },
  {
    icon: Gift,
    title: "Thoughtful",
    text: "Designed for weddings, corporate gestures, birthdays, and keepsake moments.",
  },
];

export default async function AboutPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const heroImage = products[0]?.image_url;
  const detailImage = products[1]?.image_url || heroImage;
  const phone = (settings.whatsapp_number || "").replace(/[^\d]/g, "");
  const message = encodeURIComponent("Hi, I would like to know more about Moments by Isha and custom gifting options.");

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-porcelain">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Moments By Isha fragrance and gifting"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-48 mix-blend-screen saturate-[0.76] sepia-[0.16]"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,27,18,0.92),rgba(42,27,18,0.62),rgba(42,27,18,0.32))]" />
          <div className="luxury-shine absolute inset-0" />
          <div className="luxury-container relative grid min-h-[620px] items-center gap-10 py-16 md:grid-cols-[1fr_0.62fr]">
            <div className="luxury-reveal max-w-4xl">
              <p className="font-serif text-xl italic text-[#ead4bd]">The Story Behind The Scent.</p>
              <h1 className="serif-title mt-5 text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
                The Heart Behind Moments By Isha.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-porcelain/76 sm:text-lg">
                A premium fragrance and gifting brand created to make ordinary moments feel remembered,
                celebrated, and beautifully personal.
              </p>
            </div>
            <div className="luxury-image-panel relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden border border-porcelain/16 bg-[#ead4bd] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="/brand/isha-profile.jpg"
                  alt="Isha, founder of Moments By Isha"
                  fill
                  sizes="360px"
                  className="object-cover object-[50%_24%] brightness-[1.05] contrast-[0.9] saturate-[0.72] sepia-[0.16]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf4] py-14">
          <div className="luxury-container grid gap-10 md:grid-cols-[0.72fr_1fr] md:items-center">
            <div className="luxury-image-panel relative min-h-[520px] overflow-hidden bg-[#ead4bd]">
              {detailImage ? (
                <Image
                  src={detailImage}
                  alt="Moments By Isha handmade product detail"
                  fill
                  sizes="(min-width: 768px) 42vw, 92vw"
                  className="object-cover object-center brightness-[1.04] contrast-[0.9] saturate-[0.76] sepia-[0.16]"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(42,27,18,0.32))]" />
            </div>
            <div className="luxury-reveal">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Hi, I Am Isha</p>
              <h2 className="serif-title mt-3 text-4xl font-semibold leading-none sm:text-6xl">
                Every Candle Is A Piece Of My Heart.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink/68">
                From selecting fine ingredients to hand-pouring each candle and finishing every
                gift-ready detail, the goal is simple: to help people create beautiful memories
                with the people they love.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/68">
                Moments By Isha is not designed to feel like a standard store. It is a warm,
                minimal, premium gifting experience for weddings, corporate gifting, personal
                hampers, home rituals, and thoughtful celebrations.
              </p>
              <Link href="/catalogue" className="button-line mt-8 inline-flex items-center gap-2 text-sm">
                Explore The Collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f4eadc] py-14">
          <div className="luxury-container">
            <div className="luxury-reveal mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">What The Brand Stands For</p>
              <h2 className="serif-title mt-3 text-4xl font-semibold leading-none sm:text-6xl">
                Emotional, Luxurious, Thoughtful, Personal, Timeless.
              </h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article key={principle.title} className="luxury-card border border-ink/10 bg-[#fffaf4] p-7 shadow-[0_18px_45px_rgba(42,27,18,0.06)]">
                    <Icon className="h-6 w-6 text-clay" />
                    <h3 className="serif-title mt-6 text-3xl font-semibold">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/62">{principle.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#dfc3a4]">
          <div className="luxury-container grid gap-8 py-12 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/56">Custom Gifting</p>
              <h2 className="serif-title mt-2 text-4xl font-semibold leading-none sm:text-5xl">
                Let Us Create Something Beautiful Together.
              </h2>
            </div>
            <div className="hidden h-28 w-px bg-ink/12 md:block" />
            <div className="md:justify-self-end">
              <p className="max-w-md text-sm leading-7 text-ink/62">
                Planning a wedding, corporate event, or a meaningful personal gift? Share the occasion and
                Moments By Isha will help you shape the right fragrance experience.
              </p>
              <a
                href={`https://wa.me/${phone}?text=${message}`}
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
