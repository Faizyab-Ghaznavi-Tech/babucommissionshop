import { ArrowRight, BadgeCheck, Eye, MapPin, Sprout, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaImage } from '@/components/MediaImage';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner } from '@/components/States';
import { useAboutContent, useWebsiteSettings } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';
import { sanitizeAboutContent, sanitizePublicSettings } from '@/lib/siteContent';

export function AboutPage() {
  const { about: rawAbout, loading, error } = useAboutContent();
  const { settings: rawSettings } = useWebsiteSettings();
  const about = sanitizeAboutContent(rawAbout);
  const settings = sanitizePublicSettings(rawSettings);
  const images = [about?.image_1_url, about?.image_2_url, about?.image_3_url]
    .filter((url): url is string => !!url?.trim());

  return (
    <PublicLayout
      title="About Us"
      description={about?.business_description || settings?.meta_description || 'Learn about Babu Commission Shop and browse date varieties listed from Khairpur.'}
      image={about?.image_1_url || PLACEHOLDER_IMAGES.palmPlantation}
    >
      <PageHeader eyebrow="About" title={`About ${settings?.business_name || 'Babu Commission Shop'}`} subtitle="A place to explore date varieties and discuss your requirements." />
      {loading ? <LoadingSpinner label="Loading about content..." /> : (
        <>
          {error && <div role="status" className="container-prose mt-6 rounded-md border border-date-200 bg-date-50 p-4 text-sm text-date-700">Some shop details could not be loaded. Showing general information instead.</div>}

          <section className="section-padding bg-cream">
            <div className="container-prose grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p className="eyebrow">Khairpur, Sindh</p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-date-950 sm:text-4xl">A starting point for your date sourcing enquiry.</h2>
                <p className="mt-5 whitespace-pre-line leading-7 text-date-700">
                  {about?.company_story || 'Babu Commission Shop shares a catalog of date varieties associated with Khairpur. Use the listings as a starting point, then contact the shop to confirm current availability, grade, quantity, and terms.'}
                </p>
                {settings?.address && <p className="mt-5 inline-flex items-start gap-2 text-sm text-date-700"><MapPin size={17} className="mt-0.5 shrink-0 text-palm-800" aria-hidden="true" />{settings.address}</p>}
                <Link to="/contact" className="btn-primary mt-7">Talk with the shop <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-md border border-date-200 bg-date-100 shadow-sm">
                <MediaImage src={images[0] || PLACEHOLDER_IMAGES.palmPlantation} alt={images[0] ? 'Image provided by Babu Commission Shop' : 'Representative date palm image'} className="h-full w-full object-cover" />
              </div>
            </div>
          </section>

          <section className="section-padding bg-white">
            <div className="container-prose">
              <div className="mx-auto mb-9 max-w-2xl text-center">
                <p className="eyebrow">How we help you get started</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-date-950">Clear details, discussed directly.</h2>
                <p className="mt-3 leading-7 text-date-700">Use these steps to make an enquiry and confirm the details that matter before ordering.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { Icon: Sprout, title: 'Explore varieties', text: 'Browse the date listings and choose what you would like to ask about.' },
                  { Icon: Target, title: 'Share your needs', text: 'Tell the shop the variety, approximate quantity, and any requirements.' },
                  { Icon: BadgeCheck, title: 'Confirm before ordering', text: 'Discuss current availability, grade, price, and terms directly.' },
                ].map(({ Icon, title, text }, index) => (
                  <article key={title} className="rounded-md border border-date-200 bg-date-50 p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-palm-800 ring-1 ring-date-200"><Icon size={23} aria-hidden="true" /></span>
                      <span className="font-display text-3xl font-semibold text-date-200">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-date-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-date-700">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {images.length > 1 && (
            <section className="section-padding bg-date-50">
              <div className="container-prose">
                <h2 className="mb-6 font-display text-2xl font-semibold text-date-950">Images from the shop</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.slice(1).map((url, index) => (
                    <div key={url} className="aspect-[4/3] overflow-hidden rounded-md border border-date-200 bg-date-100">
                      <MediaImage src={url} alt={`Shop image ${index + 2}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {(about?.mission || about?.vision || about?.business_description) && (
            <section className="section-padding bg-cream">
              <div className="container-prose grid gap-5 md:grid-cols-2">
                {about.mission && <article className="rounded-md border border-date-200 bg-white p-6"><Target size={22} className="text-palm-800" aria-hidden="true" /><h2 className="mt-4 font-display text-xl font-semibold text-date-950">Our Mission</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-date-700">{about.mission}</p></article>}
                {about.vision && <article className="rounded-md border border-date-200 bg-white p-6"><Eye size={22} className="text-palm-800" aria-hidden="true" /><h2 className="mt-4 font-display text-xl font-semibold text-date-950">Our Vision</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-date-700">{about.vision}</p></article>}
                {about.business_description && <article className="rounded-md border border-date-200 bg-white p-6 md:col-span-2"><Sprout size={22} className="text-palm-800" aria-hidden="true" /><h2 className="mt-4 font-display text-xl font-semibold text-date-950">What We Do</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-date-700">{about.business_description}</p></article>}
              </div>
            </section>
          )}
        </>
      )}
    </PublicLayout>
  );
}
