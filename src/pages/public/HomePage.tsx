import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  ChevronDown,
  MapPin,
  MessageCircle,
  Package,
  Sprout,
  TreePalm,
  Handshake,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EnquiryForm } from '@/components/EnquiryForm';
import { HomepageHero } from '@/components/HomepageHero';
import { MediaImage } from '@/components/MediaImage';
import { ProductCard } from '@/components/ProductCard';
import { PublicLayout } from '@/components/PublicLayout';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/States';
import { useAboutContent, useProducts, useServices, useWebsiteSettings } from '@/hooks/useData';
import { sanitizeAboutContent, sanitizePublicSettings } from '@/lib/siteContent';

const processSteps = [
  { Icon: Sprout, title: 'Browse', text: 'Explore listed varieties or ask about another one.' },
  { Icon: Boxes, title: 'Share your needs', text: 'Tell us the variety and approximate quantity.' },
  { Icon: MessageCircle, title: 'Discuss', text: 'Ask about current availability and options.' },
  { Icon: BadgeCheck, title: 'Confirm terms', text: 'Agree on grade, price, and arrangements.' },
  { Icon: Package, title: 'Proceed', text: 'Move ahead once the details are clear.' },
];

const whyFeatures = [
  {
    Icon: TreePalm,
    title: 'Khairpur Origin',
    text: "Sourced from one of Pakistan's renowned date-producing regions.",
  },
  {
    Icon: Boxes,
    title: 'Wholesale Supply',
    text: 'Solutions for retailers, wholesalers, traders and distributors.',
  },
  {
    Icon: BadgeCheck,
    title: 'Carefully Selected',
    text: 'Quality-focused sourcing and sorting.',
  },
  {
    Icon: Handshake,
    title: 'Reliable Dealing',
    text: 'Straightforward communication and dependable service.',
  },
];

const faqs = [
  {
    question: 'Which date varieties can I ask about?',
    answer: 'Browse the current product listings, then contact the shop to ask about a variety that is not shown.',
  },
  {
    question: 'Are listed varieties always available?',
    answer: 'Availability can change. Please confirm the current variety, grade, and quantity with the shop before ordering.',
  },
  {
    question: 'How do I request a wholesale quote?',
    answer: 'Use the enquiry form with your contact details, variety of interest, and approximate quantity. The shop can respond to discuss the request.',
  },
  {
    question: 'Can I ask about packaging or delivery?',
    answer: 'Include those requirements in your enquiry so the shop can confirm which arrangements are available for your order.',
  },
];

