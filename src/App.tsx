import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/States';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/auth';
import { WebsiteSettingsProvider } from '@/hooks/useData';

// Public pages
import { HomePage } from '@/pages/public/HomePage';
import { AnnouncementsPage } from '@/pages/public/AnnouncementsPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { DatesPage } from '@/pages/public/DatesPage';
import { ProductDetailPage } from '@/pages/public/ProductDetailPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { GalleryPage } from '@/pages/public/GalleryPage';
import { ContactPage } from '@/pages/public/ContactPage';

// Admin pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage';
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage';
import { AdminAnnouncementsPage } from '@/pages/admin/AdminAnnouncementsPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';
import { AdminAboutPage } from '@/pages/admin/AdminAboutPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdminEmail(session.user.email)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
        <section className="w-full max-w-lg rounded-md border border-date-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-date-950">Admin access is restricted</h1>
          <p className="mt-3 text-sm leading-6 text-date-700">This account is not authorized to manage this site. Sign out and use the designated admin account.</p>
          <button type="button" onClick={() => void signOut()} className="btn-primary mt-6">Sign out</button>
          <p className="mt-4"><Link to="/" className="text-sm font-medium text-date-800 underline">Return to the website</Link></p>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dates" element={<DatesPage />} />
      <Route path="/dates/:slug" element={<ProductDetailPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><AdminServicesPage /></ProtectedRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedRoute><AdminEnquiriesPage /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute><AdminAnnouncementsPage /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGalleryPage /></ProtectedRoute>} />
      <Route path="/admin/media" element={<ProtectedRoute><AdminMediaPage /></ProtectedRoute>} />
      <Route path="/admin/about" element={<ProtectedRoute><AdminAboutPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-cream px-4 py-16 text-date-900">
        <section className="mx-auto max-w-2xl rounded-2xl border border-date-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-date-500">
            Local setup required
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Connect your Supabase project</h1>
          <p className="mt-4 leading-7 text-date-700">
            The app is running, but its Supabase credentials are missing. Copy <code>.env.example</code> to <code>.env.local</code>,
            then add your project URL and anon key.
          </p>
          <p className="mt-4 leading-7 text-date-700">
            You can find both values in your Supabase project under <strong>Project Settings → API</strong>.
            Restart the dev server after saving the file.
          </p>
        </section>
      </main>
    );
  }

  return (
    <AuthProvider>
      <WebsiteSettingsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WebsiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
