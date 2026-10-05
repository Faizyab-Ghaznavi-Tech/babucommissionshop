import { CalendarDays, Megaphone } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { EmptyState, LoadingSpinner } from '@/components/States';
import { useAnnouncements, useWebsiteSettings } from '@/hooks/useData';
import { formatDate } from '@/lib/storage';

export function AnnouncementsPage() {
  const { announcements, loading } = useAnnouncements(true);
  const { settings } = useWebsiteSettings();

  return (
    <PublicLayout
      title="Announcements"
      description="Read the latest published announcements from Babu Commission Shop."
    >
      <PageHeader
        title="Announcements"
        subtitle="News, updates, and notices from Babu Commission Shop."
        eyebrow="From the shop"
        image={settings?.announcements_background_url || undefined}
      />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          {loading ? (
            <LoadingSpinner label="Loading announcements..." />
          ) : announcements.length === 0 ? (
            <EmptyState
              title="No announcements right now"
              message="Please check back for updates from the shop."
              icon={<Megaphone size={42} aria-hidden="true" />}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {announcements.map((announcement) => (
                <article key={announcement.id} className="overflow-hidden rounded-2xl border border-date-200/80 bg-white shadow-sm">
                  {announcement.image_url && (
                    <div className="aspect-[16/9] overflow-hidden bg-date-100">
                      <MediaImage
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="h-full w-full object-cover"
                        fallbackLabel={false}
                      />
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-date-500">
                      <CalendarDays size={15} className="text-sand-700" aria-hidden="true" />
                      <time dateTime={announcement.announcement_date}>{formatDate(announcement.announcement_date)}</time>
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-date-950">
                      {announcement.title}
                    </h2>
                    {announcement.content && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-date-700 sm:text-base">
                        {announcement.content}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
