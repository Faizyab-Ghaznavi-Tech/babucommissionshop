import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Search } from 'lucide-react';
import {
  Sprout, Handshake, Package, Truck, Gift, Moon, Ship,
  Leaf, ShoppingCart, Boxes, Tractor, Factory, Globe, Plane,
  Store, Warehouse,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Modal, ConfirmDialog } from '@/components/admin/Dialogs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { SERVICE_ICONS } from '@/lib/constants';
import type { Service } from '@/types/database';

const iconMap: Record<string, typeof Sprout> = {
  Sprout, Handshake, Package, Truck, Gift, Moon, Ship,
  Leaf, ShoppingCart, Boxes, Tractor, Factory, Globe, Plane,
  Store, Warehouse,
};

const emptyForm = {
  name: '', description: '', image_url: '', icon_name: 'Package',
  sort_order: 0, is_enabled: true,
};

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (error) setOperationError(error.message);
      else setServices(data as Service[]);
    } catch (fetchError) {
      setOperationError(fetchError instanceof Error ? fetchError.message : 'Could not load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const filtered = services.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: services.length + 1 });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name, description: s.description, image_url: s.image_url,
      icon_name: s.icon_name || 'Package', sort_order: s.sort_order, is_enabled: s.is_enabled,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url,
      icon_name: form.icon_name,
      sort_order: form.sort_order,
      is_enabled: form.is_enabled,
    };

    try {
      const result = editing
        ? await supabase.from('services').update(payload).eq('id', editing.id)
        : await supabase.from('services').insert(payload);
      if (result.error) { setError(result.error.message); return; }

      setModalOpen(false);
      await fetchServices();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setOperationError('');
    try {
      const { error } = await supabase.from('services').delete().eq('id', deleteTarget.id);
      if (error) { setOperationError(error.message); return; }
      setDeleteTarget(null);
      await fetchServices();
    } catch (deleteError) {
      setOperationError(deleteError instanceof Error ? deleteError.message : 'Could not delete this service.');
    }
  };

  const toggleEnabled = async (s: Service) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('services').update({ is_enabled: !s.is_enabled }).eq('id', s.id);
      if (error) { setOperationError(error.message); return; }
      await fetchServices();
    } catch (toggleError) {
      setOperationError(toggleError instanceof Error ? toggleError.message : 'Could not update this service.');
    }
  };

  return (
    <AdminLayout title="Services">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
          <input type="text" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <button onClick={openAdd} className="btn-primary whitespace-nowrap">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {operationError && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{operationError}</div>}

      {loading ? (
        <LoadingSpinner label="Loading services..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No services found" message="Click 'Add Service' to create your first service." icon={<Plus size={48} />} />
      ) : (
        <div className="bg-cream rounded-xl border border-date-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-date-50 text-date-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Service</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Description</th>
                  <th className="text-center px-4 py-3 font-medium">Website visibility</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-date-50">
                {filtered.map((s) => {
                  const Icon = iconMap[s.icon_name] ?? Package;
                  return (
                    <tr key={s.id} className="hover:bg-date-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-date-400">
                          <GripVertical size={14} />
                          <span className="text-sm">{s.sort_order}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-palm-100 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-palm-600" />
                          </div>
                          <p className="font-medium text-date-800">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-date-500 max-w-xs truncate">{s.description}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleEnabled(s)}
                          title={s.is_enabled ? 'Hide this service from the website' : 'Show this service on the website'}
                          aria-label={s.is_enabled ? `Hide ${s.name} from the website` : `Show ${s.name} on the website`}
                          className="p-1.5 rounded-lg hover:bg-date-100 transition-colors"
                        >
                          {s.is_enabled ? <Eye size={18} className="text-palm-600" /> : <EyeOff size={18} className="text-date-300" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit Service' : 'Add Service'} onClose={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="label-text">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="e.g. Direct Farmer Sourcing" />
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="input-field resize-none" placeholder="Describe this service..." />
          </div>
          <div>
            <label className="label-text">Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SERVICE_ICONS.map((iconName) => {
                const Icon = iconMap[iconName] ?? Package;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, icon_name: iconName }))}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-colors ${
                      form.icon_name === iconName
                        ? 'bg-date-700 text-cream'
                        : 'bg-date-50 text-date-500 hover:bg-date-100'
                    }`}
                    title={iconName}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>
          <ImageUpload
            label="Service Image (optional)"
            value={form.image_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, image_url: '' }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Display Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="input-field" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-date-700 cursor-pointer">
                <input type="checkbox" checked={form.is_enabled} onChange={(e) => setForm(prev => ({ ...prev, is_enabled: e.target.checked }))} className="w-4 h-4 rounded text-date-600 focus:ring-date-400" />
                Visible on website
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-date-200 text-date-600 font-medium text-sm hover:bg-date-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
