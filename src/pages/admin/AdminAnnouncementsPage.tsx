import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Megaphone, Calendar } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Modal, ConfirmDialog } from '@/components/admin/Dialogs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/storage';
import type { Announcement } from '@/types/database';

const emptyForm = {
  title: '', content: '', image_url: '',
  announcement_date: new Date().toISOString().split('T')[0],
  is_published: false, sort_order: 0,
};

export function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('sort_order', { ascending: true });
      if (error) setOperationError(error.message);
      else setAnnouncements(data as Announcement[]);
    } catch (fetchError) {
      setOperationError(fetchError instanceof Error ? fetchError.message : 'Could not load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: announcements.length + 1 });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title, content: a.content, image_url: a.image_url,
      announcement_date: a.announcement_date,
      is_published: a.is_published, sort_order: a.sort_order,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      image_url: form.image_url,
      announcement_date: form.announcement_date,
      is_published: form.is_published,
      sort_order: form.sort_order,
    };

    try {
      const result = editing
        ? await supabase.from('announcements').update(payload).eq('id', editing.id)
        : await supabase.from('announcements').insert(payload);
      if (result.error) { setError(result.error.message); return; }

      setModalOpen(false);
      await fetchAnnouncements();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setOperationError('');
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', deleteTarget.id);
      if (error) { setOperationError(error.message); return; }
      setDeleteTarget(null);
      await fetchAnnouncements();
    } catch (deleteError) {
      setOperationError(deleteError instanceof Error ? deleteError.message : 'Could not delete this announcement.');
    }
  };

  const togglePublish = async (a: Announcement) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('announcements').update({ is_published: !a.is_published }).eq('id', a.id);
      if (error) { setOperationError(error.message); return; }
      await fetchAnnouncements();
    } catch (toggleError) {
      setOperationError(toggleError instanceof Error ? toggleError.message : 'Could not update this announcement.');
    }
  };

  return (
    <AdminLayout title="Announcements">
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add Announcement
        </button>
      </div>

      {operationError && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{operationError}</div>}

      {loading ? (
        <LoadingSpinner label="Loading announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState title="No announcements" message="Click 'Add Announcement' to create your first announcement." icon={<Megaphone size={48} />} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-cream rounded-xl border border-date-100 overflow-hidden">
              {a.image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-date-100">
                  <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-date-400 mb-2">
                  <Calendar size={12} />
                  {formatDate(a.announcement_date)}
                </div>
                <h3 className="font-display font-semibold text-date-800 mb-2">{a.title}</h3>
                <p className="text-sm text-date-500 line-clamp-3 mb-3">{a.content}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${a.is_published ? 'bg-palm-100 text-palm-700' : 'bg-date-100 text-date-500'}`}>
                    {a.is_published ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePublish(a)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600" title={a.is_published ? 'Unpublish' : 'Publish'}>
                      {a.is_published ? <Eye size={16} className="text-palm-600" /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(a)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit Announcement' : 'Add Announcement'} onClose={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="label-text">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="input-field" placeholder="Announcement title..." />
          </div>
          <div>
            <label className="label-text">Content</label>
            <textarea rows={4} value={form.content} onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))} className="input-field resize-none" placeholder="Announcement content..." />
          </div>
          <ImageUpload
            label="Announcement Image (optional)"
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, image_url: '' }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Date</label>
              <input type="date" value={form.announcement_date} onChange={(e) => setForm(prev => ({ ...prev, announcement_date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Display Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-date-700 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm(prev => ({ ...prev, is_published: e.target.checked }))} className="w-4 h-4 rounded text-date-600 focus:ring-date-400" />
            Published (visible on website)
          </label>
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
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
