import { demoCategories, demoProducts, demoSettings } from "@/lib/demo-data";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { Category, Product, SiteSettings } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig || !supabase) return demoCategories;
  try {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (error) return demoCategories;
    if (!data?.length) return [];
    return data;
  } catch {
    return demoCategories;
  }
}

export async function getProducts({ includeHidden = false } = {}): Promise<Product[]> {
  if (!hasSupabaseConfig || !supabase) {
    return includeHidden ? demoProducts : demoProducts.filter((product) => product.is_visible);
  }

  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!includeHidden) query = query.eq("is_visible", true);
  try {
    const { data, error } = await query;
    if (error) {
      return includeHidden ? demoProducts : demoProducts.filter((product) => product.is_visible);
    }
    if (!data?.length) return [];
    return data.map((product) => ({ ...product, gallery_images: product.gallery_images || [] }));
  } catch {
    return includeHidden ? demoProducts : demoProducts.filter((product) => product.is_visible);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabaseConfig || !supabase) return demoSettings;
  const { data, error } = await supabase.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error || !data) return demoSettings;
  return { ...demoSettings, ...data };
}

export function createProductOrderMessage(product: Product, settings: SiteSettings) {
  const size = product.selected_size || product.size_ml || "";
  const sizeText = size ? ` (${size})` : "";

  if (settings.whatsapp_message_template) {
    return settings.whatsapp_message_template
      .replace("{{product_name}}", `${product.name}${sizeText}`)
      .replace("{{price}}", product.price || "")
      .replace("{{category_name}}", product.categories?.name || "")
      .replace("{{size_ml}}", size)
      .trim();
  }

  if (product.categories?.name) {
    return `Hi, I want to order ${product.name}${sizeText} from the ${product.categories.name} collection at Moments by Isha.`;
  }

  if (product.price) {
    return `Hi, I want to order ${product.name}${sizeText} - ${product.price} from Moments by Isha.`;
  }

  return `Hi, I want to order ${product.name}${sizeText} from Moments by Isha.`;
}

export function createGroupedOrderMessage(items: Array<Product & { quantity?: number }>, settings: SiteSettings) {
  if (items.length === 1) return createProductOrderMessage(items[0], settings);

  const lines = items.map((item, index) => {
    const quantity = item.quantity && item.quantity > 1 ? ` x ${item.quantity}` : "";
    const price = item.price ? ` - ${item.price}` : "";
    const size = item.selected_size || item.size_ml ? ` - ${item.selected_size || item.size_ml}` : "";
    const category = item.categories?.name ? ` (${item.categories.name})` : "";
    return `${index + 1}. ${item.name}${quantity}${size}${price}${category}`;
  });

  return `Hi, I want to order these products from Moments by Isha:\n\n${lines.join("\n")}`;
}

export function createWhatsAppUrl(product: Product, settings: SiteSettings) {
  const message = createProductOrderMessage(product, settings);
  return createWhatsAppMessageUrl(message, settings);
}

export function getProductMlOptions(product: Product) {
  if (product.size_ml) return product.size_ml.split(",").map((option) => option.trim()).filter(Boolean);

  const category = product.categories?.slug || "";
  const text = `${product.name} ${product.description}`.toLowerCase();
  const matches = Array.from(text.matchAll(/\b(\d{2,4})\s*ml\b/g)).map((match) => `${match[1]} ml`);
  const uniqueMatches = Array.from(new Set(matches));
  if (uniqueMatches.length) return uniqueMatches;

  if (category.includes("candle") || text.includes("candle")) return ["100 ml", "200 ml"];
  return [];
}

export function createWhatsAppMessageUrl(message: string, settings: SiteSettings) {
  const whatsappNumber = (settings.whatsapp_number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
