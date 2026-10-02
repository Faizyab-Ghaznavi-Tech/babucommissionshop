import { useState } from 'react';
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Package, PackageCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getShopWhatsAppUrl } from '@/lib/contact';

interface HomepageHeroProps {
  image?: string;
  whatsappNumber?: string | null;
}

const trustItems = [
  { Icon: MapPin, label: 'Khairpur, Sindh, Pakistan' },
  { Icon: Package, label: 'Wholesale enquiries' },
  { Icon: PackageCheck, label: 'Custom Brand Packaging' },
  { Icon: BadgeCheck, label: 'Export-Quality Dates' },
  { Icon: Truck, label: 'Nationwide Supply' },
];

export function HomepageHero({ image, whatsappNumber }: HomepageHeroProps) {
  const [loadedHeroImage, setLoadedHeroImage] = useState('');
  const whatsappHref = getShopWhatsAppUrl(whatsappNumber || undefined, 'Hi, I would like to discuss Khairpur dates and wholesale supply.');

  return (
    <section className="relative isolate min-h-[46rem] overflow-hidden bg-date-800 text-white sm:min-h-[43rem] lg:min-h-[42rem]">
      <div className="absolute inset-0 z-0 overflow-hidden bg-date-800">
        {image && (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoadedHeroImage(image)}
            className={`absolute inset-0 h-full w-full object-cover object-[72%_center] transition-opacity duration-700 ease-out motion-reduce:transition-none sm:object-[68%_center] lg:object-[right_center] ${loadedHeroImage === image ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>

      <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(43,25,19,0.7)_0%,rgba(43,25,19,0.64)_48%,rgba(43,25,19,0.36)_100%)] lg:hidden" />
      <div aria-hidden="true" className="absolute inset-0 z-10 hidden lg:block" style={{ background: 'linear-gradient(90deg, rgba(43,25,19,0.7) 0%, rgba(43,25,19,0.68) 30%, rgba(43,25,19,0.5) 48%, rgba(43,25,19,0.2) 70%, rgba(43,25,19,0.03) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-date-950/35 via-transparent to-date-950/10" />

      <div className="container-prose relative z-20 flex min-h-[46rem] flex-col justify-between py-7 pt-[7.75rem] sm:min-h-[43rem] sm:pt-36 lg:min-h-[42rem] lg:py-9 lg:pt-40">
        <div className="max-w-[46rem] lg:max-w-[44rem]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-sand-300 sm:text-xs sm:tracking-[0.22em]">
            <span aria-hidden="true" className="h-px w-8 bg-sand-500" />
            <span>Premium Khairpur Dates</span>
            <span aria-hidden="true" className="h-px w-8 bg-sand-500" />
          </p>

          <h1 className="mt-5 w-full max-w-[44rem] break-words font-display text-[2.3rem] font-medium leading-[1.06] tracking-[-0.025em] text-cream sm:mt-6 sm:text-5xl sm:leading-[1.08] lg:text-[3.8rem] xl:text-[4.2rem]">
            <span className="block">Nature’s Finest Dates,</span>
            <span className="mt-1 block italic text-sand-400">Directly From Khairpur</span>
          </h1>

          <p className="mt-5 max-w-[38rem] text-[0.94rem] leading-7 text-cream/80 sm:mt-6 sm:text-base sm:leading-7">
            Authentic Khairpur dates, carefully sourced and supplied in bulk on commission. Quality you can trust, straight from the source.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
            <Link to="/#wholesale" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[#D89D40] px-5 text-sm font-semibold text-date-950 shadow-[0_8px_22px_rgba(15,9,5,0.18)] transition-colors duration-200 hover:bg-[#E7AE54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89D40] focus-visible:ring-offset-2 focus-visible:ring-offset-date-950 sm:w-auto">
              Request Wholesale Quote <ArrowRight size={17} aria-hidden="true" />
            </Link>
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Contact the shop on WhatsApp (opens in a new tab)" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-date-950/25 px-5 text-sm font-semibold text-cream transition-colors duration-200 hover:border-white/45 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-date-950 sm:w-auto">
                <MessageCircle size={17} aria-hidden="true" />
                Contact on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <ul aria-label="Shop information" className="mt-8 grid gap-3 border-t border-white/20 pt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 lg:mt-10 lg:grid lg:max-w-[70rem] lg:grid-cols-5 lg:items-center lg:gap-0">
          {trustItems.map(({ Icon, label }) => (
            <li key={label} className="inline-flex min-h-7 items-center gap-2.5 text-[0.78rem] font-medium text-cream/85 sm:text-sm lg:border-l lg:border-white/15 lg:px-3 xl:px-4 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
              <Icon size={17} className="shrink-0 text-sand-400" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
