"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    }

    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchTerm.trim();
    window.location.href = query ? `/catalogue?q=${encodeURIComponent(query)}` : "/catalogue";
  }

  function closeMenu() {
    const toggle = document.getElementById("site-menu-toggle") as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
    setIsMenuOpen(false);
  }

  function openMenu() {
    const toggle = document.getElementById("site-menu-toggle") as HTMLInputElement | null;
    if (toggle) toggle.checked = true;
    setIsSearchOpen(false);
    setIsMenuOpen(true);
  }

  return (
    <>
      <input id="site-menu-toggle" className="site-menu-toggle sr-only" type="checkbox" aria-hidden="true" />
      <header className="relative z-[90] border-b border-[#2a1b12]/10 bg-[#fffaf4]">
        <div className="relative overflow-hidden border-b border-[#2a1b12]/10 bg-[#d8b994] py-3 text-[#2a1b12] sm:py-4">
          <div className="luxury-container flex items-center justify-between gap-3">
            <ChevronLeft className="h-5 w-5 shrink-0" />
            <div className="offer-marquee">
              <span>Complimentary 100ml Tin Candle With The New Collection.</span>
              <ArrowMark />
              <span>Wedding Favours, Corporate Gifting And Custom Hampers Now Open.</span>
              <ArrowMark />
            </div>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </div>
        </div>

        <nav className="luxury-container flex min-h-[78px] items-center justify-between gap-3 py-3 sm:min-h-[104px] lg:gap-6">
          <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4" aria-label="Moments By Isha home">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#efe1d2] shadow-[0_10px_28px_rgba(42,27,18,0.12)] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <Image
                src="/brand/moments-by-isha-logo.png"
                alt="Moments By Isha logo"
                fill
                priority
                sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 48px"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </span>
            <span className="min-w-0 leading-none text-[#5f3f23]">
              <span className="serif-title block truncate text-[clamp(1.65rem,6.5vw,4.6rem)] font-black italic tracking-normal">
                Moments
              </span>
              <span className="mt-1 block truncate pl-0.5 font-serif text-[clamp(0.68rem,2vw,1.55rem)] uppercase tracking-[0.18em] text-[#7f5c38] sm:pl-1 sm:tracking-[0.28em]">
                By Isha
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-2">
            <label
              role="button"
              tabIndex={0}
              htmlFor="site-menu-toggle"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f4eadc] text-[#2a1b12] transition hover:bg-[#ead4bd] sm:h-16 sm:w-16"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              onClick={openMenu}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") openMenu();
              }}
            >
              <Menu className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.55} />
            </label>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[#2a1b12] transition hover:bg-[#f4eadc] sm:h-16 sm:w-16"
              aria-label="Search catalogue"
              aria-expanded={isSearchOpen}
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen((current) => !current);
              }}
            >
              <Search className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.7} />
            </button>
            <Link
              href="/catalogue"
              className="relative inline-flex h-12 min-h-12 w-12 items-center justify-center rounded-full border border-[#2a1b12]/12 bg-[#fffaf4] text-[#2a1b12] shadow-[0_10px_24px_rgba(42,27,18,0.08)] transition hover:bg-[#f4eadc] sm:h-16 sm:w-16"
              aria-label="Open catalogue"
            >
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.7} />
            </Link>
          </div>
        </nav>

        {isSearchOpen ? (
          <div className="absolute inset-x-0 top-full z-[95] border-t border-[#2a1b12]/10 bg-[#fffaf4] shadow-[0_22px_54px_rgba(42,27,18,0.12)]">
            <form onSubmit={submitSearch} className="luxury-container flex items-center gap-3 py-5">
              <Search className="h-5 w-5 shrink-0 text-[#7f5c38]" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Candles, Sachets, Hampers"
                className="min-h-12 flex-1 border-0 bg-transparent text-base text-[#2a1b12] outline-none placeholder:text-[#7f5c38]/62 sm:text-xl"
              />
              <button type="submit" className="rounded-full bg-[#2a1b12] px-5 py-3 text-sm text-[#fffaf4]">
                Search
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-[#2a1b12]/12 text-[#2a1b12]">
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>
        ) : null}
      </header>

      <div id="site-menu" className="site-menu-panel fixed inset-0 z-[999] overflow-y-auto bg-[#fffaf4] text-[#2a1b12]" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="luxury-shine pointer-events-none absolute inset-0 opacity-40" />
          <div className="luxury-container relative py-5 sm:py-7">
            <div className="flex items-center justify-between gap-4 border-b border-[#2a1b12]/10 pb-5">
              <Link onClick={closeMenu} href="/" className="flex items-center gap-3" aria-label="Moments By Isha home">
                <span className="relative h-14 w-14 overflow-hidden rounded-full bg-[#efe1d2]">
                  <Image src="/brand/moments-by-isha-logo.png" alt="Moments By Isha logo" fill sizes="56px" className="object-cover" />
                </span>
                <span>
                  <span className="serif-title block text-3xl font-black italic leading-none text-[#5f3f23]">Moments</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.28em] text-[#7f5c38]">By Isha</span>
                </span>
              </Link>
              <label
                role="button"
                tabIndex={0}
                htmlFor="site-menu-toggle"
                onClick={closeMenu}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") closeMenu();
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#2a1b12]/12 bg-white text-[#2a1b12] shadow-[0_10px_24px_rgba(42,27,18,0.08)]"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </label>
            </div>

            <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_0.72fr] lg:gap-14">
              <div className="luxury-reveal">
                <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#8d613a]">Explore</p>
                <nav className="grid gap-3 text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.88]">
                  <Link onClick={closeMenu} className="menu-link" href="/catalogue">
                    All Products
                  </Link>
                  <Link onClick={closeMenu} className="menu-link" href="/#gifting">
                    Gift Hampers
                  </Link>
                  <Link onClick={closeMenu} className="menu-link" href="/#gifting">
                    Wedding Favours
                  </Link>
                  <Link onClick={closeMenu} className="menu-link" href="/#gifting">
                    Corporate Gifting
                  </Link>
                  <Link onClick={closeMenu} className="menu-link" href="/about">
                    About Isha
                  </Link>
                </nav>
              </div>

              <div className="luxury-card bg-[#ead4bd] p-5 sm:p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d613a]">Gifting Concierge</p>
                <h2 className="serif-title mt-4 text-4xl font-semibold leading-none sm:text-5xl">
                  Candles, Hampers, And Favours Made For Beautiful Memories.
                </h2>
                <div className="mt-7 grid gap-4 text-lg sm:text-xl">
                  <Link onClick={closeMenu} className="menu-link-small" href="/#contact">
                    Contact
                  </Link>
                  <Link onClick={closeMenu} className="menu-link-small" href="/about">
                    Brand Story
                  </Link>
                  <Link onClick={closeMenu} className="menu-link-small" href="/catalogue">
                    New Collection
                  </Link>
                </div>
                <div className="mt-8 border-t border-[#2a1b12]/10 pt-5 text-sm text-ink/62">
                  <p>India | INR Rs.</p>
                  <Link onClick={closeMenu} href="/catalogue" className="luxury-button mt-4 inline-flex rounded-full bg-[#2a1b12] px-5 py-3 text-sm font-medium text-[#fffaf4]">
                    Shop Signature Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

function ArrowMark() {
  return <span className="mx-5 inline-block text-2xl leading-none sm:text-3xl">{"->"}</span>;
}
