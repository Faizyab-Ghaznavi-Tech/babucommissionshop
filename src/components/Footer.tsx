import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import type { WebsiteSettings } from '@/types/database';
import { getTelHref } from '@/lib/contact';
import { Brand } from './Brand';
import { WhatsAppAction } from './WhatsAppAction';

interface FooterProps {
  settings: WebsiteSettings | null;
}

function safeExternalUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function Footer({ settings }: FooterProps) {
  const businessName = settings?.business_name || 'Babu Commission Shop';
  const phoneHref = getTelHref(settings?.phone);
  const facebookUrl = safeExternalUrl(settings?.facebook_url);
  const instagramUrl = safeExternalUrl(settings?.instagram_url);

  return (
    <footer className="bg-date-950 text-cream/75">
      <div className="container-prose grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:py-16">
        <div>
          <Link to="/" aria-label={`${businessName} home`}>
            <Brand businessName={businessName} logoUrl={settings?.logo_url} light />
          </Link>
          {settings?.description && <p className="mt-5 max-w-md text-sm leading-6">{settings.description}</p>}
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="mb-4 font-display text-lg font-semibold text-cream">Explore</h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/dates">Products</Link></li>
            <li><Link className="hover:text-white" to="/about">About</Link></li>
            <li><Link className="hover:text-white" to="/services">Services</Link></li>
            <li><Link className="hover:text-white" to="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-cream">Contact</h2>
          <ul className="space-y-3 text-sm">
            {settings?.address && <li className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-sand-400" aria-hidden="true" /><span>{settings.address}</span></li>}
            {phoneHref && <li className="flex items-center gap-3"><Phone size={17} className="shrink-0 text-sand-400" aria-hidden="true" /><a href={phoneHref} className="hover:text-white">{settings?.phone}</a></li>}
            {settings?.email && <li className="flex items-center gap-3"><Mail size={17} className="shrink-0 text-sand-400" aria-hidden="true" /><a className="break-all hover:text-white" href={`mailto:${settings.email}`}>{settings.email}</a></li>}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <WhatsAppAction number={settings?.whatsapp} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-cream/25 px-3 text-sm font-medium text-cream hover:bg-cream/10" />
            {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-cream/25 hover:bg-cream/10"><Facebook size={18} aria-hidden="true" /></a>}
            {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-cream/25 hover:bg-cream/10"><Instagram size={18} aria-hidden="true" /></a>}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-prose flex flex-col gap-2 py-5 text-xs text-cream/65 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings?.footer_content || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`}</p>
          {settings?.address && <p>{settings.address}</p>}
        </div>
      </div>
    </footer>
  );
}
