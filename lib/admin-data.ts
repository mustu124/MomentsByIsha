import { supabase } from "@/lib/supabase";
import type { Category, Product, SiteSettings } from "@/lib/types";

export async function fetchAdminProducts() {
  if (!supabase) return { products: [] as Product[], error: "Supabase is not configured." };
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return { products: (data || []) as Product[], error: error?.message };
}

export async function fetchAdminProduct(id: string) {
  if (!supabase) return { product: null, error: "Supabase is not configured." };
  const { data, error } = await supabase.from("products").select("*, categories(*)").eq("id", id).maybeSingle();
  return { product: data as Product | null, error: error?.message };
}

export async function fetchAdminCategories() {
  if (!supabase) return { categories: [] as Category[], error: "Supabase is not configured." };
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  return { categories: (data || []) as Category[], error: error?.message };
}

export async function fetchAdminSettings() {
  if (!supabase) return { settings: null, error: "Supabase is not configured." };
  const { data, error } = await supabase.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  return { settings: data as SiteSettings | null, error: error?.message };
}
