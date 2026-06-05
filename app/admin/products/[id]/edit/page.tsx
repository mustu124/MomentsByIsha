"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { fetchAdminProduct } from "@/lib/admin-data";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminProduct(params.id).then(({ product, error }) => {
      setProduct(product);
      setNotice(error || "");
      setIsLoading(false);
    });
  }, [params.id]);

  return (
    <AdminGuard>
      <AdminShell title="Edit product">
        {isLoading ? <p className="text-sm text-ink/52">Loading product...</p> : null}
        {notice ? <p className="rounded-md bg-white px-4 py-3 text-sm text-clay">{notice}</p> : null}
        {!isLoading && product ? <ProductForm product={product} /> : null}
      </AdminShell>
    </AdminGuard>
  );
}
