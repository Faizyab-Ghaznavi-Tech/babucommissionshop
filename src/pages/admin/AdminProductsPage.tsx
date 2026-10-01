import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, GripVertical, Search } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Modal, ConfirmDialog } from '@/components/admin/Dialogs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/storage';
import { PRODUCT_IMAGES } from '@/lib/constants';
import type { Product } from '@/types/database';

const emptyForm = {
  name: '', slug: '', description: '', category: '',
  image_url: '', sort_order: 0, featured: false, is_enabled: true,
};

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
      if (error) setOperationError(error.message);
      else setProducts(data as Product[]);
    } catch (fetchError) {
      setOperationError(fetchError instanceof Error ? fetchError.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: products.length + 1 });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, description: p.description, category: p.category,
      image_url: p.image_url, sort_order: p.sort_order, featured: p.featured, is_enabled: p.is_enabled,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }

    const slug = form.slug.trim() || generateSlug(form.name);
    const existing = products.find(p => p.slug === slug && p.id !== editing?.id);
    if (existing) { setError('A product with this slug already exists'); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      category: form.category.trim(),
      image_url: form.image_url || PRODUCT_IMAGES[slug] || '',
      sort_order: form.sort_order,
      featured: form.featured,
      is_enabled: form.is_enabled,
    };

    try {
      const result = editing
        ? await supabase.from('products').update(payload).eq('id', editing.id)
        : await supabase.from('products').insert(payload);
      if (result.error) { setError(result.error.message); return; }

      setModalOpen(false);
      await fetchProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setOperationError('');
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id);
      if (error) { setOperationError(error.message); return; }
      setDeleteTarget(null);
      await fetchProducts();
    } catch (deleteError) {
      setOperationError(deleteError instanceof Error ? deleteError.message : 'Could not delete this product.');
    }
  };

  const toggleEnabled = async (p: Product) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('products').update({ is_enabled: !p.is_enabled }).eq('id', p.id);
      if (error) { setOperationError(error.message); return; }
      await fetchProducts();
    } catch (toggleError) {
      setOperationError(toggleError instanceof Error ? toggleError.message : 'Could not update this product.');
    }
  };

  const toggleFeatured = async (p: Product) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('products').update({ featured: !p.featured }).eq('id', p.id);
      if (error) { setOperationError(error.message); return; }
      await fetchProducts();
    } catch (toggleError) {
      setOperationError(toggleError instanceof Error ? toggleError.message : 'Could not update this product.');
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button onClick={openAdd} className="btn-primary whitespace-nowrap">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {operationError && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{operationError}</div>}

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" message="Click 'Add Product' to create your first date variety." icon={<Plus size={48} />} />
      ) : (
        <div className="bg-cream rounded-xl border border-date-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-date-50 text-date-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="text-center px-4 py-3 font-medium">Featured</th>
                  <th className="text-center px-4 py-3 font-medium">Enabled</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-date-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-date-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-date-400">
                        <GripVertical size={14} />
                        <span className="text-sm">{p.sort_order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-date-100 shrink-0">
                          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-date-800 truncate">{p.name}</p>
                          <p className="text-xs text-date-400 truncate">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-date-500">{p.category || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleFeatured(p)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors">
                        <Star size={18} className={p.featured ? 'text-amber-500 fill-amber-500' : 'text-date-300'} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleEnabled(p)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors">
                        {p.is_enabled ? <Eye size={18} className="text-palm-600" /> : <EyeOff size={18} className="text-date-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={modalOpen} title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    name,
                    slug: editing ? prev.slug : generateSlug(name),
                  }));
                }}
                className="input-field"
                placeholder="e.g. Aseel Dates — Premium Grade"
              />
            </div>
            <div>
              <label className="label-text">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="input-field"
                placeholder="auto-generated"
              />
            </div>
          </div>
          <div>
            <label className="label-text">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="input-field"
              placeholder="e.g. Aseel, Dhakki, Chhohara"
            />
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="input-field resize-none"
              placeholder="Describe this date variety..."
            />
          </div>
          <ImageUpload
            label="Product Image"
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, image_url: '' }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Display Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="input-field"
              />
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 text-sm text-date-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded text-date-600 focus:ring-date-400"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-date-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_enabled}
                  onChange={(e) => setForm(prev => ({ ...prev, is_enabled: e.target.checked }))}
                  className="w-4 h-4 rounded text-date-600 focus:ring-date-400"
                />
                Enabled
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-date-200 text-date-600 font-medium text-sm hover:bg-date-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
