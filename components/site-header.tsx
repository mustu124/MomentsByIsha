"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchTerm.trim();
    window.location.href = query ? `/catalogue?q=${encodeURIComponent(query)}` : "/catalogue";
  }

  return (
    <header className="relative z-40 border-b border-[#2a1b12]/10 bg-[#fffaf4]">
      <div className="relative overflow-hidden border-b border-[#2a1b12]/10 bg-[#d8b994] py-3 text-[#2a1b12] sm:py-4">
        <div className="luxury-container flex items-center justify-between gap-3">
          <ChevronLeft className="h-5 w-5 shrink-0" />
          <div className="offer-marquee">
            <span>Get a free 100ml tin candle with any purchase of the new collection!</span>
            <ArrowMark />
            <span>Get a free 100ml tin candle with any purchase of the new collection!</span>
            <ArrowMark />
          </div>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </div>
      </div>

      <nav className="luxury-container flex min-h-[78px] items-center justify-between gap-2 py-3 sm:min-h-[104px] sm:gap-3 lg:gap-6">
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
            <span className="serif-title block truncate text-[clamp(1.65rem,8vw,4.9rem)] font-black italic tracking-normal">
              Moments
            </span>
            <span className="mt-1 block truncate pl-0.5 font-serif text-[clamp(0.68rem,2.45vw,1.7rem)] uppercase tracking-[0.18em] text-[#7f5c38] sm:pl-1 sm:tracking-[0.28em]">
              By Isha
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2a1b12] transition hover:bg-[#f4eadc] sm:h-14 sm:w-14"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsSearchOpen(false);
              setIsMenuOpen((current) => !current);
            }}
          >
            {isMenuOpen ? <X className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.5} /> : <Menu className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2a1b12] transition hover:bg-[#f4eadc] sm:h-14 sm:w-14"
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
            className="relative inline-flex h-10 min-h-10 w-10 items-center justify-center rounded-full border border-[#2a1b12]/12 bg-[#fffaf4] text-[#2a1b12] shadow-[0_10px_24px_rgba(42,27,18,0.08)] transition hover:bg-[#f4eadc] sm:h-14 sm:w-14"
            aria-label="Open catalogue"
          >
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.7} />
          </Link>
        </div>
      </nav>

      {isSearchOpen ? (
        <div className="absolute inset-x-0 top-full z-50 border-t border-[#2a1b12]/10 bg-[#fffaf4] shadow-[0_22px_54px_rgba(42,27,18,0.12)]">
          <form onSubmit={submitSearch} className="luxury-container flex items-center gap-3 py-5">
            <Search className="h-5 w-5 shrink-0 text-[#7f5c38]" />
            <input
              autoFocus
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="search candles, sachets, fragrances"
              className="min-h-12 flex-1 border-0 bg-transparent text-base lowercase text-[#2a1b12] outline-none placeholder:text-[#7f5c38]/62 sm:text-xl"
            />
            <button type="submit" className="rounded-full bg-[#2a1b12] px-5 py-3 text-sm lowercase text-[#fffaf4]">
              search
            </button>
            <button type="button" onClick={() => setIsSearchOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-[#2a1b12]/12 text-[#2a1b12]">
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      ) : null}

      {isMenuOpen ? (
        <div className="absolute inset-x-0 top-full z-50 border-t border-[#2a1b12]/10 bg-[#fffaf4] text-[#2a1b12] shadow-[0_30px_60px_rgba(42,27,18,0.12)]">
          <div className="luxury-container grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_0.75fr] lg:gap-14">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#8d613a]">Shop</p>
              <nav className="grid gap-3 text-[clamp(2rem,5.5vw,4.25rem)] lowercase leading-none">
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link" href="/catalogue">
                  all products
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link" href="/catalogue?category=candles">
                  candles
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link" href="/catalogue?category=wax-sachets">
                  wax sachets
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link" href="/#story">
                  candle care
                </Link>
              </nav>
            </div>

            <div className="rounded-[2rem] bg-[#ead4bd] p-5 sm:p-7">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8d613a]">Contact</p>
              <div className="mt-5 grid gap-4 text-lg lowercase sm:text-xl">
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link-small" href="/#contact">
                  contact
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} className="menu-link-small" href="/catalogue">
                  new collection
                </Link>
              </div>
              <div className="mt-8 border-t border-[#2a1b12]/10 pt-5 text-sm text-ink/62">
                <p>India | INR Rs.</p>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/catalogue"
                  className="mt-4 inline-flex rounded-full bg-[#d8b994] px-5 py-3 text-sm font-medium text-[#2a1b12] shadow-[0_14px_30px_rgba(42,27,18,0.10)]"
                >
                  10% off <span className="ml-3 text-[#2a1b12]/70">x</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ArrowMark() {
  return <span className="mx-5 inline-block text-2xl leading-none sm:text-3xl">{"->"}</span>;
}
