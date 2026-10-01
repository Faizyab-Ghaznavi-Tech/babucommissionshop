import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/States';
import { MediaImage } from '@/components/MediaImage';
import { useProducts } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES, PRODUCT_IMAGES } from '@/lib/constants';

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
    <PublicLayout title="Date Varieties" description="Browse the date varieties listed by Babu Commission Shop and contact us to ask about availability." image={PLACEHOLDER_IMAGES.heroDates}>
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => {
                const image = product.image_url || PRODUCT_IMAGES[product.slug] || PLACEHOLDER_IMAGES.datesBowl;
                return <Link key={product.id} to={`/dates/${product.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-date-100"><MediaImage src={image} alt={product.image_url ? product.name : `${product.name} — representative image`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="p-5">
                    {product.category && <p className="eyebrow">{product.category}</p>}
                    <h2 className="mt-2 font-display text-xl font-semibold text-date-950 group-hover:text-date-700">{product.name}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-date-700">{product.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-date-900">View details <ArrowRight size={15} aria-hidden="true" /></span>
                  </div>
                </Link>;
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
