import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, Search } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Modal, ConfirmDialog } from '@/components/admin/Dialogs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/types/database';

const emptyForm = {
  caption: '', category: '', image_url: '', alt_text: '',
  sort_order: 0, is_published: true,
};

export function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true });
      if (error) setOperationError(error.message);
      else setItems(data as GalleryItem[]);
    } catch (fetchError) {
      setOperationError(fetchError instanceof Error ? fetchError.message : 'Could not load the gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const filtered = items.filter(g =>
    !search || g.caption.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({
      caption: g.caption, category: g.category, image_url: g.image_url,
      alt_text: g.alt_text, sort_order: g.sort_order, is_published: g.is_published,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.image_url) { setError('Please upload an image'); return; }

    setSaving(true);
    const payload = {
      caption: form.caption.trim(),
      category: form.category.trim(),
      image_url: form.image_url,
      alt_text: form.alt_text.trim() || form.caption.trim(),
      sort_order: form.sort_order,
      is_published: form.is_published,
    };

    try {
      const result = editing
        ? await supabase.from('gallery').update(payload).eq('id', editing.id)
        : await supabase.from('gallery').insert(payload);
      if (result.error) { setError(result.error.message); return; }

      setModalOpen(false);
      await fetchGallery();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this gallery image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setOperationError('');
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', deleteTarget.id);
      if (error) { setOperationError(error.message); return; }
      setDeleteTarget(null);
      await fetchGallery();
    } catch (deleteError) {
      setOperationError(deleteError instanceof Error ? deleteError.message : 'Could not delete this gallery image.');
    }
  };

  const togglePublish = async (g: GalleryItem) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('gallery').update({ is_published: !g.is_published }).eq('id', g.id);
      if (error) { setOperationError(error.message); return; }
      await fetchGallery();
    } catch (toggleError) {
      setOperationError(toggleError instanceof Error ? toggleError.message : 'Could not update this gallery image.');
    }
  };

  return (
    <AdminLayout title="Gallery">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
          <input type="text" placeholder="Search gallery..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <button onClick={openAdd} className="btn-primary whitespace-nowrap">
          <Plus size={18} /> Add Image
        </button>
      </div>

      {operationError && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{operationError}</div>}

      {loading ? (
        <LoadingSpinner label="Loading gallery..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No gallery images" message="Click 'Add Image' to upload your first gallery image." icon={<ImageIcon size={48} />} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((g) => (
            <div key={g.id} className="bg-cream rounded-xl border border-date-100 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-date-100 relative">
                <img src={g.image_url} alt={g.alt_text || g.caption} className="w-full h-full object-cover" />
                {!g.is_published && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-date-900/70 text-cream text-xs">Hidden</div>
                )}
              </div>
              <div className="p-3">
                {g.caption && <p className="text-sm font-medium text-date-800 truncate">{g.caption}</p>}
                {g.category && <p className="text-xs text-date-400 truncate">{g.category}</p>}
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => togglePublish(g)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600" title={g.is_published ? 'Unpublish' : 'Publish'}>
                    {g.is_published ? <Eye size={14} className="text-palm-600" /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(g)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit Gallery Image' : 'Add Gallery Image'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
          <ImageUpload
            label="Image *"
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, image_url: '' }))}
            aspect="aspect-square"
          />
          <div>
            <label className="label-text">Caption</label>
            <input type="text" value={form.caption} onChange={(e) => setForm(prev => ({ ...prev, caption: e.target.value }))} className="input-field" placeholder="Image caption..." />
          </div>
          <div>
            <label className="label-text">Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} className="input-field" placeholder="e.g. Farm, Market, Packaging" />
          </div>
          <div>
            <label className="label-text">Alt Text</label>
            <input type="text" value={form.alt_text} onChange={(e) => setForm(prev => ({ ...prev, alt_text: e.target.value }))} className="input-field" placeholder="Describe the image for accessibility..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Display Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="input-field" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-date-700 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm(prev => ({ ...prev, is_published: e.target.checked }))} className="w-4 h-4 rounded text-date-600 focus:ring-date-400" />
                Published
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-date-200 text-date-600 font-medium text-sm hover:bg-date-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this gallery image? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
