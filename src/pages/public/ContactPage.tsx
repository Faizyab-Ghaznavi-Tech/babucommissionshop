import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EnquiryForm } from '@/components/EnquiryForm';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { useProducts, useServices, useWebsiteSettings } from '@/hooks/useData';
import { getTelHref, getWhatsAppUrl } from '@/lib/contact';
import { sanitizePublicSettings } from '@/lib/siteContent';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const { services } = useServices();
  const { settings: rawSettings } = useWebsiteSettings();
  const settings = sanitizePublicSettings(rawSettings);
  const product = products.find((item) => item.slug === searchParams.get('product'));
  const service = services.find((item) => item.name === searchParams.get('service'));
  const phoneHref = getTelHref(settings?.phone);
  const whatsappHref = getWhatsAppUrl(settings?.whatsapp);

  return (
    <PublicLayout
      title="Contact Babu Commission Shop"
      description="Ask Babu Commission Shop about Khairpur dates, sourcing, bulk supply, and packaging. Send an enquiry or request a quote."
    >
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk dates"
        subtitle="Tell us what you’re looking for. We’ll use your details to respond to your enquiry."
      />

      <section className="section-padding bg-cream">
        <div className="container-prose grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <aside className="space-y-5" aria-label="Contact details">
            {settings?.address && <div className="contact-card">
              <span className="contact-icon"><MapPin size={20} aria-hidden="true" /></span>
              <div>
                <h2 className="font-display text-lg font-semibold text-date-950">Visit us</h2>
                <p className="mt-1 text-sm leading-6 text-date-700">
                  {settings.address}
                </p>
              </div>
            </div>}

            {phoneHref && settings?.phone && (
              <div className="contact-card">
                <span className="contact-icon"><Phone size={20} aria-hidden="true" /></span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-date-950">Call us</h2>
                  <a href={phoneHref} className="mt-1 inline-block text-sm text-date-700 underline decoration-date-300 underline-offset-4 hover:text-date-950">
                    {settings.phone}
                  </a>
                </div>
              </div>
            )}

            {settings?.email && (
              <div className="contact-card">
                <span className="contact-icon"><Mail size={20} aria-hidden="true" /></span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold text-date-950">Email</h2>
                  <a href={`mailto:${settings.email}`} className="mt-1 inline-block break-all text-sm text-date-700 underline decoration-date-300 underline-offset-4 hover:text-date-950">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="contact-card group border-palm-200 bg-palm-50 hover:border-palm-500">
                <span className="contact-icon bg-palm-100 text-palm-800"><MessageCircle size={20} aria-hidden="true" /></span>
                <span>
                  <span className="block font-display text-lg font-semibold text-date-950">WhatsApp</span>
                  <span className="mt-1 flex items-center gap-1 text-sm text-date-700 group-hover:text-date-950">
                    Start a conversation <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </span>
              </a>
            )}

            <p className="rounded-md border-l-2 border-date-300 bg-date-50 px-4 py-3 text-sm leading-6 text-date-700">
              Looking for a particular variety? Browse the current product list and include it in your enquiry.
              <Link to="/dates" className="ml-1 inline-flex items-center gap-1 font-semibold text-date-950 underline decoration-date-300 underline-offset-4">
                View products <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </p>
          </aside>

          <div id="enquiry-form" className="scroll-mt-28 rounded-lg border border-date-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="eyebrow">Enquiry form</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-date-950 sm:text-3xl">How can we help?</h2>
              <p className="mt-2 text-sm leading-6 text-date-700">Share a few details and the team can follow up about your requirements.</p>
            </div>
            <EnquiryForm products={products} services={services} initialProduct={product} initialService={service} />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
