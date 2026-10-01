import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Handshake, Moon, Package, Ship, Sprout, Truck } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { MediaImage } from '@/components/MediaImage';
import { PageHeader } from '@/components/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/States';
import { useServices } from '@/hooks/useData';

const iconMap: Record<string, typeof Sprout> = { Sprout, Handshake, Package, Truck, Gift, Moon, Ship };

export function ServicesPage() {
  const { services, loading, error } = useServices();

  return (
    <PublicLayout title="Services" description="View the services listed by Babu Commission Shop and ask about Khairpur date sourcing requirements.">
      <PageHeader title="Services" subtitle="Review the services listed here and contact the shop to discuss your requirements." eyebrow="What we do" />
      <section className="section-padding bg-cream">
        <div className="container-prose">
          {loading ? <LoadingSpinner label="Loading services..." /> : error ? <ErrorState message={`Could not load services: ${error}`} /> : services.length === 0 ? (
            <EmptyState title="No services listed" message="Please contact the shop with your requirements." />
          ) : (
            <div className="space-y-5">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon_name] || Package;
                return (
                  <article key={service.id} className="grid items-center gap-6 rounded-md border border-date-200 bg-white p-5 sm:p-7 md:grid-cols-2 md:gap-10">
                    <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-date-100 text-date-900"><Icon size={25} aria-hidden="true" /></span>
                      <h2 className="font-display text-2xl font-semibold text-date-950">{service.name}</h2>
                      <p className="mt-3 whitespace-pre-line leading-7 text-date-700">{service.description}</p>
                      <Link to={`/contact?service=${encodeURIComponent(service.name)}`} className="btn-text mt-4">Enquire about this service <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                    <div className={`aspect-[4/3] overflow-hidden rounded-md bg-date-100 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      {service.image_url ? <MediaImage src={service.image_url} alt={service.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Icon size={64} className="text-date-300" aria-hidden="true" /></div>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="section-padding bg-date-50">
        <div className="container-prose text-center">
          <h2 className="font-display text-2xl font-semibold text-date-950">Have a specific requirement?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-date-700">Contact the shop with the variety, quantity, and service you are looking for. Availability and arrangements can be discussed directly.</p>
          <Link to="/contact" className="btn-primary mt-6">Send an enquiry <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </PublicLayout>
  );
}
