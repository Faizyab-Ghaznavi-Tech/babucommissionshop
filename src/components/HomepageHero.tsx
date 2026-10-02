import { ArrowRight, MapPin, MessageCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaImage } from '@/components/MediaImage';

interface HomepageHeroProps {
  image?: string;
}

const trustItems = [
  { Icon: MapPin, label: 'Khairpur, Sindh, Pakistan' },
  { Icon: Package, label: 'Wholesale enquiries' },
  { Icon: MessageCircle, label: 'Discuss directly with the shop' },
];

export function HomepageHero({ image }: HomepageHeroProps) {
  return (
    <section className="relative isolate min-h-[46rem] overflow-hidden bg-date-950 text-white sm:min-h-[43rem] lg:min-h-[42rem]">
      <div className="absolute inset-0 z-0 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[74%]">
        <MediaImage
          src={image}
          alt="Date varieties prepared for wholesale enquiries"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[64%_center] sm:object-[60%_center]"
          fallbackLabel={false}
          stockPhotoVariant="hero"
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(28,16,12,0.88)_0%,rgba(28,16,12,0.82)_48%,rgba(28,16,12,0.48)_100%)] lg:hidden" />
      <div aria-hidden="true" className="absolute inset-0 z-10 hidden lg:block" style={{ background: 'linear-gradient(90deg, #1c100c 0%, rgba(28,16,12,0.98) 27%, rgba(28,16,12,0.88) 43%, rgba(28,16,12,0.48) 62%, rgba(28,16,12,0.08) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-date-950/55 via-transparent to-date-950/10" />

      <div className="container-prose relative z-20 flex min-h-[46rem] flex-col justify-between py-7 pt-[7.75rem] sm:min-h-[43rem] sm:pt-36 lg:min-h-[42rem] lg:py-9 lg:pt-40">
        <div className="max-w-[46rem] lg:max-w-[44rem]">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-sand-300 sm:text-xs sm:tracking-[0.22em]">
            <span aria-hidden="true" className="h-px w-6 bg-sand-500" />
            <span>Khairpur Dates</span>
            <span aria-hidden="true" className="text-sand-500">·</span>
            <span>Wholesale Enquiries</span>
          </p>

          <h1 className="mt-5 w-full max-w-[44rem] break-words font-display text-[2.3rem] font-medium leading-[1.06] tracking-[-0.025em] text-cream sm:mt-6 sm:text-5xl sm:leading-[1.08] lg:text-[3.8rem] xl:text-[4.2rem]">
            <span className="block">Authentic Khairpur Dates,</span>
            <span className="mt-1 block text-sand-400">Direct From the Source</span>
          </h1>

          <p className="mt-5 max-w-[33rem] text-[0.94rem] leading-7 text-cream/80 sm:mt-6 sm:text-base sm:leading-7">
            Explore date varieties and tell us what you need. Contact the shop to confirm current availability, grade, quantity, and terms.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
            <Link to="/#wholesale" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[#B87524] px-5 text-sm font-semibold text-date-950 shadow-[0_8px_22px_rgba(15,9,5,0.18)] transition-colors duration-200 hover:bg-[#ca8732] sm:w-auto">
              Request Wholesale Quote <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-date-950/25 px-5 text-sm font-semibold text-cream transition-colors duration-200 hover:border-white/45 hover:bg-white/[0.08] sm:w-auto">
              Contact the Shop
            </Link>
          </div>
        </div>

        <ul aria-label="Shop information" className="mt-8 grid gap-3 border-t border-white/20 pt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 lg:mt-10 lg:flex lg:max-w-[58rem] lg:items-center lg:gap-0">
          {trustItems.map(({ Icon, label }) => (
            <li key={label} className="inline-flex min-h-7 items-center gap-2.5 text-[0.78rem] font-medium text-cream/85 sm:text-sm lg:border-l lg:border-white/15 lg:px-5 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
              <Icon size={17} className="shrink-0 text-sand-400" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
