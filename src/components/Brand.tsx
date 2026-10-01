import { Palmtree } from 'lucide-react';

interface BrandProps {
  businessName: string;
  logoUrl?: string | null;
  light?: boolean;
  compact?: boolean;
}

export function Brand({ businessName, logoUrl, light = false, compact = false }: BrandProps) {
  const textColor = light ? 'text-cream' : 'text-date-950';

  return (
    <span className="inline-flex items-center gap-2.5">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          width="44"
          height="44"
          className="h-10 w-10 shrink-0 rounded-sm object-contain sm:h-11 sm:w-11"
        />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sand-400 sm:h-11 sm:w-11" aria-hidden="true">
          <Palmtree size={36} strokeWidth={1.6} />
        </span>
      )}
      <span className={`min-w-0 ${textColor}`}>
        <span className="block truncate font-display text-[1.05rem] font-semibold leading-tight sm:text-lg">
          {businessName || 'Babu Commission Shop'}
        </span>
        {!compact && <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.19em] opacity-75">Khairpur, Sindh</span>}
      </span>
    </span>
  );
}
