"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Save, Trash2, Upload } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { fetchAdminCategories } from "@/lib/admin-data";
import { slugify } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";

type ProductDraft = {
  name: string;
  slug: string;
  description: string;
  price: string;
  size_ml: string;
  category_id: string;
  image_url: string;
  gallery_images: string[];
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
};

const emptyDraft: ProductDraft = {
  name: "",
  slug: "",
  description: "",
  price: "",
  size_ml: "",
  category_id: "",
  image_url: "",
  gallery_images: [],
  is_featured: false,
  is_visible: true,
  sort_order: 0,
};

export function ProductForm({ product }: { product?: Product | null }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(() =>
    product
      ? {
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: product.price || "",
          size_ml: product.size_ml || "",
          category_id: product.category_id || "",
          image_url: product.image_url || "",
          gallery_images: Array.isArray(product.gallery_images) ? product.gallery_images : [],
          is_featured: Boolean(product.is_featured),
          is_visible: Boolean(product.is_visible),
          sort_order: product.sort_order || 0,
        }
      : emptyDraft,
  );
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAdminCategories().then(({ categories }) => setCategories(categories));
  }, []);

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function uploadFile(file: File) {
    if (!supabase) return;
    const sessionResult = await supabase.auth.getSession();
    const accessToken = sessionResult.data.session?.access_token;
    if (!accessToken) {
      setNotice("Please log in again.");
      return "";
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      setNotice(result.error || "Image upload failed. Please try again.");
      return "";
    }

    return result.publicUrl || "";
  }

  async function uploadMainImage(file: File) {
    setIsUploading(true);
    setNotice("Uploading image...");
    try {
      const publicUrl = await uploadFile(file);
      if (publicUrl) {
        update("image_url", publicUrl);
        setNotice("Image uploaded. Click Save product to publish this change.");
      }
    } finally {
      setIsUploading(false);
    }
  }

  async function uploadGalleryImages(files: FileList | null) {
    if (!files?.length) return;
    setIsUploading(true);
    setNotice("Uploading gallery images...");

    const uploadedUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const publicUrl = await uploadFile(file);
        if (publicUrl) uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length) {
        update("gallery_images", [...draft.gallery_images, ...uploadedUrls]);
        setNotice(`${uploadedUrls.length} gallery image${uploadedUrls.length === 1 ? "" : "s"} uploaded. Click Save product to publish.`);
      }
    } finally {
      setIsUploading(false);
    }
  }

  function removeGalleryImage(url: string) {
    update("gallery_images", draft.gallery_images.filter((image) => image !== url));
    setNotice("Gallery image removed. Click Save product to publish this change.");
  }

  function makeMainImage(url: string) {
    update("image_url", url);
    setNotice("Main image changed. Click Save product to publish this change.");
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setIsSaving(true);
    setNotice("");

    const payloadWithSize = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      category_id: draft.category_id || null,
      gallery_images: draft.gallery_images || [],
    };
    const { size_ml: _sizeMl, ...payloadWithoutSize } = payloadWithSize;

    const productId = product?.id || crypto.randomUUID();
    const sessionResult = await supabase.auth.getSession();
    const accessToken = sessionResult.data.session?.access_token;
    if (!accessToken) {
      setIsSaving(false);
      setNotice("Please log in again.");
      return;
    }

    let savedWithoutSize = false;
    let response = await fetch(product?.id ? `/api/admin/products/${productId}` : "/api/admin/products", {
      method: product?.id ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product?.id ? payloadWithSize : { id: productId, ...payloadWithSize }),
    });
    let result = await response.json();

    if (!response.ok && result.error?.toLowerCase().includes("size_ml")) {
      savedWithoutSize = true;
      response = await fetch(product?.id ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: product?.id ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product?.id ? payloadWithoutSize : { id: productId, ...payloadWithoutSize }),
      });
      result = await response.json();
    }

    setIsSaving(false);

    if (!response.ok) {
      setNotice(result.error || "Could not save this product. Please log in again.");
      return;
    }

    setNotice(
      savedWithoutSize
        ? `Saved "${draft.name}". Add the size_ml column in Supabase once to save ml options too.`
        : `Saved "${draft.name}". Public site will reflect this immediately.`,
    );
    router.refresh();
    if (!product?.id) {
      router.push(`/admin/products/${productId}/edit`);
    }
  }

  return (
    <form onSubmit={saveProduct} className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="min-w-0 rounded-md border border-ink/10 bg-white p-6 shadow-sm lg:p-7">
        <div className="grid gap-5">
          <Field label="Product name" value={draft.name} onChange={(value) => {
            update("name", value);
            if (!draft.slug) update("slug", slugify(value));
          }} />
          <Field label="Slug" value={draft.slug} onChange={(value) => update("slug", slugify(value))} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price" value={draft.price} onChange={(value) => update("price", value)} />
            <Field label="Size / ml options" value={draft.size_ml} onChange={(value) => update("size_ml", value)} placeholder="100 ml, 200 ml" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-base">
              Sort order
              <input
                type="number"
                value={draft.sort_order}
                onChange={(event) => update("sort_order", Number(event.target.value))}
                className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3.5 text-base outline-none focus:border-ink"
              />
            </label>
            <label className="block text-base">
              Category
              <select
                value={draft.category_id}
                onChange={(event) => update("category_id", event.target.value)}
                className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3.5 text-base outline-none focus:border-ink"
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-base">
            Description
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              className="mt-2 min-h-56 w-full rounded-md border border-ink/12 bg-white px-4 py-3.5 text-base outline-none focus:border-ink"
            />
          </label>
          <Field label="Image URL" value={draft.image_url} onChange={(value) => update("image_url", value)} />
        </div>
      </section>

      <aside className="min-w-0 space-y-5">
        <section className="rounded-md border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Product image</h2>
          <div className="mx-auto mt-4 max-w-[410px]">
            <ProductImage
              src={draft.image_url}
              alt={draft.name || "Product image preview"}
              sizes="360px"
              variant="admin"
            />
          </div>
          <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ink/20 bg-[#f7f1ea] px-5 py-4 text-base">
            <Upload size={18} />
            {isUploading ? "Uploading..." : "Upload image"}
            <input
              className="hidden"
              type="file"
              accept="image/*,.webp,.jpg,.jpeg,.png,.heic,.heif"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (file) uploadMainImage(file);
              }}
            />
          </label>
        </section>

        <section className="rounded-md border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Product gallery</h2>
          <p className="mt-1 text-base text-ink/52">Add more images for this product. These appear on the product page.</p>
          <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ink/20 bg-[#f7f1ea] px-5 py-4 text-base">
            <ImagePlus size={18} />
            {isUploading ? "Uploading..." : "Upload gallery images"}
            <input
              className="hidden"
              multiple
              type="file"
              accept="image/*,.webp,.jpg,.jpeg,.png,.heic,.heif"
              onChange={(event) => {
                const files = event.currentTarget.files;
                uploadGalleryImages(files);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {draft.gallery_images.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
              {draft.gallery_images.map((url) => (
                <div key={url} className="overflow-hidden rounded-md border border-ink/10 bg-[#fffaf4]">
                  <div className="relative aspect-square">
                    <Image src={url} alt="Product gallery image" fill sizes="160px" className="object-cover" />
                  </div>
                  <div className="grid grid-cols-2 border-t border-ink/10 text-xs">
                    <button type="button" onClick={() => makeMainImage(url)} className="px-2 py-2 hover:bg-[#f4eadc]">
                      main
                    </button>
                    <button type="button" onClick={() => removeGalleryImage(url)} className="inline-flex items-center justify-center gap-1 px-2 py-2 text-clay hover:bg-[#f4eadc]">
                      <Trash2 size={12} />
                      remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-md border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Publishing</h2>
          <div className="mt-4 space-y-3 text-base">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.is_visible} onChange={(event) => update("is_visible", event.target.checked)} />
              Visible on public site
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.is_featured} onChange={(event) => update("is_featured", event.target.checked)} />
              Featured product
            </label>
          </div>
          <button disabled={isSaving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-4 text-base font-medium text-white disabled:opacity-60">
            <Save size={18} />
            {isSaving ? "Saving..." : "Save product"}
          </button>
          {notice ? <p className="mt-3 text-base text-clay">{notice}</p> : null}
        </section>
      </aside>
    </form>
  );
}

function Field({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-base">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3.5 text-base outline-none focus:border-ink"
      />
    </label>
  );
}
