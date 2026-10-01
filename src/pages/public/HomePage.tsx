import { ArrowRight, Check, MapPin, Package, Sprout, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnquiryForm } from '@/components/EnquiryForm';
import { PublicLayout } from '@/components/PublicLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { EmptyState, LoadingSpinner } from '@/components/States';
import { useAboutContent, useProducts, useServices, useWebsiteSettings } from '@/hooks/useData';
import { getWhatsAppUrl } from '@/lib/contact';
import { PLACEHOLDER_IMAGES, PRODUCT_IMAGES } from '@/lib/constants';
import { sanitizeAboutContent, sanitizePublicSettings } from '@/lib/siteContent';

export function HomePage() {
  const { products, loading: productsLoading } = useProducts();
  const { services } = useServices();
  const { about: rawAbout } = useAboutContent();
  const { settings: rawSettings } = useWebsiteSettings();
  const about = sanitizeAboutContent(rawAbout);
  const settings = sanitizePublicSettings(rawSettings);

  const featuredProducts = products.filter((product) => product.featured);
  const displayProducts = (featuredProducts.length ? featuredProducts : products).slice(0, 3);
  const whatsappUrl = getWhatsAppUrl(settings?.whatsapp);
  const aboutCopy = about?.business_description || settings?.description;

  return (
    <PublicLayout
      description={settings?.meta_description || 'Explore date varieties from Khairpur and contact Babu Commission Shop about sourcing and wholesale enquiries.'}
      image={PLACEHOLDER_IMAGES.datesBowl}
    >
      <section className="bg-cream">
        <div className="container-prose grid min-h-[36rem] items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-2"><MapPin size={15} aria-hidden="true" /> Khairpur, Sindh</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-date-950 sm:text-5xl lg:text-6xl">
              Khairpur dates, sourced with care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-date-700">
              {settings?.tagline || 'Explore date varieties and talk with Babu Commission Shop about your sourcing requirements.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/#wholesale" className="btn-primary">Request a wholesale quote <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="/dates" className="btn-secondary">Explore our dates</Link>
            </div>
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-palm-800 underline decoration-palm-300 underline-offset-4">Message us on WhatsApp <ArrowRight size={15} aria-hidden="true" /></a>}
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-date-100">
              <img
                src={PLACEHOLDER_IMAGES.datesBowl}
                alt="Representative image of dates"
                width="940"
                height="705"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
            {settings?.address_short && <div className="absolute -bottom-4 left-4 rounded-md border border-date-200 bg-white px-4 py-3 text-sm font-medium text-date-900 shadow-md sm:bottom-5 sm:left-5">{settings.address_short}</div>}
          </div>
        </div>
      </section>

      <section className="border-y border-date-200 bg-date-50 py-5">
        <div className="container-prose flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm font-medium text-date-800">
          <span className="inline-flex items-center gap-2"><Sprout size={17} className="text-palm-700" aria-hidden="true" /> Khairpur date varieties</span>
          <span className="inline-flex items-center gap-2"><Package size={17} className="text-palm-700" aria-hidden="true" /> Sourcing enquiries</span>
          <span className="inline-flex items-center gap-2"><Truck size={17} className="text-palm-700" aria-hidden="true" /> Wholesale discussions</span>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-prose">
          <SectionTitle eyebrow="Our Dates" title="Explore date varieties" subtitle="Browse the current varieties listed by Babu Commission Shop. Contact us to ask about availability and quantities." center />
          {productsLoading ? <LoadingSpinner label="Loading date varieties..." /> : displayProducts.length === 0 ? (
            <EmptyState title="No products available" message="Please check back soon for date varieties." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product) => (
                <Link key={product.id} to={`/dates/${product.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-date-100">
                    <img src={product.image_url || PRODUCT_IMAGES[product.slug] || PLACEHOLDER_IMAGES.datesBowl} alt={product.image_url ? product.name : `${product.name} — representative image`} width="940" height="705" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    {product.category && <p className="eyebrow">{product.category}</p>}
                    <h3 className="mt-2 font-display text-xl font-semibold text-date-950">{product.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-date-700">{product.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-date-900">View details <ArrowRight size={15} aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-9 text-center"><Link to="/dates" className="btn-secondary">View all varieties <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 section-padding bg-date-950 text-cream">
        <div className="container-prose">
          <SectionTitle eyebrow="How to Enquire" title="A clear way to get started" subtitle="Share what you need, then discuss product options and next steps directly with the shop." center light />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Sprout, title: 'Choose a variety', text: 'Browse the listed date varieties or ask about another requirement.' },
              { Icon: Package, title: 'Share quantities', text: 'Tell us the approximate quantity and intended use.' },
              { Icon: Check, title: 'Discuss details', text: 'We can follow up to discuss availability, packaging, and terms.' },
              { Icon: Truck, title: 'Agree next steps', text: 'Confirm arrangements directly with the shop before placing an order.' },
            ].map(({ Icon, title: stepTitle, text }, index) => (
              <article key={stepTitle} className="relative rounded-md border border-cream/15 bg-white/5 p-6">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-palm-800 text-cream"><Icon size={22} aria-hidden="true" /></span>
                <p className="text-xs font-bold uppercase tracking-widest text-sand-300">Step {index + 1}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-cream">{stepTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-cream/75">{text}</p>
              </article>
            ))}
          </div>
          {services.length > 0 && <div className="mt-8 text-center"><Link to="/services" className="inline-flex min-h-11 items-center gap-2 font-semibold text-cream underline decoration-cream/40 underline-offset-4 hover:text-sand-300">See listed services <ArrowRight size={16} aria-hidden="true" /></Link></div>}
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-prose grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-date-100">
            <img src={about?.image_1_url || PLACEHOLDER_IMAGES.palmPlantation} alt={about?.image_1_url ? 'Image provided by Babu Commission Shop' : 'Representative date palm image'} width="940" height="705" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionTitle eyebrow="About" title="Learn more about the shop" />
            <p className="leading-7 text-date-700">{aboutCopy || 'Babu Commission Shop is based in Khairpur, Sindh. Contact the shop to ask about the varieties listed here and your sourcing requirements.'}</p>
            <Link to="/about" className="btn-text mt-5">More about the shop <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section id="wholesale" className="scroll-mt-24 section-padding bg-date-50">
        <div className="container-prose grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Wholesale enquiry</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-date-950 sm:text-4xl">Tell us what you need.</h2>
            <p className="mt-4 leading-7 text-date-700">Send your variety, quantity, and packaging requirements. The shop can follow up using the details you provide.</p>
            {settings?.address && <p className="mt-6 inline-flex items-start gap-2 text-sm text-date-700"><MapPin size={17} className="mt-0.5 shrink-0" aria-hidden="true" />{settings.address}</p>}
          </div>
          <div className="rounded-md border border-date-200 bg-white p-5 shadow-sm sm:p-8">
            <EnquiryForm products={products} services={services} mode="wholesale" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
