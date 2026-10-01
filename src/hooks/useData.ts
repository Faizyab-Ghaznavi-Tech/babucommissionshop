import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  WebsiteSettings, AboutContent, Product, Service,
  ContactMessage, Announcement, GalleryItem, MediaItem,
} from '@/types/database';

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setSettings(data);
        setLoading(false);
      });
  }, []);

  return { settings, loading, setSettings };
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
      if (!error && data) setProducts(data);
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
        if (!error) setProduct(data);
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
      if (!error && data) setServices(data);
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
