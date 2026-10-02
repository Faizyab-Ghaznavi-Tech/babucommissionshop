import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/States';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useData';

export function DatesPage() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))], [products]);
  const filtered = useMemo(() => products.filter((product) => {
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || product.name.toLocaleLowerCase().includes(query) || product.description.toLocaleLowerCase().includes(query);
    return matchesSearch && (category === 'All' || product.category === category);
  }), [products, search, category]);

  return (
    <PublicLayout title="Date Varieties" description="Browse the date varieties listed by Babu Commission Shop and contact us to ask about availability.">
      <PageHeader eyebrow="Our dates" title="Date varieties" subtitle="Browse the date varieties currently listed by Babu Commission Shop. Contact us to ask about availability and quantities." />
      <section className="section-padding bg-cream">
        <div className="container-prose">
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-500" aria-hidden="true" />
              <input type="search" aria-label="Search date varieties" placeholder="Search varieties..." value={search} onChange={(event) => setSearch(event.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter date varieties by category">
              {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 rounded-md px-4 text-sm font-medium transition-colors ${category === item ? 'bg-date-900 text-white' : 'bg-date-100 text-date-800 hover:bg-date-200'}`}>{item}</button>)}
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading date varieties..." /> : error ? <ErrorState message={`Could not load date varieties: ${error}`} /> : filtered.length === 0 ? (
            products.length === 0
              ? <EmptyState title="Date varieties are being prepared" message="New listings will appear here when they are published by the shop." />
              : <EmptyState title="No varieties found" message="Try adjusting your search or category filter." icon={<Search size={48} />} />
          ) : (
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
