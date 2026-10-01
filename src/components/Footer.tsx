import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useData';

export function Footer() {
  const { settings } = useWebsiteSettings();
  const businessName = settings?.business_name ?? 'Babu Commission Shop';

  return (
    <footer className="bg-date-900 text-cream/70">
      <div className="container-prose py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={businessName} className="h-10 w-10 object-contain rounded-lg" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-date-600 flex items-center justify-center text-cream font-display font-bold text-lg">
                  B
                </div>
              )}
              <p className="font-display font-bold text-cream text-lg">{businessName}</p>
            </div>
            <p className="text-sm leading-relaxed">
              {settings?.description?.slice(0, 150) ?? ''}
              {(settings?.description?.length ?? 0) > 150 ? '...' : ''}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-palm-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-palm-400 transition-colors">About Us</Link></li>
              <li><Link to="/dates" className="hover:text-palm-400 transition-colors">Date Varieties</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="hover:text-palm-400 transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-palm-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Direct Farmer Sourcing</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Commission-Based Buying</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Bulk Date Supply</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Custom Packaging</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Ramadan Packaging</Link></li>
              <li><Link to="/services" className="hover:text-palm-400 transition-colors">Export-Quality Dates</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-palm-400 mt-0.5 shrink-0" />
                <span>{settings?.address ?? 'New Khajoor Mandi, Khairpur, Sindh, Pakistan'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-palm-400 shrink-0" />
                <a href={`tel:${settings?.phone ?? ''}`} className="hover:text-palm-400 transition-colors">
                  {settings?.phone ?? ''}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-palm-400 shrink-0" />
                <a href={`mailto:${settings?.email ?? ''}`} className="hover:text-palm-400 transition-colors">
                  {settings?.email ?? ''}
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-date-800 hover:bg-palm-600 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={18} className="text-cream" />
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-date-800 hover:bg-palm-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="text-cream" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-date-800 hover:bg-palm-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="text-cream" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-date-800 mt-12 pt-6 text-center text-xs text-cream/50">
          <p>
            {settings?.footer_content ?? `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`}
          </p>
          {settings?.address && (
            <p className="mt-1">{settings.address}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
