import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Handshake, Moon, Package, Ship, Sprout, Truck } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { MediaImage } from '@/components/MediaImage';
import { PageHeader } from '@/components/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/States';
import { useServices, useWebsiteSettings } from '@/hooks/useData';

const iconMap: Record<string, typeof Sprout> = { Sprout, Handshake, Package, Truck, Gift, Moon, Ship };

export function ServicesPage() {
  const { services, loading, error } = useServices();
  const { settings } = useWebsiteSettings();

  return (
    <PublicLayout title="Services" description="View the services listed by Babu Commission Shop and ask about Khairpur date sourcing requirements.">
      <PageHeader title="Services" subtitle="Review the services listed here and contact the shop to discuss your requirements." eyebrow="What we do" image={settings?.services_background_url || undefined} />
      <section className="section-padding relative isolate overflow-hidden bg-gradient-to-br from-cream via-sand-100 to-palm-100">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-8 -z-10 h-[34rem] w-[34rem] rounded-full bg-sand-400/45 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-36 -z-10 h-[36rem] w-[36rem] rounded-full bg-palm-300/45 blur-[120px]" />
        <div className="container-prose relative z-10">
          {loading ? <LoadingSpinner label="Loading services..." /> : error ? <ErrorState message={`Could not load services: ${error}`} /> : services.length === 0 ? (
            <EmptyState title="No services published yet" message="Please contact the shop with your requirements." />
          ) : (
            <div className="space-y-6 lg:space-y-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon_name] || Package;
                return (
                  <article
                    key={service.id}
                    className="group grid animate-fade-in-up items-center gap-6 rounded-2xl border border-white/65 bg-cream/35 p-4 text-date-950 shadow-[0_16px_44px_rgba(55,37,20,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out hover:-translate-y-1 hover:border-white/85 hover:bg-white/45 hover:shadow-[0_24px_54px_rgba(55,37,20,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] motion-reduce:transform-none motion-reduce:animate-none motion-reduce:transition-none sm:p-6 lg:gap-10 lg:p-8 md:grid-cols-2"
                    style={{ animationDelay: `${Math.min(index, 6) * 100}ms`, animationFillMode: 'both' }}
                  >
                    <div className={`relative isolate overflow-hidden rounded-xl border border-white/75 bg-gradient-to-br from-white/85 via-cream/75 to-sand-200/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(55,37,20,0.06)] backdrop-blur-2xl sm:p-7 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-16 -z-10 h-48 w-48 rounded-full bg-sand-300/35 blur-3xl" />
                      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-10 -z-10 h-44 w-44 rounded-full bg-palm-200/25 blur-3xl" />
                      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-palm-100/80 bg-palm-50/90 text-palm-800 transition-[transform,background-color] duration-300 group-hover:rotate-3 group-hover:bg-palm-100 motion-reduce:transform-none motion-reduce:transition-none"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
                      <h2 className="font-display text-2xl font-semibold leading-tight text-date-950 sm:text-3xl">{service.name}</h2>
                      <p className="mt-3 whitespace-pre-line leading-7 text-date-700">{service.description}</p>
                      <Link
                        to={`/contact?service=${encodeURIComponent(service.name)}`}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#D89D40] px-5 text-sm font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(55,37,20,0.1)] transition-[transform,background-color,box-shadow] duration-300 hover:translate-x-0.5 hover:bg-[#E7AE54] hover:text-date-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89D40] focus-visible:ring-offset-2 focus-visible:ring-offset-cream motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        Enquire about this service
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                    <div className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-white/60 bg-date-100 shadow-[0_8px_24px_rgba(55,37,20,0.08)] ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      {service.image_url ? (
                        <MediaImage src={service.image_url} alt={service.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-date-100 via-cream to-palm-100"><Icon size={64} strokeWidth={1.3} className="text-date-400/70 transition-transform duration-500 group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" /></div>
                      )}
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-date-950/5" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="section-padding bg-date-50">
        <div className="container-prose">
          <div className="animate-fade-in-up rounded-2xl border border-date-200/80 bg-cream px-6 py-8 text-center shadow-[0_12px_34px_rgba(55,37,20,0.06)] motion-reduce:animate-none sm:px-10 sm:py-10">
            <h2 className="font-display text-2xl font-semibold text-date-950 sm:text-3xl">Have a specific requirement?</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-date-700">Contact the shop with the variety, quantity, and service you are looking for. Availability and arrangements can be discussed directly.</p>
            <Link to="/contact" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D89D40] px-6 text-sm font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(55,37,20,0.1)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#E7AE54] hover:text-date-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89D40] focus-visible:ring-offset-2 focus-visible:ring-offset-date-50 motion-reduce:transform-none motion-reduce:transition-none">Send an enquiry <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
