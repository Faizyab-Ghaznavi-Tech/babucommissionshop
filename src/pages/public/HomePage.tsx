import { Link } from 'react-router-dom';
import {
  ArrowRight, MapPin, Phone, Sprout, Handshake, Package, Truck,
  Gift, Moon, Ship,
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { LoadingSpinner, EmptyState } from '@/components/States';
import {
  useProducts, useServices, useAnnouncements, useGallery, useWebsiteSettings,
} from '@/hooks/useData';
import { PLACEHOLDER_IMAGES, PRODUCT_IMAGES } from '@/lib/constants';


const iconMap: Record<string, typeof Sprout> = {
  Sprout, Handshake, Package, Truck, Gift, Moon, Ship,
};

export function HomePage() {
  const { products, loading: productsLoading } = useProducts();
  const { services, loading: servicesLoading } = useServices();
  const { announcements } = useAnnouncements(true);
  const { gallery } = useGallery(true);
  const { settings } = useWebsiteSettings();

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);
  const galleryPreview = gallery.slice(0, 6);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={PLACEHOLDER_IMAGES.heroPalm}
            alt="Date palm plantation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-date-900/85 via-date-900/60 to-date-800/30" />
        </div>
        <div className="relative container-prose py-20 md:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream/90 text-sm mb-6">
              <MapPin size={15} className="text-palm-400" />
              <span>New Khajoor Mandi, Khairpur</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-cream leading-tight text-balance">
              Sourcing the Finest Dates from the Heart of Khairpur
            </h1>
            <p className="mt-6 text-lg md:text-xl text-cream/85 leading-relaxed max-w-xl">
              {settings?.description ?? 'Babu Commission Shop connects buyers with premium Khairpur dates through direct farmer sourcing, commission-based buying, and bulk supply — with custom packaging for retailers and wholesalers.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/dates" className="btn-primary text-base">
                Explore Date Varieties
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-secondary text-base border-cream/30 text-cream hover:bg-cream hover:text-date-800">
                Make an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-date-800 py-6">
        <div className="container-prose">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-cream/70 text-sm">
            <span className="flex items-center gap-2"><Sprout size={16} className="text-palm-400" /> Direct Farmer Sourcing</span>
            <span className="hidden md:inline text-date-700">|</span>
            <span className="flex items-center gap-2"><Handshake size={16} className="text-palm-400" /> Commission-Based Buying</span>
            <span className="hidden md:inline text-date-700">|</span>
            <span className="flex items-center gap-2"><Package size={16} className="text-palm-400" /> Bulk Supply</span>
            <span className="hidden md:inline text-date-700">|</span>
            <span className="flex items-center gap-2"><Truck size={16} className="text-palm-400" /> Nationwide Delivery</span>
          </div>
        </div>
      </section>

      {/* Business intro */}
      <section className="section-padding bg-cream">
        <div className="container-prose grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionTitle
              eyebrow="Who We Are"
              title="Your Trusted Partner in Khairpur's Date Market"
            />
            <p className="text-date-600 leading-relaxed mb-4">
              Babu Commission Shop operates from New Khajoor Mandi, Khairpur — one of Pakistan's most renowned date markets. We serve as a vital link between date farmers and buyers, offering sourcing, commission, and supply services built on years of market experience.
            </p>
            <p className="text-date-600 leading-relaxed mb-6">
              From the prized Aseel to the soft Dhakki, we handle the full range of Khairpur date varieties. Whether you need a few maunds or container loads, we ensure consistent quality, fair pricing, and reliable delivery.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-date-700 font-medium hover:text-date-900 transition-colors">
              Learn More About Us
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={PLACEHOLDER_IMAGES.datesCrate}
                alt="Fresh dates at Khairpur market"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-cream hidden md:block">
              <img
                src={PLACEHOLDER_IMAGES.palmHarvest}
                alt="Date palm harvest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Khairpur story */}
      <section className="section-padding bg-date-50">
        <div className="container-prose grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={PLACEHOLDER_IMAGES.palmPlantation}
                alt="Date palm plantation in Khairpur"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <SectionTitle
              eyebrow="The Khairpur Legacy"
              title="A Region Renowned for Premium Dates"
            />
            <p className="text-date-600 leading-relaxed mb-4">
              Khairpur, in upper Sindh, is one of Pakistan's most important date-growing regions. The district's hot, arid climate and fertile soil create ideal conditions for date cultivation, producing varieties prized across the country and beyond.
            </p>
            <p className="text-date-600 leading-relaxed mb-4">
              New Khajoor Mandi — the central date market — is where farmers bring their harvest and buyers come to source. It's a place of tradition, trust, and commerce, and it's where Babu Commission Shop has built its reputation.
            </p>
            <p className="text-date-600 leading-relaxed">
              We work directly with farmers across the region, ensuring the dates we source are authentic, fresh, and of the highest quality — from tree to market to your hands.
            </p>
          </div>
        </div>
      </section>

      {/* Date varieties */}
      <section className="section-padding bg-cream">
        <div className="container-prose">
          <SectionTitle
            eyebrow="Our Dates"
            title="Premium Date Varieties from Khairpur"
            subtitle="From the prized Aseel to the soft Dhakki, explore the finest date varieties the Khairpur region has to offer."
            center
          />
          {productsLoading ? (
            <LoadingSpinner label="Loading date varieties..." />
          ) : displayProducts.length === 0 ? (
            <EmptyState title="No products available" message="Please check back soon for our date varieties." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/dates/${product.slug}`}
                  className="card overflow-hidden group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-date-100">
                    <img
                      src={product.image_url || PRODUCT_IMAGES[product.slug] || PLACEHOLDER_IMAGES.datesBowl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    {product.category && (
                      <span className="text-xs font-medium text-palm-600 uppercase tracking-wider">{product.category}</span>
                    )}
                    <h3 className="mt-1 font-display font-semibold text-date-800 text-lg group-hover:text-date-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-date-500 line-clamp-2">{product.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-date-700 font-medium">
                      View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/dates" className="btn-secondary">
              View All Varieties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-date-800">
        <div className="container-prose">
          <SectionTitle
            eyebrow="What We Offer"
            title="Our Services & Solutions"
            subtitle="From direct farmer sourcing to custom Ramadan packaging, we provide end-to-end date sourcing solutions."
            center
            light
          />
          {servicesLoading ? (
            <LoadingSpinner label="Loading services..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => {
                const Icon = iconMap[service.icon_name] ?? Package;
                return (
                  <div key={service.id} className="bg-date-750 rounded-xl p-6 border border-date-700 hover:border-palm-500 transition-colors group" style={{ backgroundColor: 'rgba(90, 63, 40, 0.4)' }}>
                    <div className="w-12 h-12 rounded-lg bg-palm-600/20 flex items-center justify-center mb-4 group-hover:bg-palm-600/30 transition-colors">
                      <Icon size={24} className="text-palm-400" />
                    </div>
                    <h3 className="font-display font-semibold text-cream text-lg mb-2">{service.name}</h3>
                    <p className="text-sm text-cream/70 leading-relaxed line-clamp-3">{service.description}</p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/services" className="btn-secondary border-cream/30 text-cream hover:bg-cream hover:text-date-800">
              Explore All Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom packaging */}
      <section className="section-padding bg-cream">
        <div className="container-prose">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={PLACEHOLDER_IMAGES.datesBags}
                  alt="Custom date packaging"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <SectionTitle
                eyebrow="Custom Packaging"
                title="Brand Your Dates with Custom Packaging"
              />
              <p className="text-date-600 leading-relaxed mb-6">
                Stand out with custom-branded date packaging. Whether you're a retailer, corporate buyer, or preparing for Ramadan, we offer personalised packaging with your logo and branding — tailored to your specifications.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Custom-branded boxes and bags with your logo',
                  'Ramadan special packaging for gifting',
                  'Corporate gift packages',
                  'Retail-ready packaging in various sizes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-date-700">
                    <span className="w-5 h-5 rounded-full bg-palm-100 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-palm-600" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary">
                Enquire About Packaging
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing/process */}
      <section className="section-padding bg-date-50">
        <div className="container-prose">
          <SectionTitle
            eyebrow="Our Process"
            title="From Farm to Your Doorstep"
            subtitle="A transparent, quality-driven process that ensures you receive the finest dates."
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Sprout, title: 'Source', desc: 'We work directly with farmers across Khairpur to source dates at peak ripeness.' },
              { icon: Package, title: 'Select & Grade', desc: 'Each batch is carefully sorted and graded to meet quality standards.' },
              { icon: Gift, title: 'Package', desc: 'Custom packaging options tailored to your brand and requirements.' },
              { icon: Truck, title: 'Deliver', desc: 'Nationwide delivery ensures your order arrives on time and in excellent condition.' },
            ].map((step, i) => (
              <div key={step.title} className="relative">
                <div className="card p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-palm-100 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={26} className="text-palm-600" />
                  </div>
                  <div className="absolute top-6 right-6 text-3xl font-display font-bold text-date-100">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-date-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-date-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-prose">
            <SectionTitle
              eyebrow="Gallery"
              title="A Glimpse of Our World"
              center
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPreview.map((item) => (
                <div key={item.id} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/gallery" className="btn-secondary">
                View Full Gallery
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="section-padding bg-date-50">
          <div className="container-prose">
            <SectionTitle
              eyebrow="Latest News"
              title="Announcements"
              center
            />
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="card overflow-hidden">
                  {ann.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-palm-600 font-medium uppercase tracking-wider mb-2">
                      {new Date(ann.announcement_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="font-display font-semibold text-date-800 text-lg mb-2">{ann.title}</h3>
                    <p className="text-sm text-date-500 leading-relaxed line-clamp-3">{ann.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-palm-700">
        <div className="container-prose text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mb-4 text-balance">
            Ready to Source Premium Khairpur Dates?
          </h2>
          <p className="text-cream/80 max-w-2xl mx-auto mb-8 text-lg">
            Get in touch with us to discuss your date requirements — whether it's a specific variety, bulk supply, or custom packaging.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-cream text-palm-700 px-8 py-4 rounded-lg font-medium text-base hover:bg-white transition-colors active:scale-[0.98]">
            Make a Business Enquiry
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Contact section */}
      <section className="section-padding bg-cream">
        <div className="container-prose">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-date-100 flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-date-700" />
              </div>
              <h3 className="font-display font-semibold text-date-800 mb-2">Visit Us</h3>
              <p className="text-sm text-date-500">{settings?.address ?? 'New Khajoor Mandi, Khairpur, Sindh, Pakistan'}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-date-100 flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-date-700" />
              </div>
              <h3 className="font-display font-semibold text-date-800 mb-2">Call Us</h3>
              <p className="text-sm text-date-500">{settings?.phone ?? ''}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-date-100 flex items-center justify-center mx-auto mb-4">
                <Gift size={24} className="text-date-700" />
              </div>
              <h3 className="font-display font-semibold text-date-800 mb-2">Our Services</h3>
              <p className="text-sm text-date-500">Sourcing, Commission, Bulk Supply, Custom Packaging</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
