/*
# Create core tables for Babu Commission Shop

1. New Tables
- `website_settings` — single-row table holding business name, contact info, social links, SEO defaults
- `about_content` — single-row table holding company story, mission, vision, business description, about images
- `products` — date varieties with name, slug, description, category, image, display order, featured flag, enabled flag
- `services` — business services with name, description, image, display order, enabled flag
- `contact_messages` — enquiries from visitors with name, phone, email, subject, product, service, quantity, message, read/archive flags
- `announcements` — announcements with title, content, image, date, published flag, display order
- `gallery` — gallery images with caption, category, image URL, published flag, display order
- `media` — media library entries with filename, URL, alt text, size, type

2. Security
- RLS enabled on all tables
- Public read for enabled/published content (anon + authenticated)
- Contact messages: public can INSERT, only authenticated can SELECT/UPDATE/DELETE
- All other CRUD: authenticated only
- Admin role determined by authenticated session (admin can sign up and log in)

3. Notes
- UUID primary keys on all tables
- created_at and updated_at timestamps where appropriate
- Display ordering with sort_order integer columns
- Slugs for products
*/

-- ============ website_settings ============
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Babu Commission Shop',
  tagline text DEFAULT '',
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  phone text DEFAULT '',
  whatsapp text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  address_short text DEFAULT '',
  description text DEFAULT '',
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  footer_content text DEFAULT '',
  website_title text DEFAULT 'Babu Commission Shop | Khairpur Dates Sourcing',
  meta_description text DEFAULT 'Babu Commission Shop — sourcing premium dates from Khairpur. Direct farmer sourcing, commission-based buying, bulk supply, and custom packaging.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON website_settings;
CREATE POLICY "public_read_settings" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_settings" ON website_settings;
CREATE POLICY "auth_update_settings" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON website_settings;
CREATE POLICY "auth_insert_settings" ON website_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ about_content ============
CREATE TABLE IF NOT EXISTS about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_story text DEFAULT '',
  mission text DEFAULT '',
  vision text DEFAULT '',
  business_description text DEFAULT '',
  image_1_url text DEFAULT '',
  image_2_url text DEFAULT '',
  image_3_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_about" ON about_content;
CREATE POLICY "public_read_about" ON about_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_about" ON about_content;
CREATE POLICY "auth_update_about" ON about_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_about" ON about_content;
CREATE POLICY "auth_insert_about" ON about_content FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ products ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  category text DEFAULT '',
  image_url text DEFAULT '',
  sort_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (is_enabled = true);

DROP POLICY IF EXISTS "auth_read_all_products" ON products;
CREATE POLICY "auth_read_all_products" ON products FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============ services ============
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  icon_name text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (is_enabled = true);

DROP POLICY IF EXISTS "auth_read_all_services" ON services;
CREATE POLICY "auth_read_all_services" ON services FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);

-- ============ contact_messages ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  subject text DEFAULT '',
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  product_name text DEFAULT '',
  service_name text DEFAULT '',
  quantity text DEFAULT '',
  message text DEFAULT '',
  is_read boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries (INSERT only)
DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated (admin) can read, update, delete
DROP POLICY IF EXISTS "auth_read_messages" ON contact_messages;
CREATE POLICY "auth_read_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_messages" ON contact_messages;
CREATE POLICY "auth_update_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_messages" ON contact_messages;
CREATE POLICY "auth_delete_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_is_archived ON contact_messages(is_archived);

-- ============ announcements ============
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  image_url text DEFAULT '',
  announcement_date date DEFAULT CURRENT_DATE,
  is_published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_read_all_announcements" ON announcements;
CREATE POLICY "auth_read_all_announcements" ON announcements FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_announcements" ON announcements;
CREATE POLICY "auth_insert_announcements" ON announcements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_announcements" ON announcements;
CREATE POLICY "auth_update_announcements" ON announcements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_announcements" ON announcements;
CREATE POLICY "auth_delete_announcements" ON announcements FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_announcements_sort_order ON announcements(sort_order);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(announcement_date DESC);

-- ============ gallery ============
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text DEFAULT '',
  category text DEFAULT '',
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_read_all_gallery" ON gallery;
CREATE POLICY "auth_read_all_gallery" ON gallery FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery(sort_order);

-- ============ media ============
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_url text NOT NULL,
  file_path text NOT NULL,
  alt_text text DEFAULT '',
  file_size bigint DEFAULT 0,
  mime_type text DEFAULT '',
  width integer DEFAULT 0,
  height integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public can read media (images shown on site)
DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_media" ON media;
CREATE POLICY "auth_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_media" ON media;
CREATE POLICY "auth_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_media" ON media;
CREATE POLICY "auth_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_website_settings_updated_at ON website_settings;
CREATE TRIGGER trigger_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_about_content_updated_at ON about_content;
CREATE TRIGGER trigger_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_services_updated_at ON services;
CREATE TRIGGER trigger_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER trigger_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_announcements_updated_at ON announcements;
CREATE TRIGGER trigger_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_gallery_updated_at ON gallery;
CREATE TRIGGER trigger_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
