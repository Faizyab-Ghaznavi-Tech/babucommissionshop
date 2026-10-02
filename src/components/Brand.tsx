import { Palmtree } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BrandProps {
  businessName: string;
  logoUrl?: string | null;
  light?: boolean;
  compact?: boolean;
  navbar?: boolean;
}

export function Brand({ businessName, logoUrl, light = false, compact = false, navbar = false }: BrandProps) {
  const textColor = light ? 'text-cream' : 'text-date-950';
  const [logoFailed, setLogoFailed] = useState(false);
  const isBabuBrand = !businessName || businessName.trim().toLocaleLowerCase() === 'babu commission shop';

  useEffect(() => setLogoFailed(false), [logoUrl]);

  const markClass = navbar
    ? 'flex h-10 w-10 shrink-0 items-center justify-center sm:h-14 sm:w-14'
    : 'flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11';

  return (
    <span className={`inline-flex items-center ${navbar ? 'gap-2 sm:gap-3' : 'gap-2.5'}`}>
      {logoUrl && !logoFailed ? (
        <span className={markClass}>
          <img
            src={logoUrl}
            alt={navbar ? `${businessName} logo` : ''}
            width="44"
            height="44"
            onError={() => setLogoFailed(true)}
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        <span className={`${markClass} ${navbar ? 'text-sand-700' : 'text-sand-400'}`} aria-hidden="true">
          <Palmtree size={navbar ? 34 : 38} strokeWidth={1.5} className={navbar ? 'sm:h-12 sm:w-12' : undefined} />
        </span>
      )}
      {navbar && <span aria-hidden="true" className="h-8 w-px shrink-0 bg-sand-300/55 sm:h-12" />}
      <span className={`min-w-0 ${textColor} ${navbar ? 'flex flex-col items-start text-left' : ''}`}>
        {isBabuBrand ? (
          <>
            <span className={`block whitespace-nowrap font-display font-bold uppercase leading-none tracking-[0.1em] ${navbar ? 'text-[1.75rem] sm:text-[2.5rem]' : 'text-lg sm:text-xl'}`}>Babu</span>
            <span className={`mt-1 block whitespace-nowrap text-left font-bold uppercase leading-none opacity-90 ${navbar ? 'text-[0.52rem] tracking-[0.11em] text-sand-300 sm:text-[0.68rem] sm:tracking-[0.16em]' : 'text-[0.55rem] tracking-[0.16em]'}`}>Commission Shop</span>
          </>
        ) : (
          <>
            <span className={`block truncate font-display font-semibold leading-tight ${navbar ? 'max-w-[8.5rem] text-sm sm:max-w-none sm:text-lg' : 'text-[1.05rem] sm:text-lg'}`}>{businessName}</span>
            {!compact && <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.19em] opacity-75">Khairpur, Sindh</span>}
          </>
        )}
      </span>
    </span>
  );
}
