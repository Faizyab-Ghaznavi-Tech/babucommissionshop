import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { LoadingSpinner, ErrorState } from '@/components/States';
import { MediaImage } from '@/components/MediaImage';
import { ProductCard } from '@/components/ProductCard';
import { useProduct, useProducts } from '@/hooks/useData';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error: productError } = useProduct(slug);
  const { products } = useProducts();

  if (loading) {
    return (
      <PublicLayout title="Loading...">
        <LoadingSpinner label="Loading product..." />
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout title="Product Not Found">
        <div className="pt-32 pb-20">
          <ErrorState message={productError ? `Could not load this date variety: ${productError}` : "The date variety you're looking for doesn't exist or is no longer available."} />
          <div className="text-center">
            <Link to="/dates" className="btn-secondary">
              <ArrowLeft size={18} />
              Back to All Dates
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const imageUrl = product.image_url || undefined;
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const otherProducts = related.length > 0 ? related : products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <PublicLayout
      title={product.name}
      description={product.description}
      image={imageUrl}
    >
      <div className="pt-24 pb-6">
        <div className="container-prose">
          <Link to="/dates" className="inline-flex items-center gap-2 text-sm text-date-500 hover:text-date-700 transition-colors">
            <ArrowLeft size={16} />
            All Date Varieties
          </Link>
        </div>
      </div>

      <section className="pb-16">
        <div className="container-prose grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-date-100">
            <MediaImage src={imageUrl} alt={product.image_url ? product.name : `${product.name} — representative stock photo`} className="w-full h-full object-cover" fallbackLabel={false} stockPhotoVariant={product.slug} />
          </div>
          <div className="pt-4">
            {product.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-palm-100 text-palm-700 text-xs font-medium uppercase tracking-wider mb-4">
                <Tag size={12} />
                {product.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-date-800 leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-date-600 leading-relaxed whitespace-pre-line mb-8">
              {product.description}
            </p>
            <div className="bg-date-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-date-600 leading-relaxed mb-4">
                Interested in this variety? Contact the shop to discuss availability, pricing, quantity, and possible arrangements.
              </p>
              <Link
                to={`/contact?product=${product.slug}`}
                className="btn-primary w-full sm:w-auto"
              >
                Enquire About This Variety
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="text-sm text-date-500 hover:text-date-700 transition-colors">
                View our services
              </Link>
              <span className="text-date-300">|</span>
              <Link to="/contact" className="text-sm text-date-500 hover:text-date-700 transition-colors">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {otherProducts.length > 0 && (
        <section className="pb-16">
          <div className="container-prose">
            <h2 className="text-2xl font-display font-bold text-date-800 mb-6">Other Date Varieties</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {otherProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
