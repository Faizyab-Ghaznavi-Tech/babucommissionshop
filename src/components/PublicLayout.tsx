import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { useWebsiteSettings } from '@/hooks/useData';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export function PublicLayout({ children, title, description, image }: PublicLayoutProps) {
  const { settings } = useWebsiteSettings();

  const fullTitle = title
    ? `${title} | ${settings?.business_name ?? 'Babu Commission Shop'}`
    : settings?.website_title ?? 'Babu Commission Shop | Khairpur Dates Sourcing';

  return (
    <>
      <SEO title={fullTitle} description={description ?? settings?.meta_description} image={image} />
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
