import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  businessName?: string;
  noIndex?: boolean;
}

export function SEO({ title, description, image, favicon, businessName, noIndex = false }: SEOProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (key: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let tag = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    const canonical = `${window.location.origin}${window.location.pathname}`;
    setLink('canonical', canonical);
    let faviconHref = '/favicon.svg';
    if (favicon) {
      try {
        const iconUrl = new URL(favicon, window.location.origin);
        if (iconUrl.protocol === 'https:' || iconUrl.protocol === 'http:') faviconHref = iconUrl.href;
      } catch {
        // Keep the bundled icon when a configured URL is invalid.
      }
    }
    setLink('icon', faviconHref);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', canonical, 'property');
    if (title) {
      setMeta('og:title', title, 'property');
      setMeta('twitter:title', title);
    }
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }
    if (image) {
      setMeta('og:image', image, 'property');
      setMeta('twitter:image', image);
    } else {
      document.querySelector('meta[property="og:image"]')?.remove();
      document.querySelector('meta[name="twitter:image"]')?.remove();
    }

    const schemaId = 'website-schema';
    document.getElementById(schemaId)?.remove();
    if (!noIndex && window.location.pathname === '/') {
      const schema = document.createElement('script');
      schema.id = schemaId;
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: businessName || 'Babu Commission Shop',
        url: window.location.origin,
      });
      document.head.appendChild(schema);
    }

    return () => document.getElementById(schemaId)?.remove();
  }, [title, description, image, favicon, businessName, noIndex]);

  return null;
}
