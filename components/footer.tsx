import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const phone = settings.whatsapp_number || "+91 76665 79729";

  return (
    <footer id="contact" className="border-t border-ink/10 bg-ink text-porcelain">
      <div className="luxury-container grid gap-10 py-12 md:grid-cols-[1.35fr_0.8fr_1.15fr] md:gap-14">
        <div>
          <BrandLogo size="md" invert />
          <p className="mt-4 max-w-md text-sm leading-7 text-porcelain/70">
            Softly luxurious fragrance, aroma, and lifestyle products crafted for gifting,
            rituals, and beautiful everyday spaces.
          </p>
        </div>
        <nav className="space-y-3 text-sm text-porcelain/72">
          <p className="text-xs uppercase tracking-[0.2em] text-porcelain">Explore</p>
          <Link className="block" href="/catalogue">Catalogue</Link>
          <Link className="block" href="/#collections">Collections</Link>
          <Link className="block" href="/#story">Brand story</Link>
        </nav>
        <div className="space-y-4 text-sm text-porcelain/72">
          <p className="text-xs uppercase tracking-[0.2em] text-porcelain">Connect</p>
          <div className="space-y-2">
            <a className="block leading-6" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
            {settings.contact_email ? <a className="block leading-6" href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> : null}
            {settings.instagram_url ? (
              <a className="block leading-6" href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram</a>
            ) : null}
          </div>
          <a
            href={`https://wa.me/${phone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-porcelain/24 px-5 py-2 text-porcelain transition hover:bg-porcelain hover:text-ink"
          >
            start an order
          </a>
        </div>
      </div>
    </footer>
  );
}