export function HomePage() {
  const whySectionRef = useRef<HTMLElement>(null);
  const [whySectionVisible, setWhySectionVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reduceMotion);

    if (reduceMotion) {
      setWhySectionVisible(true);
      return;
    }

    const section = whySectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setWhySectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setWhySectionVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { services } = useServices();
  const { about: rawAbout } = useAboutContent();
  const { settings: rawSettings } = useWebsiteSettings();
  const about = sanitizeAboutContent(rawAbout);
  const settings = sanitizePublicSettings(rawSettings);

  const featuredProducts = products.filter((product) => product.featured);
  const displayProducts = [...featuredProducts, ...products.filter((product) => !product.featured)].slice(0, 5);
  const heroImage = settings?.hero_image_url || undefined;
  const aboutCopy = about?.business_description || about?.company_story || settings?.description
    || 'Babu Commission Shop helps buyers start a conversation about Khairpur date varieties, quantities, and sourcing requirements.';

  return (
    <PublicLayout
      description={settings?.meta_description || 'Explore Khairpur date varieties and send Babu Commission Shop a wholesale enquiry.'}
      image={heroImage}
    >
      <HomepageHero image={heroImage} whatsappNumber={settings?.whatsapp} />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-[#DCBD84] sm:text-5xl lg:text-[3.5rem]">Our Products</h2>
              <p className="mt-3 font-display text-xl font-semibold text-date-950 sm:text-2xl">Selected Dates from Khairpur</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-date-700 sm:text-base">
                Explore our selection of Khairpur dates, available for wholesale supply and bulk enquiries.
              </p>
            </div>
            <Link to="/dates" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-date-700 transition-colors hover:text-sand-700">
              View all products <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {productsLoading ? <LoadingSpinner label="Loading date varieties..." /> : productsError ? (
            <ErrorState message={`Could not load date varieties: ${productsError}`} />
          ) : displayProducts.length === 0 ? (
            <EmptyState title="Date varieties are being prepared" message="New listings will appear here when they are published by the shop." />
          ) : (
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      <section ref={whySectionRef} id="why-babu" className="relative isolate overflow-hidden bg-palm-600 text-white">
        <MediaImage alt="Date palms growing in the Khairpur region" className="absolute inset-0 z-0 h-full w-full object-cover object-[center_28%] opacity-40 brightness-75 saturate-75" fallbackLabel={false} stockPhotoVariant="grove" />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-palm-950/70" />
        <div className="container-prose relative z-20 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-9 py-12 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] lg:items-center lg:gap-10 lg:py-16">
          <div className={`min-w-0 max-w-xl transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none ${whySectionVisible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[2px]'}`}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dcbd84]">WHY BABU COMMISSION SHOP?</p>
            <h2 className="mt-3 whitespace-nowrap font-display text-[clamp(1.15rem,3.3vw,2.15rem)] font-semibold leading-tight text-[#dcbd84]">
              Your Trusted Partner
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              We are committed to providing quality dates and reliable business dealing for our valued customers.
            </p>
          </div>
          <div className="grid min-w-0 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
            {whyFeatures.map(({ Icon, title, text }, index) => (
              <article
                key={title}
                className={`group min-w-0 flex items-start gap-4 border-t border-white/15 pt-5 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 lg:min-h-36 lg:flex-col lg:items-center lg:border-l lg:border-t-0 lg:border-white/20 lg:pl-5 lg:pt-0 lg:text-center lg:first:border-l-0 lg:first:pl-0 xl:pl-6 xl:first:pl-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${whySectionVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-[0.97] opacity-0'}`}
                style={{ transitionDelay: whySectionVisible && !prefersReducedMotion ? `${index * 110}ms` : '0ms' }}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center text-[#dcbd84] transition-[color,transform] duration-500 ease-out group-hover:scale-110 group-hover:text-[#F0D49A] motion-reduce:scale-100 motion-reduce:transition-none lg:h-9 lg:w-9 ${whySectionVisible ? 'rotate-0 scale-100' : '-rotate-12 scale-75'}`}
                  style={{ transitionDelay: whySectionVisible && !prefersReducedMotion ? `${index * 110 + 100}ms` : '0ms' }}
                >
                  <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div className="min-w-0 lg:flex-1">
                  <h3 className="font-display text-base font-semibold text-white/90 transition-colors duration-200 group-hover:text-white sm:text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-5 text-white/75 lg:text-xs lg:leading-[1.15rem] xl:text-[0.8rem]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 bg-[#f7f2e8] py-12 sm:py-14 lg:py-16">
        <div className="container-prose">
          <div className="max-w-5xl">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#dcbd84] sm:text-4xl lg:text-[2.75rem]">Our process</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-start md:gap-6">
              <h3 className="font-display text-2xl font-semibold leading-tight text-date-950 sm:text-3xl">From Khairpur to your enquiry.</h3>
              <p className="max-w-xl text-sm leading-6 text-date-700 sm:text-base sm:leading-7 md:border-l md:border-sand-300 md:pl-5">A straightforward conversation helps both sides confirm the variety, quantity, and terms before an order proceeds.</p>
            </div>
          </div>

          <div className="relative mt-9 grid grid-cols-1 gap-y-4 sm:mt-10 lg:mt-12 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-0">
            <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[1.375rem] hidden h-px bg-[#c0a26a]/75 lg:block" />
            {[20, 40, 60, 80].map((position) => (
              <span
                key={position}
                aria-hidden="true"
                className="absolute top-[1.375rem] z-10 hidden -translate-x-1/2 -translate-y-1/2 bg-[#f7f2e8] px-1 text-[0.7rem] leading-none text-[#a98a4f] lg:block"
                style={{ left: `${position}%` }}
              >
                <ArrowRight size={10} strokeWidth={1.6} aria-hidden="true" />
              </span>
            ))}
            {processSteps.map(({ Icon, title, text }, index) => (
              <article key={title} className="group/process relative grid grid-cols-[3rem_minmax(0,1fr)] items-stretch gap-x-3 lg:flex lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                {index < processSteps.length - 1 && (
                  <span aria-hidden="true" className="absolute -bottom-[3.625rem] left-[1.375rem] top-16 w-px bg-[#c0a26a]/70 lg:hidden" />
                )}
                <span aria-hidden="true" className="relative z-20 mt-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b99a60] bg-[#f7f2e8] font-sans text-[0.7rem] font-semibold tracking-[0.12em] text-date-800 shadow-[0_0_0_5px_#f7f2e8] transition-[background-color,color,transform] duration-300 group-hover/process:scale-105 group-hover/process:bg-[#b99a60] group-hover/process:text-white motion-reduce:transition-none lg:mt-0">
                  0{index + 1}
                </span>
                <div className="group/card relative z-10 flex min-h-[8.75rem] flex-col rounded-lg border border-[#e5dccb] bg-[#fffdf9] p-4 shadow-[0_8px_24px_rgba(55,37,20,0.045)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#cdb783] hover:shadow-[0_14px_30px_rgba(55,37,20,0.09)] motion-reduce:transform-none motion-reduce:transition-none sm:p-5 lg:mt-5 lg:min-h-[14rem] lg:w-full lg:flex-1 lg:items-center lg:p-4 xl:p-5">
                  <div className="flex items-center gap-3 lg:flex-col lg:gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e9dfcd] bg-[#f5efe3] text-date-700 transition-[transform,color,background-color] duration-300 group-hover/card:scale-110 group-hover/card:bg-[#eee2cd] group-hover/card:text-sand-800 motion-reduce:transition-none lg:h-11 lg:w-11">
                      <Icon size={20} strokeWidth={1.65} aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug text-date-950 sm:text-xl lg:min-h-[3.5rem]">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-date-600 lg:mt-2 lg:max-w-[12rem] lg:text-[0.82rem] lg:leading-[1.35rem]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="wholesale" className="scroll-mt-24 bg-date-100">
        <div className="grid lg:min-h-[34rem] lg:grid-cols-2">
          <div className="relative isolate flex min-h-[25rem] items-center overflow-hidden bg-date-900 px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <MediaImage src={settings?.wholesale_background_url} alt="Date palms in a Khairpur growing region" className="absolute inset-0 z-0 h-full w-full object-cover object-[center_54%] brightness-75 saturate-75" fallbackLabel={false} stockPhotoVariant="grove" />
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-date-950/25" />
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-r from-date-950/90 via-date-950/70 to-date-950/25" />
            <div className="relative z-20 mx-auto w-full max-w-xl lg:ml-0 lg:mr-auto lg:max-w-[34rem]">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-sand-300">B2B & wholesale</p>
              <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">Looking for Dates in Bulk?</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/90 sm:text-base sm:leading-7">Tell us what you need and we'll get back to you with the best options and current market rates.</p>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm font-medium text-white/95 sm:mt-6">
                {['Aseel Dates', 'Other Date Varieties', 'Custom Packaging', 'Commercial Quantities'].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2.5"><Check size={15} strokeWidth={2.2} className="shrink-0 text-sand-400" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center bg-[#f2ecdf] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-xl rounded-lg border border-date-200 bg-[#fffdf8] p-4 shadow-[0_16px_44px_rgba(28,16,12,0.08)] sm:p-5 lg:mx-0 lg:max-w-[40rem] lg:p-6">
              <div className="mb-4">
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-sand-800">Wholesale enquiry</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-date-950 sm:text-2xl">Request a wholesale quote</h3>
                <p className="mt-1 text-sm leading-5 text-date-600">Leave your details and the shop can follow up about your requirements.</p>
              </div>
              <EnquiryForm products={products} services={services} mode="wholesale" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-prose grid gap-7 lg:grid-cols-[0.9fr_1.1fr_0.85fr] lg:items-center lg:gap-8">
          <div className="aspect-[4/3] overflow-hidden border border-date-200 bg-date-100">
            <MediaImage src={about?.image_1_url || featuredProducts.find((product) => product.image_url)?.image_url} alt={about?.image_1_url ? 'Image provided by Babu Commission Shop' : 'Date palm grove (representative stock photo)'} className="h-full w-full object-cover" fallbackLabel={false} stockPhotoVariant="about" />
          </div>
          <div className="py-1">
            <p className="eyebrow">About us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-date-950">Khairpur dates, discussed with care.</h2>
            <p className="mt-4 text-sm leading-6 text-date-700 sm:text-base sm:leading-7">{aboutCopy}</p>
            <Link to="/about" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-date-800 underline decoration-sand-500 underline-offset-4 transition-colors hover:text-sand-700">
              Learn more <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <aside className="border border-date-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-palm-700">Visit our shop</p>
            <div className="mt-4 flex items-start gap-3">
              <MapPin size={19} className="mt-0.5 shrink-0 text-sand-700" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-date-950">Babu Commission Shop</h3>
                <p className="mt-1 text-sm leading-5 text-date-600">{settings?.address || 'Khairpur, Sindh, Pakistan'}</p>
              </div>
            </div>
            {settings?.phone && <p className="mt-4 border-t border-date-100 pt-4 text-sm text-date-700">Call: {settings.phone}</p>}
            <Link to="/contact" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-date-800 hover:text-sand-700">Contact the shop <ArrowRight size={15} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="section-padding border-t border-date-200 bg-white">
        <div className="container-prose grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">Questions & answers</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-date-950 sm:text-4xl">Good to know before you enquire.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-date-700">If you need details about a specific variety or order, contact the shop and include your requirements.</p>
            <Link to="/contact" className="btn-secondary mt-6">Ask a question <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="divide-y divide-date-200 border-y border-date-200">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 font-semibold text-date-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown size={18} className="shrink-0 text-sand-700 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pb-1 pr-8 pt-3 text-sm leading-6 text-date-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
