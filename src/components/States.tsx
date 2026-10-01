import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24, label }: { size?: number; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="animate-spin text-date-500" size={size} />
      {label && <p className="text-sm text-date-400">{label}</p>}
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-date-600" size={40} />
        <p className="text-date-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, message, icon }: { title: string; message?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-date-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-display font-semibold text-date-700">{title}</h3>
      {message && <p className="mt-2 text-sm text-date-400 max-w-md">{message}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <span className="text-red-500 text-xl">!</span>
      </div>
      <h3 className="text-lg font-display font-semibold text-date-700">Something went wrong</h3>
      <p className="mt-2 text-sm text-date-400 max-w-md">{message}</p>
    </div>
  );
}
