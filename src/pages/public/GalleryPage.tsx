import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/States';
import { MediaImage } from '@/components/MediaImage';
import { useGallery } from '@/hooks/useData';

export function GalleryPage() {
  const { gallery, loading, error } = useGallery(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [category, setCategory] = useState('All');
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isLightboxOpen = lightbox !== null;

  const categories = useMemo(() => {
    const cats = new Set(gallery.map(g => g.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [gallery]);

  const filtered = useMemo(() => {
    if (category === 'All') return gallery;
    return gallery.filter(g => g.category === category);
  }, [gallery, category]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const next = useCallback(() => {
    setLightbox(prev => {
      if (prev === null) return prev;
      return (prev + 1) % filtered.length;
    });
  }, [filtered.length]);

  const prev = useCallback(() => {
    setLightbox(prev => {
      if (prev === null) return prev;
      return (prev - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeLightbox(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
      if (event.key === 'Tab' && dialogRef.current) {
        const buttons = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, next, prev]);

  useEffect(() => {
    if (isLightboxOpen) return;
    triggerRef.current?.focus();
  }, [isLightboxOpen]);

  return (
    <PublicLayout
      title="Gallery"
      description="View photos published by Babu Commission Shop."
    >
      <PageHeader
        title="Gallery"
        subtitle="Browse photos selected by Babu Commission Shop."
      />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={category === cat}
                  onClick={() => { setCategory(cat); setLightbox(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-date-700 text-cream'
                      : 'bg-date-100 text-date-600 hover:bg-date-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSpinner label="Loading gallery..." />
          ) : error ? (
            <ErrorState message={`Could not load gallery images: ${error}`} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No images available" message="Gallery images will appear here once published." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(event) => { triggerRef.current = event.currentTarget; setLightbox(idx); }}
                  aria-label={`Open image: ${item.caption || item.alt_text || 'Gallery photo'}`}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer bg-date-100"
                >
                  <MediaImage
                    src={item.image_url}
                    alt={item.alt_text || item.caption || 'Gallery photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-date-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-cream text-xs sm:text-sm">{item.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <MediaImage
              src={filtered[lightbox].image_url}
              alt={filtered[lightbox].alt_text || filtered[lightbox].caption || 'Gallery photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {(filtered[lightbox].caption || filtered[lightbox].category) && (
              <div className="text-center mt-4">
                {filtered[lightbox].caption && (
                  <p className="text-cream text-sm">{filtered[lightbox].caption}</p>
                )}
                {filtered[lightbox].category && (
                  <p className="text-cream/50 text-xs mt-1 uppercase tracking-wider">{filtered[lightbox].category}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
