import { Link } from 'react-router-dom';
import {
  Sprout, Handshake, Package, Truck, Gift, Moon, Ship,
  ArrowRight, Check,
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader, SectionTitle } from '@/components/SectionTitle';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { useServices } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

const iconMap: Record<string, typeof Sprout> = {
  Sprout, Handshake, Package, Truck, Gift, Moon, Ship,
};

export function ServicesPage() {
  const { services, loading } = useServices();

  return (
    <PublicLayout
      title="Services"
      description="Direct farmer sourcing, commission-based buying, bulk supply, nationwide delivery, and custom packaging for Khairpur dates."
      image={PLACEHOLDER_IMAGES.datesBags}
    >
      <PageHeader
        title="Our Services"
        subtitle="From sourcing dates directly from Khairpur's farmers to custom packaging and nationwide delivery — we offer comprehensive date sourcing solutions."
        image={PLACEHOLDER_IMAGES.datesBags}
      />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          {loading ? (
            <LoadingSpinner label="Loading services..." />
          ) : services.length === 0 ? (
            <EmptyState title="No services available" message="Please check back soon." />
          ) : (
            <div className="space-y-6">
              {services.map((service, idx) => {
                const Icon = iconMap[service.icon_name] ?? Package;
                const isReversed = idx % 2 === 1;
                return (
                  <div
                    key={service.id}
                    className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center card p-6 md:p-8 ${
                      isReversed ? 'md:[&>div:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="w-14 h-14 rounded-xl bg-palm-100 flex items-center justify-center mb-4">
                        <Icon size={28} className="text-palm-600" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-date-800 mb-3">
                        {service.name}
                      </h3>
                      <p className="text-date-600 leading-relaxed whitespace-pre-line mb-6">
                        {service.description}
                      </p>
                      <Link
                        to={`/contact?service=${encodeURIComponent(service.name)}`}
                        className="inline-flex items-center gap-2 text-date-700 font-medium hover:text-date-900 transition-colors self-start"
                      >
                        Enquire About This Service
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-date-100">
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-date-50">
                          <Icon size={64} className="text-date-200" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-padding bg-date-800">
        <div className="container-prose">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="The Babu Commission Shop Advantage"
            center
            light
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              'Direct relationships with Khairpur date farmers',
              'Years of experience in New Khajoor Mandi',
              'Transparent commission-based buying',
              'Quality sorting and grading',
              'Nationwide delivery across Pakistan',
              'Custom and Ramadan packaging options',
              'Fair pricing for farmers and buyers',
              'Export-quality date selection',
              'Personalised service for every customer',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-cream/85">
                <div className="w-6 h-6 rounded-full bg-palm-600/30 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={14} className="text-palm-400" />
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
