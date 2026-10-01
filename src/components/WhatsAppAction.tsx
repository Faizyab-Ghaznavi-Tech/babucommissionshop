import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/contact';

interface WhatsAppActionProps {
  number?: string;
  className?: string;
  floating?: boolean;
}

export function WhatsAppAction({ number, className = '', floating = false }: WhatsAppActionProps) {
  const href = getWhatsAppUrl(number);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Babu Commission Shop on WhatsApp (opens in a new tab)"
      className={`${floating ? 'whatsapp-float' : ''} ${className}`}
    >
      <MessageCircle size={floating ? 23 : 18} aria-hidden="true" />
      {!floating && <span>WhatsApp</span>}
      {floating && <span className="sr-only">WhatsApp</span>}
    </a>
  );
}
