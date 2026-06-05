"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminCategories, fetchAdminProducts, fetchAdminSettings } from "@/lib/admin-data";
import type { Category, Product, SiteSettings } from "@/lib/types";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminProducts(), fetchAdminCategories(), fetchAdminSettings()]).then(([productResult, categoryResult, settingsResult]) => {
      setProducts(productResult.products);
      setCategories(categoryResult.categories);
      setSettings(settingsResult.settings);
    });
  }, []);

  return (
    <AdminGuard>
      <AdminShell
        title="Dashboard"
        action={
          <Link href="/admin/products/new" className="hidden items-center gap-2 rounded-md bg-ink px-5 py-3 text-base text-white sm:inline-flex">
            <Plus size={18} />
            Add product
          </Link>
        }
      >
        <div className="grid gap-5 md:grid-cols-3">
          <AdminCard>
            <p className="text-base text-ink/52">Products</p>
            <p className="mt-2 text-4xl font-semibold">{products.length}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-base text-ink/52">Visible</p>
            <p className="mt-2 text-4xl font-semibold">{products.filter((product) => product.is_visible).length}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-base text-ink/52">Categories</p>
            <p className="mt-2 text-4xl font-semibold">{categories.length}</p>
          </AdminCard>
        </div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <AdminCard>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Recent products</h2>
              <Link href="/admin/products" className="text-base text-ink/58">View all</Link>
            </div>
            <div className="mt-4 divide-y divide-ink/10">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 py-4 text-base">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-ink/52">{product.price || "No price"} · sort {product.sort_order}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-sm ${product.is_visible ? "bg-olive/12 text-olive" : "bg-clay/12 text-clay"}`}>
                    {product.is_visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
          <AdminCard>
            <h2 className="text-2xl font-semibold">Ordering settings</h2>
            <div className="mt-4 space-y-3 text-base text-ink/62">
              <p>WhatsApp: {settings?.whatsapp_number || "Not set"}</p>
              <p>Template: {settings?.whatsapp_message_template || "Not set"}</p>
            </div>
            <Link href="/admin/settings" className="mt-5 inline-flex rounded-md border border-ink/12 px-5 py-3 text-base">
              Edit settings
            </Link>
          </AdminCard>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
