"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";

const primaryMenuLinks = [
  { label: "New & Trending", href: "/catalogue" },
  { label: "Gift Hampers", href: "/#gifting" },
  { label: "Wedding Favours", href: "/#gifting" },
  { label: "Corporate Gifting", href: "/#gifting" },
  { label: "Custom Hampers", href: "/#gifting" },
  { label: "Candles & Home", href: "/catalogue" },
];

const secondaryMenuLinks = [
  { label: "About Moments By Isha", href: "/about" },
  { label: "Contact", href: "/#contact" },
  { label: "Shop Signature Edit", href: "/catalogue" },
];

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

  function submitMenuSearch(event: React.FormEvent<HTMLFormElement>) {
    submitSearch(event);
    closeMenu();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function openMenu() {
    setIsSearchOpen(false);
    setIsMenuOpen(true);
  }

  return (
    <>
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
            <span className="relative h-12 w-12 shrink-0 overflow-hidden sm:h-20 sm:w-20 lg:h-24 lg:w-24">
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
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f4eadc] text-[#2a1b12] transition hover:bg-[#ead4bd] sm:h-16 sm:w-16"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              onClick={openMenu}
            >
              <Menu className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.55} />
            </button>
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

      {isMenuOpen ? (
        <div id="site-menu" className="fixed inset-0 z-[999] overflow-y-auto bg-[#fffaf4] text-[#2a1b12]" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="pointer-events-none fixed inset-y-0 right-0 w-px bg-[#2a1b12]/10" />
          <div className="mx-auto min-h-screen w-full max-w-[1120px] px-6 pb-8 pt-4 sm:px-10 sm:pb-12 sm:pt-6 lg:px-14">
            <div className="grid min-h-14 grid-cols-[2.5rem_1fr_5.25rem] items-center gap-3 border-b border-[#2a1b12]/10 pb-3 sm:min-h-20 sm:grid-cols-[3.75rem_1fr_7rem] sm:gap-4 sm:pb-5">
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center text-[#2a1b12] transition hover:text-[#8d613a] sm:h-12 sm:w-12"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={1.45} />
              </button>

              <Link onClick={closeMenu} href="/" className="justify-self-center text-center leading-none" aria-label="Moments By Isha home">
                <span className="serif-title block text-[clamp(1.8rem,6.3vw,3.6rem)] font-semibold italic text-[#5f3f23]">
                  Moments
                </span>
                <span className="mt-0.5 block font-serif text-[clamp(0.58rem,1.55vw,1rem)] uppercase tracking-[0.22em] text-[#7f5c38]">
                  By Isha
                </span>
              </Link>

              <div className="flex items-center justify-end gap-2 text-[#2a1b12] sm:gap-4">
                <Link onClick={closeMenu} href="/admin/login" className="inline-flex h-8 w-8 items-center justify-center transition hover:text-[#8d613a] sm:h-10 sm:w-10" aria-label="Admin Login">
                  <User className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={1.45} />
                </Link>
                <Link onClick={closeMenu} href="/catalogue" className="inline-flex h-8 w-8 items-center justify-center transition hover:text-[#8d613a] sm:h-10 sm:w-10" aria-label="Open Catalogue">
                  <ShoppingBag className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={1.45} />
                </Link>
              </div>
            </div>

            <form onSubmit={submitMenuSearch} className="mt-4 flex min-h-12 items-center gap-3 border border-[#2a1b12]/14 bg-white/54 px-4 shadow-[0_10px_24px_rgba(42,27,18,0.04)] sm:mt-7 sm:min-h-16 sm:gap-4 sm:px-7">
              <Search className="h-5 w-5 shrink-0 text-[#2a1b12] sm:h-7 sm:w-7" strokeWidth={1.45} />
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search For A Scent"
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-[#2a1b12] outline-none placeholder:text-[#2a1b12]/48 sm:text-2xl"
              />
            </form>

            <nav className="mt-4 border-b border-[#2a1b12]/10 sm:mt-7">
              {primaryMenuLinks.map((item) => (
                <Link
                  key={item.label}
                  onClick={closeMenu}
                  href={item.href}
                  className="menu-drawer-link group"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-6 w-6 shrink-0 transition duration-300 group-hover:translate-x-1 sm:h-9 sm:w-9" strokeWidth={1.35} />
                </Link>
              ))}
            </nav>

            <nav className="pt-4 sm:pt-7">
              {secondaryMenuLinks.map((item) => (
                <Link
                  key={item.label}
                  onClick={closeMenu}
                  href={item.href}
                  className="menu-drawer-link menu-drawer-link-secondary group"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-5 w-5 shrink-0 transition duration-300 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.35} />
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-[#2a1b12]/10 pt-4 text-xs leading-6 text-[#7f5c38] sm:mt-10 sm:flex sm:items-center sm:justify-between sm:pt-6 sm:text-sm">
              <p>India | INR Rs.</p>
              <p className="mt-2 sm:mt-0">Luxury Gifting, Wedding Favours, And Custom Hampers</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ArrowMark() {
  return <span className="mx-5 inline-block text-2xl leading-none sm:text-3xl">{"->"}</span>;
}
