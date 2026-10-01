import type { AboutContent, WebsiteSettings } from '@/types/database';
import { getTelHref, getWhatsAppUrl } from '@/lib/contact';

function beginsWith(value: string | null | undefined, prefix: string): boolean {
  return value?.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()) ?? false;
}

export function sanitizePublicSettings(settings: WebsiteSettings | null): WebsiteSettings | null {
  if (!settings) return null;
  return {
    ...settings,
    tagline: settings.tagline === 'Premium Dates from the Heart of Khairpur' ? '' : settings.tagline,
    phone: getTelHref(settings.phone) ? settings.phone : '',
    whatsapp: getWhatsAppUrl(settings.whatsapp) ? settings.whatsapp : '',
    email: (settings.email || '').toLowerCase() === 'info@babucommissionshop.com' ? '' : settings.email,
    address: settings.address === 'New Khajoor Mandi, Khairpur, Sindh, Pakistan' ? '' : settings.address,
    address_short: settings.address_short === 'New Khajoor Mandi, Khairpur' ? '' : settings.address_short,
    description: beginsWith(settings.description, 'Babu Commission Shop is a trusted date sourcing and commission business') ? '' : settings.description,
    footer_content: beginsWith(settings.footer_content, 'Babu Commission Shop — Sourcing premium dates') ? '' : settings.footer_content,
    website_title: settings.website_title === 'Babu Commission Shop | Khairpur Dates Sourcing & Commission' ? 'Babu Commission Shop | Khairpur Dates' : settings.website_title,
    meta_description: beginsWith(settings.meta_description, 'Babu Commission Shop sources premium Khairpur dates')
      ? 'Explore date varieties listed by Babu Commission Shop. Contact us about sourcing enquiries.'
      : settings.meta_description,
  };
}

export function sanitizeAboutContent(about: AboutContent | null): AboutContent | null {
  if (!about) return null;
  return {
    ...about,
    company_story: beginsWith(about.company_story, 'Babu Commission Shop was established in New Khajoor Mandi, Khairpur') ? '' : about.company_story,
    mission: beginsWith(about.mission, 'To bridge the gap between Khairpur') ? '' : about.mission,
    vision: beginsWith(about.vision, "To be Pakistan's most trusted name in date sourcing") ? '' : about.vision,
    business_description: beginsWith(about.business_description, 'Babu Commission Shop operates from New Khajoor Mandi, Khairpur') ? '' : about.business_description,
  };
}
