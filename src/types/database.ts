export interface WebsiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  hero_image_url: string;
  wholesale_background_url?: string;
  dates_background_url?: string;
  announcements_background_url?: string;
  services_background_url?: string;
  about_background_url?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  address_short: string;
  description: string;
  facebook_url: string;
  instagram_url: string;
  footer_content: string;
  website_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  company_story: string;
  mission: string;
  vision: string;
  business_description: string;
  image_1_url: string;
  image_2_url: string;
  image_3_url: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image_url: string;
  sort_order: number;
  featured: boolean;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image_url: string;
  icon_name: string;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  subject: string;
  product_id: string | null;
  service_id: string | null;
  product_name: string;
  service_name: string;
  quantity: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string;
  announcement_date: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  caption: string;
  category: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  file_path: string;
  alt_text: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  created_at: string;
}
