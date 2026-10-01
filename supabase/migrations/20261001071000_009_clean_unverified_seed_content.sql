-- The starter seed contains contact details and catalog claims that were not
-- confirmed by the business. Clear only the exact starter defaults, and keep
-- the rows available in admin for review and publishing after verification.

UPDATE public.website_settings
SET
  tagline = CASE WHEN tagline = 'Premium Dates from the Heart of Khairpur' THEN '' ELSE tagline END,
  phone = CASE WHEN phone = '+92 300 0000000' THEN '' ELSE phone END,
  whatsapp = CASE WHEN whatsapp = '+92 300 0000000' THEN '' ELSE whatsapp END,
  email = CASE WHEN email = 'info@babucommissionshop.com' THEN '' ELSE email END,
  address = CASE WHEN address = 'New Khajoor Mandi, Khairpur, Sindh, Pakistan' THEN '' ELSE address END,
  address_short = CASE WHEN address_short = 'New Khajoor Mandi, Khairpur' THEN '' ELSE address_short END,
  description = CASE WHEN description LIKE 'Babu Commission Shop is a trusted date sourcing and commission business%' THEN '' ELSE description END,
  footer_content = CASE WHEN footer_content LIKE 'Babu Commission Shop%' THEN '' ELSE footer_content END,
  website_title = CASE WHEN website_title = 'Babu Commission Shop | Khairpur Dates Sourcing & Commission' THEN 'Babu Commission Shop | Khairpur Dates' ELSE website_title END,
  meta_description = CASE WHEN meta_description LIKE 'Babu Commission Shop sources premium Khairpur dates%' THEN 'Explore date varieties listed by Babu Commission Shop. Contact us about sourcing enquiries.' ELSE meta_description END
WHERE
  tagline = 'Premium Dates from the Heart of Khairpur' OR
  phone = '+92 300 0000000' OR whatsapp = '+92 300 0000000' OR
  email = 'info@babucommissionshop.com' OR
  address = 'New Khajoor Mandi, Khairpur, Sindh, Pakistan' OR
  address_short = 'New Khajoor Mandi, Khairpur' OR
  description LIKE 'Babu Commission Shop is a trusted date sourcing and commission business%' OR
  footer_content LIKE 'Babu Commission Shop%' OR
  website_title = 'Babu Commission Shop | Khairpur Dates Sourcing & Commission' OR
  meta_description LIKE 'Babu Commission Shop sources premium Khairpur dates%';

UPDATE public.about_content
SET
  company_story = CASE WHEN company_story LIKE 'Babu Commission Shop was established in New Khajoor Mandi, Khairpur%' THEN '' ELSE company_story END,
  mission = CASE WHEN mission LIKE 'To bridge the gap between Khairpur%' THEN '' ELSE mission END,
  vision = CASE WHEN vision LIKE 'To be Pakistan''s most trusted name in date sourcing%' THEN '' ELSE vision END,
  business_description = CASE WHEN business_description LIKE 'Babu Commission Shop operates from New Khajoor Mandi, Khairpur%' THEN '' ELSE business_description END
WHERE
  company_story LIKE 'Babu Commission Shop was established in New Khajoor Mandi, Khairpur%' OR
  mission LIKE 'To bridge the gap between Khairpur%' OR
  vision LIKE 'To be Pakistan''s most trusted name in date sourcing%' OR
  business_description LIKE 'Babu Commission Shop operates from New Khajoor Mandi, Khairpur%';

-- Leave starter products in the CMS for review, but do not advertise them
-- until the business confirms the item, grade, description, and availability.
UPDATE public.products SET is_enabled = false, featured = false
WHERE
  (slug = 'chhohara-dried-black' AND description LIKE 'Dried black chhohara dates%') OR
  (slug = 'chhohara-dried-yellow' AND description LIKE 'Golden dried yellow chhohara dates%') OR
  (slug = 'rabai-dates-semi-dry' AND description LIKE 'Rabai dates in semi-dry grade%') OR
  (slug = 'pitted-vacuum-sealed-aseel' AND description LIKE 'Premium Aseel dates, pitted and vacuum-sealed%') OR
  (slug = 'karbalain-dates-royal-amber' AND description LIKE 'Karbalain dates in royal amber grade%') OR
  (slug = 'dhakki-dates-soft-succulent' AND description LIKE 'Dhakki dates known for their exceptional softness%') OR
  (slug = 'aseel-dates-khairpur-super' AND description LIKE 'Aseel dates in Khairpur super grade%');

-- Keep the seeded service rows editable, but unpublish unchanged promotional
-- claims about logistics, pricing, quality standards, and export readiness.
UPDATE public.services SET is_enabled = false
WHERE
  (name = 'Direct Farmer Sourcing' AND description LIKE 'We source dates directly from farmers across the Khairpur region%') OR
  (name = 'Commission-Based Buying' AND description LIKE 'Our commission service lets you leverage our market expertise%') OR
  (name = 'Bulk Date Supply' AND description LIKE 'Whether you need a few maunds or container loads%') OR
  (name = 'Nationwide Supply' AND description LIKE 'We deliver dates across Pakistan%') OR
  (name = 'Custom Brand Packaging' AND description LIKE 'Stand out with custom-branded packaging%') OR
  (name = 'Ramadan Special Packaging' AND description LIKE 'Our Ramadan packaging service creates beautiful%') OR
  (name = 'Export-Quality Dates' AND description LIKE 'We select and prepare dates that meet export standards%');
