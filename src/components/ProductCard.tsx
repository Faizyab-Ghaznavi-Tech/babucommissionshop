import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/database';
import { MediaImage } from './MediaImage';
import { useWebsiteSettings } from '@/hooks/useData';
import { getShopWhatsAppUrl } from '@/lib/contact';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { settings } = useWebsiteSettings();
  const quoteHref = `/contact?product=${encodeURIComponent(product.slug)}`;
  const whatsappMessage = `Hi, I'm interested in ${product.name}. Please share current availability and wholesale details.`;
  const whatsappHref = getShopWhatsAppUrl(settings?.whatsapp, whatsappMessage);

  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/80 bg-white/80 shadow-[0_8px_28px_rgba(66,39,23,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm transition-[border-color,box-shadow] duration-200 hover:border-date-300/80 hover:shadow-[0_12px_32px_rgba(66,39,23,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-date-100">
        <Link
          to={`/dates/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-0 rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-date-800"
        >
          <MediaImage
            src={product.image_url || undefined}
            alt={product.image_url ? product.name : `${product.name} — representative stock photo`}
            className="h-full w-full object-cover transition-transform duration-[220ms] ease-out group-hover:scale-[1.03]"
            fallbackLabel={false}
            stockPhotoVariant={product.slug}
          />
        </Link>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-date-950/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {product.category && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-[2] rounded-md bg-date-950/85 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-date-950">
          <Link to={`/dates/${product.slug}`} className="transition-colors hover:text-sand-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-date-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-date-600">{product.description}</p>

        <div className="mt-4 flex items-center gap-2 border-t border-date-100 pt-3">
          <Link
            to={quoteHref}
            aria-label={`Get a quote for ${product.name}`}
            className="group/quote inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-sand-300/70 bg-sand-100/80 px-2.5 text-xs font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-sand-400 hover:bg-sand-200 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-600 focus-visible:ring-offset-2"
          >
            Get a Quote
            <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover/quote:translate-x-0.5" />
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask about ${product.name} on WhatsApp (opens in a new tab)`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-palm-800/15 bg-palm-50/75 px-2.5 text-xs font-medium text-palm-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm transition-colors duration-200 hover:bg-palm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palm-700 focus-visible:ring-offset-2"
            >
              <MessageCircle size={15} aria-hidden="true" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
