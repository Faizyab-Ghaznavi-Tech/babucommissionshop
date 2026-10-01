import { createContext, createElement, useContext, useEffect, useState, useCallback, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  WebsiteSettings, AboutContent, Product, Service,
  ContactMessage, Announcement, GalleryItem, MediaItem,
} from '@/types/database';
import { isUnverifiedSeedProduct, isUnverifiedSeedService } from '@/lib/siteContent';

interface WebsiteSettingsContextValue {
  settings: WebsiteSettings | null;
  loading: boolean;
  error: string;
  setSettings: Dispatch<SetStateAction<WebsiteSettings | null>>;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextValue | undefined>(undefined);

export function WebsiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.resolve(supabase.from('website_settings').select('*').limit(1).maybeSingle())
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        else setSettings(data);
      })
      .catch((queryError: unknown) => {
        if (active) setError(queryError instanceof Error ? queryError.message : 'Could not load website settings.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  return createElement(WebsiteSettingsContext.Provider, { value: { settings, loading, error, setSettings } }, children);
}

export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);
  if (!context) throw new Error('useWebsiteSettings must be used within WebsiteSettingsProvider');
  return context;
}

export function useAboutContent() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setAbout(data);
        setLoading(false);
      });
  }, []);

  return { about, loading, setAbout };
}

export function useProducts(publicOnly = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (publicOnly) {
      query = query.eq('is_enabled', true);
    }
    query.then(({ data, error }) => {
      if (!error && data) setProducts(publicOnly ? data.filter((product) => !isUnverifiedSeedProduct(product)) : data);
      setLoading(false);
    });
  }, [publicOnly]);

  return { products, loading, setProducts };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_enabled', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data && !isUnverifiedSeedProduct(data)) setProduct(data);
        setLoading(false);
      });
  }, [slug]);

  return { product, loading };
}

export function useServices(publicOnly = true) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (publicOnly) {
      query = query.eq('is_enabled', true);
    }
    query.then(({ data, error }) => {
      if (!error && data) setServices(publicOnly ? data.filter((service) => !isUnverifiedSeedService(service)) : data);
      setLoading(false);
    });
  }, [publicOnly]);

  return { services, loading, setServices };
}

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { messages, loading, setMessages, refetch };
}

export function useAnnouncements(publicOnly = true) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('announcements').select('*').order('sort_order', { ascending: true });
    if (publicOnly) {
      query = query.eq('is_published', true);
    }
    query.then(({ data, error }) => {
      if (!error && data) setAnnouncements(data);
      setLoading(false);
    });
  }, [publicOnly]);

  return { announcements, loading, setAnnouncements };
}

export function useGallery(publicOnly = true) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('gallery').select('*').order('sort_order', { ascending: true });
    if (publicOnly) {
      query = query.eq('is_published', true);
    }
    query.then(({ data, error }) => {
      if (!error && data) setGallery(data);
      setLoading(false);
    });
  }, [publicOnly]);

  return { gallery, loading, setGallery };
}

export function useMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMedia(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { media, loading, setMedia, refetch };
}
