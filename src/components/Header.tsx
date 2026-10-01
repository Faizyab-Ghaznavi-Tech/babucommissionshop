import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import type { WebsiteSettings } from '@/types/database';
import { Brand } from './Brand';

interface HeaderProps {
  settings: WebsiteSettings | null;
}

const links = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/dates' },
  { label: 'About', to: '/about' },
  { label: 'Our Process', to: '/#process' },
  { label: 'Wholesale', to: '/#wholesale' },
  { label: 'Contact', to: '/contact' },
];

export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-date-950 text-cream shadow-sm">
      <a href="#main-content" className="sr-only z-50 rounded-md bg-white px-4 py-3 text-date-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <div className="container-prose flex min-h-[4.5rem] items-center justify-between gap-4 py-2">
        <Link to="/" aria-label={`${settings?.business_name || 'Babu Commission Shop'} home`} onClick={closeMenu}>
          <Brand businessName={settings?.business_name || 'Babu Commission Shop'} logoUrl={settings?.logo_url} light />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-medium text-cream/80 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link to="/#wholesale" className="rounded-md bg-sand-500 px-4 py-2.5 text-sm font-semibold text-date-950 transition-colors hover:bg-sand-400">
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-cream/20 text-cream hover:bg-cream/10 lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-cream/10 bg-date-950 px-4 pb-4 pt-2 lg:hidden">
          <div className="container-prose flex flex-col">
            {links.map((link) => (
              <Link key={link.label} to={link.to} onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-medium text-cream/85 hover:bg-cream/10 hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link to="/#wholesale" onClick={closeMenu} className="btn-primary mt-2">
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
