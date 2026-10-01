-- Restore the seeded date varieties hidden by migration 009 while removing
-- unverified grade, packaging, quality, and availability claims. The public
-- catalog uses neutral descriptions until the shop supplies verified copy.
UPDATE public.products
SET
  name = CASE slug
    WHEN 'chhohara-dried-black' THEN 'Chhohara (Black)'
    WHEN 'chhohara-dried-yellow' THEN 'Chhohara (Yellow)'
    WHEN 'rabai-dates-semi-dry' THEN 'Rabai Dates'
    WHEN 'karbalain-dates-royal-amber' THEN 'Karbalain Dates'
    WHEN 'dhakki-dates-soft-succulent' THEN 'Dhakki Dates'
    WHEN 'aseel-dates-khairpur-super' THEN 'Aseel Dates'
  END,
  description = 'Contact the shop to confirm current availability, grade, quantities, and terms for this variety.',
  is_enabled = true,
  featured = slug IN ('chhohara-dried-black', 'rabai-dates-semi-dry', 'dhakki-dates-soft-succulent')
WHERE
  (slug = 'chhohara-dried-black' AND description LIKE 'Dried black chhohara dates%') OR
  (slug = 'chhohara-dried-yellow' AND description LIKE 'Golden dried yellow chhohara dates%') OR
  (slug = 'rabai-dates-semi-dry' AND description LIKE 'Rabai dates in semi-dry grade%') OR
  (slug = 'karbalain-dates-royal-amber' AND description LIKE 'Karbalain dates in royal amber grade%') OR
  (slug = 'dhakki-dates-soft-succulent' AND description LIKE 'Dhakki dates known for their exceptional softness%') OR
  (slug = 'aseel-dates-khairpur-super' AND description LIKE 'Aseel dates in Khairpur super grade%');

-- The pitted/vacuum-sealed row makes a packaging claim. Keep it unpublished
-- until the business confirms that specific product offering.
UPDATE public.products
SET is_enabled = false, featured = false
WHERE slug = 'pitted-vacuum-sealed-aseel'
  AND description LIKE 'Premium Aseel dates, pitted and vacuum-sealed%';
