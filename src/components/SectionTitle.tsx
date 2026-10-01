import { type ReactNode } from 'react';
import { MediaImage } from '@/components/MediaImage';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionTitle({ eyebrow, title, subtitle, center, light }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'}`}>
      {eyebrow && (
        <p className={`text-sm font-medium uppercase tracking-widest mb-3 ${light ? 'text-palm-300' : 'text-palm-600'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl font-display font-bold leading-tight ${light ? 'text-cream' : 'text-date-800'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-cream/80' : 'text-date-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, image, eyebrow }: { title: string; subtitle?: string; image?: string; eyebrow?: string }) {
  return (
    <div className="relative overflow-hidden bg-date-800 pt-32 pb-16 md:pt-40 md:pb-20">
      {image && (
        <div className="absolute inset-0">
          <MediaImage src={image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-date-900/60 to-date-800/80" />
        </div>
      )}
      <div className="relative container-prose">
        {eyebrow && <p className="eyebrow mb-3 text-sand-300">{eyebrow}</p>}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-cream/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`container-prose ${className}`}>
      {children}
    </div>
  );
}
