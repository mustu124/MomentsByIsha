"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { productToCartItem, type CartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";

const storageKey = "moments-by-isha-cart";

function readCart(): CartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("moments-cart-updated"));
}

export function AddToCartButton({ product, selectedSize = "" }: { product: Product; selectedSize?: string }) {
  const [addedQuantity, setAddedQuantity] = useState(0);
  const cartId = selectedSize ? `${product.id}:${selectedSize}` : product.id;

  useEffect(() => {
    function syncQuantity() {
      const item = readCart().find((cartItem) => cartItem.id === cartId);
      setAddedQuantity(item?.quantity || 0);
    }

    syncQuantity();
    window.addEventListener("storage", syncQuantity);
    window.addEventListener("moments-cart-updated", syncQuantity);
    return () => {
      window.removeEventListener("storage", syncQuantity);
      window.removeEventListener("moments-cart-updated", syncQuantity);
    };
  }, [cartId]);

  function writeUpdatedQuantity(quantity: number) {
    const items = readCart();
    const nextItem = productToCartItem(product, selectedSize);
    const withoutItem = items.filter((item) => item.id !== nextItem.id);
    const next = quantity > 0 ? [...withoutItem, { ...nextItem, quantity }] : withoutItem;

    writeCart(next);
    setAddedQuantity(quantity);
  }

  function addToCart() {
    const nextItem = productToCartItem(product, selectedSize);
    const items = readCart();
    const existing = items.find((item) => item.id === nextItem.id);
    const next = existing
      ? items.map((item) => (item.id === nextItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...items, nextItem];

    writeCart(next);
    const updated = next.find((item) => item.id === nextItem.id);
    setAddedQuantity(updated?.quantity || 1);
  }

  return (
    <div className="mt-2 h-[72px]">
      {addedQuantity > 0 ? (
        <div className="grid h-12 grid-cols-[44px_1fr_44px] overflow-hidden rounded-full border border-[#b98d5d] bg-[#ead4bd] text-ink">
          <button
            type="button"
            onClick={() => writeUpdatedQuantity(Math.max(0, addedQuantity - 1))}
            className="grid place-items-center transition hover:bg-[#d8b994]"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <div className="grid place-items-center text-sm font-semibold">
            {addedQuantity}
          </div>
          <button
            type="button"
            onClick={() => writeUpdatedQuantity(addedQuantity + 1)}
            className="grid place-items-center transition hover:bg-[#d8b994]"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      ) : (
        <button
          onClick={addToCart}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/18 bg-[#fffaf4]/70 px-3 text-[11px] font-medium tracking-[0.03em] text-ink transition hover:bg-[#f4eadc] sm:px-4 sm:text-sm"
        >
          <ShoppingBag size={16} />
          Add To Order
        </button>
      )}
      <div className="h-5 pt-1 text-center text-[10px] leading-4 text-ink/50">
        {selectedSize || ""}
      </div>
    </div>
  );
}
