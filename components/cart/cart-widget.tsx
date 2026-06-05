"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartItemToProduct, type CartItem } from "@/lib/cart";
import { createGroupedOrderMessage, createWhatsAppMessageUrl } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";

const storageKey = "moments-by-isha-cart";

function readCart(): CartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("moments-cart-updated"));
}

export function CartWidget({ settings }: { settings: SiteSettings }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function syncCart() {
      setItems(readCart());
    }

    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("moments-cart-updated", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("moments-cart-updated", syncCart);
    };
  }, []);

  const count = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const whatsappUrl = useMemo(() => {
    const products = items.map(cartItemToProduct);
    const message = createGroupedOrderMessage(products, settings);
    return createWhatsAppMessageUrl(message, settings);
  }, [items, settings]);

  function updateQuantity(id: string, delta: number) {
    const next = items
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
      .filter((item) => item.quantity > 0);
    setItems(next);
    saveCart(next);
  }

  function clearCart() {
    setItems([]);
    saveCart([]);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-14 items-center gap-3 rounded-full border border-[#d8b994]/35 bg-ink px-5 py-3 text-sm font-semibold lowercase text-[#fffaf4] shadow-[0_18px_44px_rgba(42,27,18,0.28)] transition hover:bg-[#6d4a2d] sm:bottom-6 sm:right-6 sm:min-h-16 sm:px-6 sm:text-base"
      >
        <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />
        order cart
        <span className="grid h-8 min-w-8 place-items-center rounded-full bg-[#fffaf4] px-2 text-sm text-ink">{count}</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button className="absolute inset-0 bg-ink/42" aria-label="Close cart" onClick={() => setIsOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffaf4] shadow-soft">
            <header className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ink/48">WhatsApp order</p>
                <h2 className="text-2xl font-semibold">Order cart</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/12">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <article key={item.id} className="grid grid-cols-[72px_1fr] gap-3 border-b border-ink/10 pb-4">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4eadc]">
                        {item.image_url ? <Image src={item.image_url} alt={item.name} fill sizes="72px" className="object-cover" /> : null}
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="mt-1 text-sm text-ink/52">{item.price || "Price on request"}</p>
                            {item.selectedSize ? <p className="mt-1 text-xs text-ink/52">{item.selectedSize}</p> : null}
                            {item.categoryName ? <p className="mt-1 text-xs text-ink/45">{item.categoryName}</p> : null}
                          </div>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-clay">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-3 inline-flex items-center rounded-full border border-ink/12">
                          <button onClick={() => updateQuantity(item.id, -1)} className="grid h-8 w-8 place-items-center">
                            <Minus size={14} />
                          </button>
                          <span className="grid h-8 min-w-8 place-items-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="grid h-8 w-8 place-items-center">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center text-center text-sm text-ink/56">
                  <p>Your order cart is empty.</p>
                </div>
              )}
            </div>

            <footer className="border-t border-ink/10 p-5">
              <a
                href={items.length ? whatsappUrl : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!items.length}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-medium lowercase text-[#fffaf4] ${
                  items.length ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <MessageCircle size={16} />
                send order on whatsapp
              </a>
              {items.length ? (
                <button onClick={clearCart} className="mt-3 w-full text-center text-sm text-ink/52">
                  clear order cart
                </button>
              ) : null}
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  );
}
