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
} from 'lucide-react';
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

      <section className="relative isolate overflow-hidden bg-palm-600 text-white">
        <MediaImage alt="Date palm grove" className="absolute inset-0 z-0 h-full w-full object-cover opacity-30" fallbackLabel={false} stockPhotoVariant="grove" />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-r from-palm-950/95 via-palm-800/90 to-palm-700/85" />
        <div className="container-prose relative z-20 grid gap-9 py-12 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand-300">Why Babu Commission Shop?</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">A Khairpur starting point for your date enquiry.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              Browse the catalog, share what you need, and discuss the details with the shop before making a decision.
            </p>
          </div>
          <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
            {[
              { Icon: MapPin, title: 'Khairpur focus', text: 'Explore date varieties associated with the Khairpur region.' },
              { Icon: Boxes, title: 'Wholesale enquiries', text: 'Share quantities and requirements for a business order.' },
              { Icon: MessageCircle, title: 'Direct discussion', text: 'Ask the shop about availability, grade, and arrangements.' },
              { Icon: Check, title: 'Clear next steps', text: 'Confirm the order details before moving ahead.' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-3 border-t border-white/20 pt-4">
                <Icon size={21} className="mt-0.5 shrink-0 text-sand-400" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-white/75">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 section-padding bg-white">
        <div className="container-prose">
          <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <div>
              <p className="eyebrow">Our process</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-date-950 sm:text-4xl">From Khairpur to your enquiry.</h2>
            </div>
            <p className="max-w-2xl leading-7 text-date-700 md:justify-self-end">A straightforward conversation helps both sides confirm the variety, quantity, and terms before an order proceeds.</p>
          </div>

          <div className="relative mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-5 md:gap-3">
            <div aria-hidden="true" className="absolute bottom-0 left-6 top-6 border-l border-date-200 md:bottom-auto md:left-[9%] md:right-[9%] md:top-6 md:border-l-0 md:border-t" />
            {processSteps.map(({ Icon, title, text }, index) => (
              <article key={title} className="relative flex gap-4 bg-white md:flex-col md:items-center md:gap-0 md:px-2 md:text-center">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-sand-100 text-sand-800 md:mb-4">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <div className="pb-1 md:pb-0">
                  <p className="text-[0.65rem] font-bold tracking-[0.16em] text-sand-700">0{index + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-date-950">{title}</h3>
                  <p className="mt-1 max-w-[13rem] text-xs leading-5 text-date-600 md:mx-auto">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="wholesale" className="scroll-mt-24 bg-date-100">
        <div className="grid lg:min-h-[35rem] lg:grid-cols-2">
          <div className="relative isolate flex min-h-[23rem] items-end overflow-hidden bg-date-900 px-5 py-9 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <MediaImage alt="Dates for wholesale enquiries" className="absolute inset-0 z-0 h-full w-full object-cover" fallbackLabel={false} stockPhotoVariant="wholesale" />
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-date-950/95 via-date-950/65 to-date-950/15" />
            <div className="relative z-20 mx-auto w-full max-w-xl lg:ml-auto lg:mr-0 lg:max-w-[34rem]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand-300">B2B & wholesale</p>
              <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">Looking for dates in bulk?</h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base sm:leading-7">Tell the shop what you need. Include a variety, approximate quantity, and any packaging or delivery requirements.</p>
              <ul className="mt-6 grid gap-2 text-sm text-white/90 sm:grid-cols-2">
                {['Date variety', 'Approximate quantity', 'Packaging needs', 'Preferred arrangements'].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2"><Check size={15} className="shrink-0 text-sand-400" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center bg-cream px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
            <div className="mx-auto w-full max-w-xl border border-date-200 bg-white p-5 shadow-sm sm:p-7 lg:mx-0 lg:max-w-[38rem]">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-semibold text-date-950">Request a wholesale quote</h3>
                <p className="mt-2 text-sm leading-6 text-date-600">Leave your details and the shop can follow up about your requirements.</p>
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
