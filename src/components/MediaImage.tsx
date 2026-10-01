import { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

interface MediaImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function MediaImage({ src, alt, className = '', loading = 'lazy', fetchPriority }: MediaImageProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => setFailed(!src), [src]);

  if (failed || !src) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} — shop image unavailable` : undefined}
        aria-hidden={alt ? undefined : true}
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sand-100 via-cream to-date-100 ${className}`}
      >
        <div aria-hidden="true" className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-date-200/70" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-palm-200/60" />
        <div className="relative flex flex-col items-center gap-3 px-5 text-center text-date-700">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-date-200 bg-white/80 text-palm-800 shadow-sm">
            <Sprout size={28} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Khairpur · Date Varieties</span>
          <span className="text-xs text-date-500">Shop image coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
