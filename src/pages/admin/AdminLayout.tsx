import { type ReactNode, useState } from 'react';
import { NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, Mail, Megaphone,
  Image, Settings, LogOut, Menu, X, FileText, FolderOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SEO } from '@/components/SEO';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/media', label: 'Media Library', icon: FolderOpen },
  { to: '/admin/about', label: 'About Content', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-date-50">
        <div className="animate-spin w-8 h-8 border-3 border-date-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <>
      <SEO title={`${title} | Admin`} noIndex />
      <div className="min-h-screen bg-date-50 flex">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex w-64 bg-date-900 text-cream/70 flex-col fixed inset-y-0 left-0 z-30">
          <div className="p-5 border-b border-date-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-date-600 flex items-center justify-center text-cream font-display font-bold text-lg">
                B
              </div>
              <div>
                <p className="font-display font-bold text-cream text-sm">Babu Commission</p>
                <p className="text-xs text-cream/50">Admin Panel</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-date-700 text-cream'
                      : 'text-cream/60 hover:text-cream hover:bg-date-800'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-date-800">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cream/60 hover:text-cream hover:bg-date-800 transition-colors w-full"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-64 bg-date-900 text-cream/70 flex flex-col animate-slide-in">
              <div className="p-5 border-b border-date-800 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 rounded-lg bg-date-600 flex items-center justify-center text-cream font-display font-bold text-lg">
                    B
                  </div>
                  <div>
                    <p className="font-display font-bold text-cream text-sm">Babu Commission</p>
                    <p className="text-xs text-cream/50">Admin Panel</p>
                  </div>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-cream/60">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-date-700 text-cream'
                          : 'text-cream/60 hover:text-cream hover:bg-date-800'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-date-800">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cream/60 hover:text-cream hover:bg-date-800 transition-colors w-full"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="bg-cream border-b border-date-100 sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-2 rounded-lg text-date-700 hover:bg-date-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={22} />
                </button>
                <h1 className="text-lg font-display font-bold text-date-800">{title}</h1>
              </div>
              <Link
                to="/"
                target="_blank"
                className="text-sm text-date-500 hover:text-date-700 transition-colors flex items-center gap-1.5"
              >
                View Website
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
