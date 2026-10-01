import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Mail, Megaphone, Image as ImageIcon, Wrench,
  TrendingUp, Inbox,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/storage';
import type { ContactMessage } from '@/types/database';

interface Stats {
  products: number;
  services: number;
  unreadMessages: number;
  announcements: number;
  galleryItems: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0, services: 0, unreadMessages: 0,
    announcements: 0, galleryItems: 0,
  });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [products, services, messages, announcements, gallery] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*').eq('is_archived', false).order('created_at', { ascending: false }).limit(5),
          supabase.from('announcements').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
        ]);

        const queryError = [products, services, messages, announcements, gallery].find((result) => result.error)?.error;
        if (queryError) {
          setError(queryError.message);
          return;
        }

        const { count: unreadMessages, error: unreadError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .eq('is_archived', false);
        if (unreadError) {
          setError(unreadError.message);
          return;
        }

        setStats({
          products: products.count ?? 0,
          services: services.count ?? 0,
          unreadMessages: unreadMessages ?? 0,
          announcements: announcements.count ?? 0,
          galleryItems: gallery.count ?? 0,
        });
        setRecentMessages((messages.data ?? []) as ContactMessage[]);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load the admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, link: '/admin/products', color: 'bg-date-100 text-date-700' },
    { label: 'Services', value: stats.services, icon: Wrench, link: '/admin/services', color: 'bg-palm-100 text-palm-700' },
    { label: 'Unread Enquiries', value: stats.unreadMessages, icon: Mail, link: '/admin/enquiries', color: 'bg-amber-100 text-amber-700' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, link: '/admin/announcements', color: 'bg-blue-100 text-blue-700' },
    { label: 'Gallery Images', value: stats.galleryItems, icon: ImageIcon, link: '/admin/gallery', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-3 border-date-600 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div role="alert" className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          Could not load dashboard data: {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat) => (
              <Link
                key={stat.label}
                to={stat.link}
                className="bg-cream rounded-xl p-5 border border-date-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-display font-bold text-date-800">{stat.value}</p>
                <p className="text-sm text-date-500">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Recent enquiries */}
          <div className="bg-cream rounded-xl border border-date-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-date-100">
              <h2 className="font-display font-bold text-date-800 flex items-center gap-2">
                <Inbox size={20} className="text-date-600" />
                Recent Enquiries
              </h2>
              <Link to="/admin/enquiries" className="text-sm text-date-600 hover:text-date-800 font-medium">
                View All
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-date-400 text-sm">No enquiries yet</div>
            ) : (
              <div className="divide-y divide-date-50">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    to="/admin/enquiries"
                    className="flex items-center gap-4 p-4 hover:bg-date-50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${msg.is_read ? 'bg-date-200' : 'bg-palm-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-date-800 truncate">{msg.name}</p>
                        {!msg.is_read && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-palm-100 text-palm-700">New</span>
                        )}
                      </div>
                      <p className="text-sm text-date-400 truncate">
                        {msg.subject || msg.message || 'No subject'}
                      </p>
                    </div>
                    <div className="text-xs text-date-400 shrink-0 hidden sm:block">
                      {formatDateTime(msg.created_at)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/products" className="bg-cream rounded-xl p-5 border border-date-100 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-date-100 text-date-700 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <p className="font-medium text-date-800">Manage Products</p>
                <p className="text-sm text-date-400">Add, edit, or remove date varieties</p>
              </div>
            </Link>
            <Link to="/admin/announcements" className="bg-cream rounded-xl p-5 border border-date-100 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Megaphone size={20} />
              </div>
              <div>
                <p className="font-medium text-date-800">Post Announcement</p>
                <p className="text-sm text-date-400">Share news and updates</p>
              </div>
            </Link>
            <Link to="/admin/settings" className="bg-cream rounded-xl p-5 border border-date-100 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-palm-100 text-palm-700 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="font-medium text-date-800">Update Settings</p>
                <p className="text-sm text-date-400">Business info, contact, and SEO</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
