import { Eye, MapPin, Sprout, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner } from '@/components/States';
import { useAboutContent, useWebsiteSettings } from '@/hooks/useData';
import { sanitizeAboutContent, sanitizePublicSettings } from '@/lib/siteContent';

export function AboutPage() {
  const { about: rawAbout, loading } = useAboutContent();
  const { settings: rawSettings } = useWebsiteSettings();
  const about = sanitizeAboutContent(rawAbout);
  const settings = sanitizePublicSettings(rawSettings);
  const items = [
    { title: 'Our Mission', text: about?.mission, Icon: Target },
    { title: 'Our Vision', text: about?.vision, Icon: Eye },
    { title: 'What We Do', text: about?.business_description, Icon: Sprout },
  ].filter((item) => item.text?.trim());
  const images = [about?.image_1_url, about?.image_2_url, about?.image_3_url].filter((url): url is string => !!url?.trim());
  const additionalImages = about?.company_story ? images.slice(1) : images;

  return (
    <PublicLayout title="About Us" description={about?.business_description || settings?.meta_description} image={about?.image_1_url || undefined}>
      <PageHeader eyebrow="About" title={`About ${settings?.business_name || 'Babu Commission Shop'}`} subtitle="Learn about the shop and its work with Khairpur dates." />
      {loading ? <LoadingSpinner label="Loading about content..." /> : (
        <>
          {about?.company_story && <section className="section-padding bg-cream"><div className="container-prose grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div><h2 className="font-display text-3xl font-semibold text-date-950">Our Story</h2><p className="mt-5 whitespace-pre-line leading-7 text-date-700">{about.company_story}</p></div>
            {images[0] && <div className="aspect-[4/3] overflow-hidden rounded-md bg-date-100"><img src={images[0]} alt="Image provided by Babu Commission Shop" width="940" height="705" loading="lazy" className="h-full w-full object-cover" /></div>}
          </div></section>}

          {items.length > 0 && <section className="section-padding bg-date-50"><div className="container-prose">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map(({ title, text, Icon }) => <article key={title} className="rounded-md border border-date-200 bg-white p-6 sm:p-8">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-date-100 text-date-900"><Icon size={24} aria-hidden="true" /></span>
                <h2 className="font-display text-xl font-semibold text-date-950">{title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-date-700">{text}</p>
              </article>)}
            </div>
            {additionalImages.length > 0 && <div className="mt-8 grid gap-4 sm:grid-cols-2">{additionalImages.map((url, index) => <div key={url} className="aspect-[4/3] overflow-hidden rounded-md bg-date-100"><img src={url} alt={`Image ${index + 1} provided by Babu Commission Shop`} width="940" height="705" loading="lazy" className="h-full w-full object-cover" /></div>)}</div>}
          </div></section>}

          {!about?.company_story && items.length === 0 && images.length > 0 && <section className="section-padding bg-date-50"><div className="container-prose"><h2 className="mb-6 font-display text-2xl font-semibold text-date-950">Images from the shop</h2><div className="grid gap-4 sm:grid-cols-2">{images.map((url, index) => <div key={url} className="aspect-[4/3] overflow-hidden rounded-md bg-date-100"><img src={url} alt={`Image ${index + 1} provided by Babu Commission Shop`} width="940" height="705" loading="lazy" className="h-full w-full object-cover" /></div>)}</div></div></section>}

          {settings?.address && <section className="section-padding bg-cream"><div className="container-prose mx-auto max-w-2xl text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-date-100 text-date-900"><MapPin size={23} aria-hidden="true" /></span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-date-950">Location</h2>
            <p className="mt-3 leading-7 text-date-700">{settings.address}</p>
            <Link to="/contact" className="btn-primary mt-6">Contact the shop</Link>
          </div></section>}

          {!about?.company_story && items.length === 0 && images.length === 0 && <section className="section-padding bg-cream"><div className="container-prose mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold text-date-950">Shop information</h2>
            <p className="mt-3 leading-7 text-date-700">More information will be added here. Contact the shop to discuss your date sourcing enquiry.</p>
            <Link to="/contact" className="btn-primary mt-6">Contact the shop</Link>
          </div></section>}
        </>
      )}
    </PublicLayout>
  );
}
