import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { useProducts } from '@/hooks/useData';
import { PLACEHOLDER_IMAGES, PRODUCT_IMAGES } from '@/lib/constants';

export function DatesPage() {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <PublicLayout
      title="Date Varieties"
      description="Explore our premium date varieties sourced from Khairpur — Aseel, Dhakki, Karbalain, Rabai, Chhohara and more."
      image={PLACEHOLDER_IMAGES.heroDates}
    >
      <PageHeader
        title="Our Date Varieties"
        subtitle="Premium dates sourced directly from Khairpur's finest farms. Each variety offers unique flavours, textures, and characteristics."
        image={PLACEHOLDER_IMAGES.heroDates}
      />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          {/* Search & filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
              <input
                type="text"
                placeholder="Search date varieties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-date-700 text-cream'
                      : 'bg-date-100 text-date-600 hover:bg-date-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading date varieties..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No varieties found"
              message="Try adjusting your search or filter to find what you're looking for."
              icon={<Search size={48} />}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  to={`/dates/${product.slug}`}
                  className="card overflow-hidden group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-date-100">
                    <img
                      src={product.image_url || PRODUCT_IMAGES[product.slug] || PLACEHOLDER_IMAGES.datesBowl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    {product.category && (
                      <span className="text-xs font-medium text-palm-600 uppercase tracking-wider">{product.category}</span>
                    )}
                    <h3 className="mt-1 font-display font-semibold text-date-800 text-lg group-hover:text-date-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-date-500 line-clamp-2">{product.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-date-700 font-medium">
                      View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
