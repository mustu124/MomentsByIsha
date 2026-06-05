"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { createWhatsAppUrl, getProductMlOptions } from "@/lib/data";
import type { Product, SiteSettings } from "@/lib/types";

export function ProductActions({ product, settings, compact = false }: { product: Product; settings: SiteSettings; compact?: boolean }) {
  const options = useMemo(() => getProductMlOptions(product), [product]);
  const [selectedSize, setSelectedSize] = useState(options[0] || "");
  const orderProduct = selectedSize ? { ...product, selected_size: selectedSize } : product;

  return (
    <div className={compact ? "mt-auto min-h-[172px]" : "min-h-[172px]"}>
      <div className="mb-3 h-[64px]">
        {options.length ? (
          <>
          <p className="mb-2 text-[11px] lowercase tracking-[0.06em] text-ink/56">select size</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedSize(option)}
                className={`min-h-9 rounded-full border px-3 text-[11px] font-medium lowercase tracking-[0.03em] transition sm:px-4 sm:text-xs ${
                  selectedSize === option ? "border-ink bg-ink text-porcelain" : "border-ink/14 bg-[#fffaf4]/80 text-ink hover:bg-[#f4eadc]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          </>
        ) : null}
      </div>

      <a
        href={createWhatsAppUrl(orderProduct, settings)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ink bg-ink px-3 py-3 text-[11px] font-medium lowercase tracking-[0.03em] text-porcelain transition hover:bg-[#6d4a2d] sm:min-h-12 sm:px-4 sm:text-sm"
      >
        <MessageCircle size={15} />
        order now
      </a>
      <AddToCartButton product={product} selectedSize={selectedSize} />
    </div>
  );
}
