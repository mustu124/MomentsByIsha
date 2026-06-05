export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  size_ml?: string | null;
  selected_size?: string;
  category_id: string | null;
  image_url: string;
  gallery_images: string[];
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: Category | null;
};

export type SiteSettings = {
  id?: string;
  brand_name: string;
  whatsapp_number: string;
  whatsapp_message_template: string;
  contact_email: string;
  instagram_url: string;
};
