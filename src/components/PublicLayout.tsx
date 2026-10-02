import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { WhatsAppAction } from './WhatsAppAction';
import { useWebsiteSettings } from '@/hooks/useData';
import { sanitizePublicSettings } from '@/lib/siteContent';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export function PublicLayout({ children, title, description, image }: PublicLayoutProps) {
  const { settings: rawSettings } = useWebsiteSettings();
  const settings = sanitizePublicSettings(rawSettings);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  const fullTitle = title
    ? `${title} | ${settings?.business_name ?? 'Babu Commission Shop'}`
    : settings?.website_title ?? 'Babu Commission Shop | Khairpur Dates';

  return (
    <>
      <SEO title={fullTitle} description={description ?? settings?.meta_description} image={image} favicon={settings?.favicon_url} businessName={settings?.business_name} />
      <div className="min-h-screen flex flex-col bg-cream">
        <Header settings={settings} />
        <main id="main-content" tabIndex={-1} className={`flex-1 ${location.pathname === '/' ? '' : 'pt-[5.5rem] sm:pt-28'}`}>{children}</main>
        <Footer settings={settings} />
        <WhatsAppAction number={settings?.whatsapp} floating />
      </div>
    </>
  );
}
