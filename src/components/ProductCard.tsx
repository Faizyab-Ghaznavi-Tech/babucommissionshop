import { Link } from 'react-router-dom';
import type { Product } from '@/types/database';
import { MediaImage } from './MediaImage';
import { useWebsiteSettings } from '@/hooks/useData';
import { getShopWhatsAppUrl } from '@/lib/contact';

interface ProductCardProps {
  product: Product;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none" aria-hidden="true">
      <path d="M20.25 11.7a8.25 8.25 0 0 1-12.2 7.23L4 20l1.12-3.92A8.25 8.25 0 1 1 20.25 11.7Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.6 8.08c.18-.39.4-.4.62-.4h.4c.18 0 .32.04.45.31l.59 1.38c.1.23.08.4-.06.58l-.44.52c-.14.16-.26.29-.1.58.17.3.78 1.3 1.77 1.8.77.4 1.03.42 1.38.25.18-.09.57-.68.73-.9.14-.2.3-.18.51-.1l1.18.55c.23.1.37.16.42.27.05.11.04.66-.22 1.15-.26.48-1.08.94-1.45 1-.37.08-.86.1-1.42-.07-.32-.1-.73-.24-1.27-.48-2.2-.97-3.63-3.19-3.74-3.35-.11-.15-.9-1.2-.9-2.28 0-1.07.56-1.58.77-1.8Z" fill="currentColor" />
    </svg>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { settings } = useWebsiteSettings();
  const quoteHref = `/contact?product=${encodeURIComponent(product.slug)}`;
  const whatsappMessage = `Hello Babu Commission Shop, I am interested in ${product.name}. Please share the current price, quality options and bulk availability.`;
  const whatsappHref = getShopWhatsAppUrl(settings?.whatsapp, whatsappMessage);

  return (
    <article className="relative flex h-full w-full min-w-0 flex-col pt-10 sm:pt-12">
      <Link
        to={`/dates/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-x-3 top-0 z-20 mx-auto block h-40 max-w-[14rem] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-date-800 focus-visible:ring-offset-4 sm:h-48 sm:max-w-[16rem]"
      >
        <MediaImage
          src={product.image_url || undefined}
          alt={product.image_url ? product.name : `${product.name} - representative stock photo`}
          className="h-full w-full rounded-lg object-cover drop-shadow-[0_16px_18px_rgba(43,29,19,0.2)]"
          fallbackLabel={false}
          stockPhotoVariant={product.slug}
        />
      </Link>

      <div className="relative flex flex-1 flex-col rounded-[24px] border border-date-200/60 bg-[#fffdfa] px-4 pb-5 pt-[8.25rem] shadow-[0_18px_40px_-30px_rgba(48,31,20,0.28),0_5px_12px_-8px_rgba(48,31,20,0.12)] sm:px-5 sm:pb-6 sm:pt-[9rem] lg:px-6 lg:pt-[9.5rem]">
        <div className="mb-2 min-h-5 truncate text-xs font-semibold tracking-[0.06em] text-sand-700">
          {product.category || <span aria-hidden="true">&nbsp;</span>}
        </div>

        <h3 className="min-h-[1.75rem] line-clamp-2 text-left font-display text-lg font-semibold leading-snug text-date-950 sm:text-xl">
          <Link to={`/dates/${product.slug}`} className="transition-colors hover:text-sand-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-date-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 min-h-[3rem] text-left text-sm leading-6 text-date-600 line-clamp-2">{product.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-6">
          <Link
            to={quoteHref}
            aria-label={`Get a quote for ${product.name}`}
            className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-date-900 px-1.5 text-xs font-semibold text-cream transition-colors duration-200 hover:bg-date-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-600 focus-visible:ring-offset-2 xl:px-3 xl:text-sm"
          >
            Get a Quote
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask about ${product.name} on WhatsApp (opens in a new tab)`}
              title={`Ask about ${product.name} on WhatsApp`}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-palm-700/15 bg-palm-50 text-palm-800 transition-colors duration-200 hover:bg-palm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palm-700 focus-visible:ring-offset-2"
            >
              <WhatsAppIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
