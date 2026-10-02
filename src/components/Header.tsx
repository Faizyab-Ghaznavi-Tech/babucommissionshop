import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import type { WebsiteSettings } from '@/types/database';
import { getShopWhatsAppUrl } from '@/lib/contact';
import { Brand } from './Brand';

interface HeaderProps {
  settings: WebsiteSettings | null;
}

const links = [
  { label: 'Home', to: '/', match: (path: string) => path === '/' },
  { label: 'Products', to: '/dates', match: (path: string) => path.startsWith('/dates') },
  { label: 'Services', to: '/services', match: (path: string) => path.startsWith('/services') },
  { label: 'Announcements', to: '/announcements', match: (path: string) => path.startsWith('/announcements') },
  { label: 'About', to: '/about', match: (path: string) => path.startsWith('/about') },
];

export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const whatsappUrl = getShopWhatsAppUrl(settings?.whatsapp);
  const closeMenu = () => setMenuOpen(false);
  const showDarkSurface = menuOpen || location.pathname !== '/' || isScrolled;

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 32);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) closeMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuOpen]);

  const whatsappAction = (className: string) => whatsappUrl ? (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={className}>
      <MessageCircle size={16} aria-hidden="true" />
      <span>WhatsApp Us</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link to="/contact" onClick={closeMenu} className={className}>
      <MessageCircle size={16} aria-hidden="true" />
      <span>WhatsApp Us</span>
      <span className="sr-only"> (open contact options)</span>
    </Link>
  );

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-50 px-4 text-cream sm:px-7 lg:top-6 lg:px-8">
      <a href="#main-content" className="sr-only z-50 rounded-xl bg-white px-4 py-3 text-date-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <div className={`mx-auto w-full max-w-[1640px] px-1.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 sm:px-3 lg:px-0 ${showDarkSurface ? 'rounded-2xl border border-white/15 bg-date-900/80 shadow-[0_16px_44px_rgba(17,10,6,0.3)] backdrop-blur-xl' : 'border border-transparent bg-transparent shadow-none backdrop-blur-0'}`}>
        <div className="relative z-10 flex min-h-[4.15rem] items-center justify-between gap-2 md:min-h-[4.5rem]">
          <Link to="/" aria-label={`${settings?.business_name || 'Babu Commission Shop'} home`} onClick={closeMenu} className="shrink-0 rounded-xl">
            <Brand businessName={settings?.business_name || 'Babu Commission Shop'} logoUrl={settings?.logo_url} light navbar />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-4 lg:flex xl:gap-7">
            {links.map((link) => {
              const active = link.match(location.pathname);
              const linkClass = `relative rounded-none px-1.5 py-3 text-[0.82rem] font-medium tracking-[0.01em] transition-colors duration-200 after:absolute after:inset-x-1.5 after:bottom-1 after:h-px after:origin-left after:bg-sand-300 after:transition-transform after:duration-200 xl:px-2 xl:text-sm ${active ? 'text-sand-200 after:scale-x-100' : 'text-cream/85 after:scale-x-0 hover:text-white hover:after:scale-x-100'}`;

              return (
                <Link key={link.label} to={link.to} aria-current={active ? 'page' : undefined} className={linkClass}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <Link to="/#wholesale" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-sand-200 px-4 text-[0.82rem] font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-colors duration-200 hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-date-950 xl:px-5 xl:text-sm">
              Get a Quote <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            {whatsappAction('inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-50/70 bg-emerald-100/80 px-4 text-[0.82rem] font-semibold text-emerald-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-sm transition-colors duration-200 hover:border-emerald-50 hover:bg-emerald-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-date-950 xl:px-5 xl:text-sm')}
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Link to="/#wholesale" onClick={closeMenu} className="inline-flex min-h-10 items-center justify-center rounded-full bg-sand-200 px-3 text-[0.74rem] font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-colors duration-200 hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-300 sm:px-3.5 sm:text-sm">
              <span className="sm:hidden">Quote</span>
              <span className="hidden sm:inline">Get a Quote</span>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-cream transition-colors duration-200 hover:bg-white/[0.08]"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="relative z-10 max-h-[calc(100dvh-6rem)] animate-[fadeInUp_180ms_ease-out] overflow-y-auto border-t border-white/10 pb-4 pt-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active = link.match(location.pathname);
                const linkClass = `flex min-h-11 items-center rounded-xl px-3.5 text-sm font-medium transition-colors duration-200 ${active ? 'bg-cream text-date-950' : 'text-cream/85 hover:bg-white/[0.08] hover:text-white'}`;
                return (
                  <Link key={link.label} to={link.to} onClick={closeMenu} aria-current={active ? 'page' : undefined} className={linkClass}>
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-2">
                <Link to="/#wholesale" onClick={closeMenu} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sand-200 px-4 text-sm font-semibold text-date-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-colors duration-200 hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-300">
                  Get a Quote <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                {whatsappAction('inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-50/70 bg-emerald-100/80 px-4 text-sm font-semibold text-emerald-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-sm transition-colors duration-200 hover:border-emerald-50 hover:bg-emerald-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200')}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
