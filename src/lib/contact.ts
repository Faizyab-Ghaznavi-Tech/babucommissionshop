const PLACEHOLDER_NUMBERS = new Set(['923000000000', '03000000000']);

export const SHOP_WHATSAPP_NUMBER = '+923453876906';

function normalizedDigits(value?: string): string {
  const digits = value?.replace(/\D/g, '') ?? '';
  return digits.startsWith('00') ? digits.slice(2) : digits;
}

function isPlaceholderNumber(digits: string): boolean {
  return PLACEHOLDER_NUMBERS.has(digits);
}

export function getTelHref(value?: string): string | null {
  const digits = normalizedDigits(value);
  if (!digits || isPlaceholderNumber(digits)) return null;
  const prefix = value?.trim().startsWith('+') ? '+' : '';
  return `tel:${prefix}${digits}`;
}

export function getWhatsAppUrl(value?: string, message = 'Hello, I would like to enquire about dates.'): string | null {
  const digits = normalizedDigits(value);
  if (digits.length < 7 || isPlaceholderNumber(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getShopWhatsAppUrl(configuredNumber?: string, message?: string): string | null {
  return getWhatsAppUrl(configuredNumber, message)
    ?? getWhatsAppUrl(SHOP_WHATSAPP_NUMBER, message);
}
