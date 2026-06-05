"use client";

import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminCategories } from "@/lib/admin-data";
import { slugify } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";

const emptyCategory = { id: "", name: "", slug: "", description: "", sort_order: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState(emptyCategory);
  const [notice, setNotice] = useState("");

  async function loadCategories() {
    const { categories, error } = await fetchAdminCategories();
    setCategories(categories);
    setNotice(error || "");
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const payload = { ...draft, slug: draft.slug || slugify(draft.name), description: draft.description || null };
    const { id, ...insertPayload } = payload;
    const result = draft.id
      ? await supabase.from("categories").update(payload, { count: "exact" }).eq("id", draft.id)
      : await supabase.from("categories").insert(insertPayload, { count: "exact" });

    setNotice(result.error ? result.error.message : "Category saved.");
    if (!result.error) setDraft(emptyCategory);
    await loadCategories();
  }

  async function deleteCategory(category: Category) {
    if (!supabase || !window.confirm(`Delete ${category.name}? Products will become uncategorized.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    setNotice(error ? error.message : "Category deleted.");
    await loadCategories();
  }

  return (
    <AdminGuard>
      <AdminShell title="Categories">
        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_430px]">
          <AdminCard>
            {notice ? <p className="mb-5 rounded-md bg-[#f7f1ea] px-5 py-4 text-base text-ink/64">{notice}</p> : null}
            <div className="divide-y divide-ink/10">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-5 py-5">
                  <div>
                    <p className="text-lg font-medium">{category.name}</p>
                    <p className="text-base text-ink/52">{category.slug} - sort {category.sort_order}</p>
                    {category.description ? <p className="mt-1 text-base text-ink/58">{category.description}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDraft({ ...category, description: category.description || "" })} className="rounded-md border border-ink/12 px-4 py-2.5 text-base">
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(category)} className="rounded-md border border-ink/12 px-4 py-2.5 text-clay">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-semibold">{draft.id ? "Edit category" : "Add category"}</h2>
            <form onSubmit={saveCategory} className="mt-5 space-y-5">
              <Field label="Name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
              <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
              <Field label="Description" value={draft.description} onChange={(value) => setDraft((current) => ({ ...current, description: value }))} />
              <label className="block text-base">
                Sort order
                <input
                  type="number"
                  value={draft.sort_order}
                  onChange={(event) => setDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-md border border-ink/12 px-4 py-3.5 text-base outline-none focus:border-ink"
                />
              </label>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-4 text-base text-white">
                <Save size={18} />
                Save category
              </button>
            </form>
          </AdminCard>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-base">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-ink/12 px-4 py-3.5 text-base outline-none focus:border-ink" />
    </label>
  );
}
