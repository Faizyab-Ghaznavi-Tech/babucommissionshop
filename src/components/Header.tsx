import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/dates', label: 'Dates' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { settings } = useWebsiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const businessName = settings?.business_name ?? 'Babu Commission Shop';
  const logoUrl = settings?.logo_url;

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-date-900 text-cream/80 text-xs">
        <div className="container-prose flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-palm-400" />
            <span>{settings?.address_short ?? 'New Khajoor Mandi, Khairpur'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-palm-400" />
            <span>{settings?.phone ?? ''}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-md'
            : 'bg-cream'
        }`}
      >
        <div className="container-prose">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg" />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-date-700 flex items-center justify-center text-cream font-display font-bold text-lg">
                  B
                </div>
              )}
              <div className="hidden sm:block">
                <p className="font-display font-bold text-date-800 text-lg leading-tight group-hover:text-date-600 transition-colors">
                  {businessName}
                </p>
                <p className="text-xs text-date-400 leading-tight">Khairpur Dates</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-date-800 bg-date-100'
                        : 'text-date-600 hover:text-date-800 hover:bg-date-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-primary ml-2 text-sm py-2.5">
                Get In Touch
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-date-700 hover:bg-date-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-date-100 bg-cream animate-fade-in">
            <div className="container-prose py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-date-800 bg-date-100'
                        : 'text-date-600 hover:text-date-800 hover:bg-date-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-primary mt-2 justify-center">
                Get In Touch
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
