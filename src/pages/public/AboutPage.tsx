import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner } from '@/components/States';
import { useAboutContent, useWebsiteSettings } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';
import { SEO } from '@/components/SEO';
import { Sprout, Eye, Target } from 'lucide-react';

export function AboutPage() {
  const { about, loading } = useAboutContent();
  const { settings } = useWebsiteSettings();

  return (
    <PublicLayout
      title="About Us"
      description={about?.business_description ?? settings?.meta_description}
      image={about?.image_1_url || PLACEHOLDER_IMAGES.palmPlantation}
    >
      <PageHeader
        title="About Babu Commission Shop"
        subtitle="A trusted name in Khairpur's date market, connecting farmers and buyers with integrity and quality."
        image={PLACEHOLDER_IMAGES.palmPlantation}
      />

      {loading ? (
        <LoadingSpinner label="Loading about content..." />
      ) : (
        <>
          {/* Company story */}
          <section className="section-padding bg-cream">
            <div className="container-prose grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-date-800 mb-6">Our Story</h2>
                <p className="text-date-600 leading-relaxed whitespace-pre-line">
                  {about?.company_story || 'Our story will be available soon.'}
                </p>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={about?.image_1_url || PLACEHOLDER_IMAGES.datesMarket}
                  alt="Babu Commission Shop at Khairpur market"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Mission, Vision, Description */}
          <section className="section-padding bg-date-50">
            <div className="container-prose">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="card p-8">
                  <div className="w-12 h-12 rounded-xl bg-palm-100 flex items-center justify-center mb-4">
                    <Target size={24} className="text-palm-600" />
                  </div>
                  <h3 className="font-display font-semibold text-date-800 text-lg mb-3">Our Mission</h3>
                  <p className="text-sm text-date-500 leading-relaxed">
                    {about?.mission || 'Our mission will be available soon.'}
                  </p>
                </div>
                <div className="card p-8">
                  <div className="w-12 h-12 rounded-xl bg-palm-100 flex items-center justify-center mb-4">
                    <Eye size={24} className="text-palm-600" />
                  </div>
                  <h3 className="font-display font-semibold text-date-800 text-lg mb-3">Our Vision</h3>
                  <p className="text-sm text-date-500 leading-relaxed">
                    {about?.vision || 'Our vision will be available soon.'}
                  </p>
                </div>
                <div className="card p-8">
                  <div className="w-12 h-12 rounded-xl bg-palm-100 flex items-center justify-center mb-4">
                    <Sprout size={24} className="text-palm-600" />
                  </div>
                  <h3 className="font-display font-semibold text-date-800 text-lg mb-3">What We Do</h3>
                  <p className="text-sm text-date-500 leading-relaxed">
                    {about?.business_description || 'Our description will be available soon.'}
                  </p>
                </div>
              </div>

              {/* Secondary images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={about?.image_2_url || PLACEHOLDER_IMAGES.datesSorting}
                    alt="Date sorting at Khairpur"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={about?.image_3_url || PLACEHOLDER_IMAGES.datesDrying}
                    alt="Dates drying in Khairpur"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="section-padding bg-cream">
            <div className="container-prose text-center max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-date-800 mb-4">
                Find Us in Khairpur
              </h2>
              <p className="text-date-600 leading-relaxed mb-6">
                We are located in {settings?.address ?? 'New Khajoor Mandi, Khairpur, Sindh, Pakistan'} — the heart of Pakistan's date trade. Visit us or get in touch to discuss your requirements.
              </p>
              <p className="text-date-700 font-medium">{settings?.phone}</p>
            </div>
          </section>
        </>
      )}
    </PublicLayout>
  );
}
