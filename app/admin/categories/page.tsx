"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderPlus, Plus, Save, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminCategories } from "@/lib/admin-data";
import { getSafeAdminAccessToken } from "@/lib/admin-session";
import { slugify } from "@/lib/data";
import type { Category } from "@/lib/types";

type CategoryDraft = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  sort_order: number;
};

const emptyCategory: CategoryDraft = { id: "", name: "", slug: "", description: "", parent_id: "", sort_order: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<CategoryDraft>(emptyCategory);
  const [notice, setNotice] = useState("");

  const parentCategories = useMemo(() => categories.filter((category) => !category.parent_id), [categories]);
  const childCategories = useMemo(() => categories.filter((category) => category.parent_id), [categories]);

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
    const accessToken = await getSafeAdminAccessToken();
    if (!accessToken) {
      setNotice("Please log in again.");
      return;
    }

    const payload = {
      name: draft.name,
      slug: draft.slug || slugify(draft.name),
      description: draft.description || null,
      parent_id: draft.parent_id || null,
      sort_order: draft.sort_order,
    };

    const runSave = (body: typeof payload | Omit<typeof payload, "parent_id">) =>
      fetch(draft.id ? `/api/admin/categories/${draft.id}` : "/api/admin/categories", {
        method: draft.id ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

    let response = await runSave(payload);
    let result = await response.json();
    if (!response.ok && result.error?.toLowerCase().includes("parent_id")) {
      const { parent_id: _parentId, ...legacyPayload } = payload;
      response = await runSave(legacyPayload);
      result = await response.json();
      setNotice("Category saved, but Supabase needs the parent_id column before subcategories can be stored.");
    } else {
      setNotice(response.ok ? (draft.parent_id ? "Subcategory saved." : "Category saved.") : result.error || "Could not save category.");
    }

    if (response.ok) setDraft(emptyCategory);
    await loadCategories();
  }

  async function deleteCategory(category: Category) {
    const hasChildren = childCategories.some((child) => child.parent_id === category.id);
    const warning = hasChildren
      ? `Delete ${category.name}? Its subcategories will become uncategorized.`
      : `Delete ${category.name}? Products will become uncategorized.`;
    if (!window.confirm(warning)) return;

    const accessToken = await getSafeAdminAccessToken();
    if (!accessToken) {
      setNotice("Please log in again.");
      return;
    }

    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const result = await response.json();
    setNotice(response.ok ? "Category deleted." : result.error || "Could not delete category.");
    await loadCategories();
  }

  function editCategory(category: Category) {
    setDraft({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parent_id: category.parent_id || "",
      sort_order: category.sort_order || 0,
    });
  }

  function addSubcategory(parent: Category) {
    setDraft({
      ...emptyCategory,
      parent_id: parent.id,
      sort_order: childCategories.filter((child) => child.parent_id === parent.id).length + 1,
    });
    setNotice(`Adding a subcategory under ${parent.name}.`);
  }

  return (
    <AdminGuard>
      <AdminShell title="Categories">
        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_430px]">
          <AdminCard>
            {notice ? <p className="mb-5 rounded-md bg-[#f7f1ea] px-5 py-4 text-base text-ink/64">{notice}</p> : null}
            <div className="space-y-5">
              {parentCategories.map((category) => {
                const children = childCategories.filter((child) => child.parent_id === category.id);
                return (
                  <section key={category.id} className="rounded-md border border-ink/10 bg-[#fffaf4] p-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-lg font-medium">{category.name}</p>
                        <p className="text-base text-ink/52">{category.slug} - sort {category.sort_order}</p>
                        {category.description ? <p className="mt-1 text-base text-ink/58">{category.description}</p> : null}
                      </div>
                      <CategoryActions category={category} onEdit={editCategory} onDelete={deleteCategory} onAddSubcategory={addSubcategory} />
                    </div>
                    <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-ink/45">Subcategories</p>
                      {children.length ? (
                        children.map((child) => (
                          <div key={child.id} className="flex items-center justify-between gap-4 rounded-md bg-white px-4 py-3">
                            <div>
                              <p className="font-medium">{child.name}</p>
                              <p className="text-sm text-ink/48">{child.slug} - sort {child.sort_order}</p>
                            </div>
                            <CategoryActions category={child} onEdit={editCategory} onDelete={deleteCategory} compact />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-ink/48">No subcategories yet.</p>
                      )}
                    </div>
                  </section>
                );
              })}
              {!parentCategories.length ? <p className="py-8 text-center text-base text-ink/52">Add your first category to begin.</p> : null}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-3">
              <FolderPlus size={22} />
              <h2 className="text-2xl font-semibold">
                {draft.id ? "Edit category" : draft.parent_id ? "Add subcategory" : "Add category"}
              </h2>
            </div>
            <p className="mt-2 text-base leading-6 text-ink/52">
              Choose a parent only when this should appear as a subcategory.
            </p>
            <form onSubmit={saveCategory} className="mt-5 space-y-5">
              <Field label="Name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} />
              <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: slugify(value) }))} />
              <label className="block text-base">
                Parent category
                <select
                  value={draft.parent_id}
                  onChange={(event) => setDraft((current) => ({ ...current, parent_id: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/12 px-4 py-3.5 text-base outline-none focus:border-ink"
                >
                  <option value="">None - top-level category</option>
                  {parentCategories
                    .filter((category) => category.id !== draft.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
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
              {draft.id ? (
                <button type="button" onClick={() => setDraft(emptyCategory)} className="w-full text-center text-sm text-ink/52">
                  Cancel editing
                </button>
              ) : null}
            </form>
          </AdminCard>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function CategoryActions({
  category,
  onEdit,
  onDelete,
  onAddSubcategory,
  compact = false,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory?: (category: Category) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      {onAddSubcategory ? (
        <button
          onClick={() => onAddSubcategory(category)}
          className="inline-flex items-center gap-2 rounded-md border border-ink/12 bg-white px-4 py-2.5 text-base"
        >
          <Plus size={16} />
          Subcategory
        </button>
      ) : null}
      <button onClick={() => onEdit(category)} className={`rounded-md border border-ink/12 ${compact ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-base"}`}>
        Edit
      </button>
      <button onClick={() => onDelete(category)} className={`rounded-md border border-ink/12 text-clay ${compact ? "px-3 py-2" : "px-4 py-2.5"}`}>
        <Trash2 size={compact ? 15 : 18} />
      </button>
    </div>
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
