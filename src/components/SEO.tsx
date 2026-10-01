import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export function SEO({ title, description, image }: SEOProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }
    if (title) {
      setMeta('og:title', title, 'property');
      setMeta('twitter:title', title);
    }
    if (image) {
      setMeta('og:image', image, 'property');
      setMeta('twitter:image', image);
    }
  }, [title, description, image]);

  return null;
}
