"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductImage } from "@/components/product-image";
import { fetchAdminProducts } from "@/lib/admin-data";
import { getSafeAdminAccessToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    const { products, error } = await fetchAdminProducts();
    setProducts(products);
    setNotice(error || "");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(product: Product) {
    if (!supabase || !window.confirm(`Delete ${product.name}?`)) return;
    const accessToken = await getSafeAdminAccessToken();
    if (!accessToken) {
      setNotice("Please log in again.");
      return;
    }

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const result = await response.json();
    setNotice(response.ok ? "Product deleted." : result.error || "Could not delete product.");
    if (response.ok) await loadProducts();
  }

  return (
    <AdminGuard>
      <AdminShell
        title="Products"
        action={
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-base text-white">
            <Plus size={18} />
            New
          </Link>
        }
      >
        <AdminCard>
          {notice ? <p className="mb-5 rounded-md bg-[#f7f1ea] px-5 py-4 text-base text-ink/64">{notice}</p> : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-base">
              <thead className="border-b border-ink/10 text-sm uppercase tracking-[0.12em] text-ink/48">
                <tr>
                  <th className="py-4">Product</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Sort</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 overflow-hidden rounded-md">
                          <ProductImage src={product.image_url} alt={product.name} sizes="80px" variant="thumb" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-ink/48">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-ink/62">{product.categories?.name || "Uncategorized"}</td>
                    <td className="py-5">{product.price || "-"}</td>
                    <td className="py-5">{product.sort_order}</td>
                    <td className="py-5">
                      <span className={`rounded-full px-3 py-1.5 text-sm ${product.is_visible ? "bg-olive/12 text-olive" : "bg-clay/12 text-clay"}`}>
                        {product.is_visible ? "Visible" : "Hidden"}
                      </span>
                      {product.is_featured ? <span className="ml-2 rounded-full bg-ink/8 px-3 py-1.5 text-sm">Featured</span> : null}
                    </td>
                    <td className="py-5">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/12">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => deleteProduct(product)} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/12 text-clay">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </AdminShell>
    </AdminGuard>
  );
}
