/*
# Seed data for Babu Commission Shop

1. Initial Data
- website_settings: single row with default business info
- about_content: single row with default about text
- products: 7 date varieties as specified
- services: 7 services as specified

2. Notes
- Uses ON CONFLICT to be idempotent
- Product slugs are URL-friendly versions of names
*/

-- ============ website_settings ============
INSERT INTO website_settings (id, business_name, tagline, phone, whatsapp, email, address, address_short, description, footer_content, website_title, meta_description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Babu Commission Shop',
  'Premium Dates from the Heart of Khairpur',
  '+92 300 0000000',
  '+92 300 0000000',
  'info@babucommissionshop.com',
  'New Khajoor Mandi, Khairpur, Sindh, Pakistan',
  'New Khajoor Mandi, Khairpur',
  'Babu Commission Shop is a trusted date sourcing and commission business based in New Khajoor Mandi, Khairpur. We connect buyers with the finest date varieties through direct farmer sourcing, commission-based buying, and bulk supply — with custom packaging solutions for retailers and wholesalers nationwide.',
  'Babu Commission Shop — Sourcing premium dates from Khairpur. Direct farmer sourcing, commission-based buying, bulk supply, and custom packaging.',
  'Babu Commission Shop | Khairpur Dates Sourcing & Commission',
  'Babu Commission Shop sources premium Khairpur dates through direct farmer sourcing, commission-based buying, bulk supply, and custom packaging.'
)
ON CONFLICT (id) DO NOTHING;

-- ============ about_content ============
INSERT INTO about_content (id, company_story, mission, vision, business_description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Babu Commission Shop was established in New Khajoor Mandi, Khairpur — one of Pakistan''s most renowned date markets. For years, we have built relationships with date farmers across the Khairpur region, earning a reputation for honesty, fair dealing, and an unwavering commitment to quality. Our deep roots in the mandi give us direct access to the finest date varieties, from the prized Aseel to the soft Dhakki, ensuring our customers always receive the best the region has to offer.',
  'To bridge the gap between Khairpur''s date farmers and buyers across Pakistan by providing transparent, reliable, and quality-driven sourcing and commission services — while supporting local agricultural communities.',
  'To be Pakistan''s most trusted name in date sourcing and commission, recognised for quality, integrity, and the ability to deliver premium Khairpur dates to every corner of the country.',
  'Babu Commission Shop operates from New Khajoor Mandi, Khairpur, serving as a vital link between date farmers and buyers. We offer direct farmer sourcing, commission-based buying, bulk date supply, nationwide delivery, and custom packaging — including special Ramadan packaging. Our expertise spans the full range of Khairpur date varieties, and we take pride in matching each customer with the right product for their needs.'
)
ON CONFLICT (id) DO NOTHING;

-- ============ products ============
INSERT INTO products (name, slug, description, category, sort_order, featured, is_enabled) VALUES
('Chhohara Dried Black', 'chhohara-dried-black', 'Dried black chhohara dates — firm texture, rich flavour, and excellent shelf life. A staple in Pakistani households, ideal for daily consumption and Ramadan.', 'Chhohara', 1, false, true),
('Chhohara Dried Yellow', 'chhohara-dried-yellow', 'Golden dried yellow chhohara dates with a naturally sweet taste and chewy texture. Popular for snacking and traditional preparations.', 'Chhohara', 2, false, true),
('Rabai Dates — Semi-Dry Grade', 'rabai-dates-semi-dry', 'Rabai dates in semi-dry grade — a balanced texture that is neither too soft nor too hard. Known for their caramel-like sweetness and versatility.', 'Rabai', 3, false, true),
('Pitted & Vacuum-Sealed Aseel', 'pitted-vacuum-sealed-aseel', 'Premium Aseel dates, pitted and vacuum-sealed for maximum freshness. Ideal for export and retail, with extended shelf life and consistent quality.', 'Aseel', 4, true, true),
('Karbalain Dates — Royal Amber', 'karbalain-dates-royal-amber', 'Karbalain dates in royal amber grade — large, luscious, and visually striking. A premium variety prized for their rich flavour and generous size.', 'Karbalain', 5, true, true),
('Dhakki Dates — Soft & Succulent', 'dhakki-dates-soft-succulent', 'Dhakki dates known for their exceptional softness and succulent texture. A delicacy from the Khairpur region, often enjoyed fresh during the harvest season.', 'Dhakki', 6, true, true),
('Aseel Dates — Khairpur Super Grade', 'aseel-dates-khairpur-super', 'Aseel dates in Khairpur super grade — the finest selection from the region. Dark, elongated, and intensely sweet, representing the best of Khairpur date cultivation.', 'Aseel', 7, true, true)
ON CONFLICT (slug) DO NOTHING;

-- ============ services ============
INSERT INTO services (name, description, icon_name, sort_order, is_enabled) VALUES
('Direct Farmer Sourcing', 'We source dates directly from farmers across the Khairpur region, ensuring authenticity, fair prices, and the freshest produce. Our long-standing farmer relationships mean you get dates picked at peak ripeness.', 'Sprout', 1, true),
('Commission-Based Buying', 'Our commission service lets you leverage our market expertise. We act as your trusted agent in New Khajoor Mandi, negotiating the best prices and selecting the highest quality dates on your behalf.', 'Handshake', 2, true),
('Bulk Date Supply', 'Whether you need a few maunds or container loads, we supply dates in bulk to retailers, wholesalers, and distributors. Consistent quality, reliable delivery, and competitive pricing.', 'Package', 3, true),
('Nationwide Supply', 'We deliver dates across Pakistan — from Karachi to Peshawar. Our logistics network ensures your order arrives on time and in excellent condition, wherever you are.', 'Truck', 4, true),
('Custom Brand Packaging', 'Stand out with custom-branded packaging. We offer personalised date packaging with your logo and branding — perfect for retailers, corporate gifts, and special events.', 'Gift', 5, true),
('Ramadan Special Packaging', 'Our Ramadan packaging service creates beautiful, gift-ready date boxes for the holy month. Ideal for mosques, corporates, and families wanting to share quality dates during Ramadan.', 'Moon', 6, true),
('Export-Quality Dates', 'We select and prepare dates that meet export standards — sorted, graded, and packaged for international markets. Our Aseel and Dhakki varieties are particularly popular with overseas buyers.', 'Ship', 7, true)
ON CONFLICT DO NOTHING;
