import type { Product } from "@/lib/types";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  selectedSize: string;
  categoryName: string;
  image_url: string;
  quantity: number;
};

export function productToCartItem(product: Product, selectedSize = ""): CartItem {
  return {
    id: selectedSize ? `${product.id}:${selectedSize}` : product.id,
    name: product.name,
    slug: product.slug,
    price: product.price || "",
    selectedSize,
    categoryName: product.categories?.name || "",
    image_url: product.image_url || "",
    quantity: 1,
  };
}

export function cartItemToProduct(item: CartItem): Product & { quantity: number } {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: "",
    price: item.price,
    selected_size: item.selectedSize,
    category_id: null,
    image_url: item.image_url,
    gallery_images: [],
    is_featured: false,
    is_visible: true,
    sort_order: 0,
    quantity: item.quantity,
    categories: item.categoryName
      ? {
          id: item.categoryName,
          name: item.categoryName,
          slug: item.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: null,
          sort_order: 0,
        }
      : null,
  };
}
