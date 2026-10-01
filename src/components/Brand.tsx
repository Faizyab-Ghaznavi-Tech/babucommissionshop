import { Palmtree } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BrandProps {
  businessName: string;
  logoUrl?: string | null;
  light?: boolean;
  compact?: boolean;
}

export function Brand({ businessName, logoUrl, light = false, compact = false }: BrandProps) {
  const textColor = light ? 'text-cream' : 'text-date-950';
  const [logoFailed, setLogoFailed] = useState(false);
  const isBabuBrand = !businessName || businessName.trim().toLocaleLowerCase() === 'babu commission shop';

  useEffect(() => setLogoFailed(false), [logoUrl]);

  return (
    <span className="inline-flex items-center gap-2.5">
      {logoUrl && !logoFailed ? (
        <img
          src={logoUrl}
          alt=""
          width="44"
          height="44"
          onError={() => setLogoFailed(true)}
          className="h-10 w-10 shrink-0 rounded-sm object-contain sm:h-11 sm:w-11"
        />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sand-400 sm:h-11 sm:w-11" aria-hidden="true">
          <Palmtree size={38} strokeWidth={1.5} />
        </span>
      )}
      <span className={`min-w-0 ${textColor}`}>
        {isBabuBrand ? (
          <>
            <span className="block font-display text-lg font-bold uppercase leading-none tracking-[0.1em] sm:text-xl">Babu</span>
            <span className="mt-1 block text-[0.55rem] font-bold uppercase leading-none tracking-[0.16em] opacity-85">Commission Shop</span>
          </>
        ) : (
          <>
            <span className="block truncate font-display text-[1.05rem] font-semibold leading-tight sm:text-lg">{businessName}</span>
            {!compact && <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.19em] opacity-75">Khairpur, Sindh</span>}
          </>
        )}
      </span>
    </span>
  );
}
