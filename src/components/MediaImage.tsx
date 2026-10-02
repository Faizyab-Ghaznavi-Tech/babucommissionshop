import { useCallback, useEffect, useState } from 'react';
import { getStockPhoto } from '@/lib/stockPhotos';

interface MediaImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackLabel?: string | false;
  stockPhotoVariant?: string;
}

export function MediaImage({ src, alt, className = '', loading = 'lazy', fetchPriority, fallbackLabel = 'Shop image coming soon', stockPhotoVariant }: MediaImageProps) {
  const [failed, setFailed] = useState(!src);
  const [stockPhotoFailed, setStockPhotoFailed] = useState(false);
  const setFetchPriority = useCallback((image: HTMLImageElement | null) => {
    if (image && fetchPriority) image.setAttribute('fetchpriority', fetchPriority);
  }, [fetchPriority]);
  const classNames = className.split(/\s+/).filter(Boolean);
  const positionClass = classNames.includes('absolute') ? 'absolute' : classNames.includes('fixed') ? 'fixed' : 'relative';
  const imageClassName = classNames.filter((className) => !['absolute', 'relative', 'fixed', 'static', 'sticky'].includes(className)).join(' ');

  useEffect(() => {
    setFailed(!src);
    setStockPhotoFailed(false);
  }, [src]);

  if (failed || !src) {
    if (!stockPhotoFailed) {
      return (
        <img
          src={getStockPhoto(stockPhotoVariant)}
          alt={alt ? `${alt} (representative stock photo)` : ''}
          ref={setFetchPriority}
          loading={loading}
          onError={() => setStockPhotoFailed(true)}
          className={`${imageClassName} ${positionClass}`}
        />
      );
    }

    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} — image unavailable` : undefined}
        aria-hidden={alt ? undefined : true}
        className={`${positionClass} flex items-center justify-center overflow-hidden bg-gradient-to-br from-sand-100 via-cream to-date-100 ${imageClassName}`}
      >
        {fallbackLabel !== false && <span className="relative px-4 text-center text-xs font-medium text-date-600">{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      ref={setFetchPriority}
      loading={loading}
      onError={() => setFailed(true)}
      className={`${imageClassName} ${positionClass}`}
    />
  );
}
