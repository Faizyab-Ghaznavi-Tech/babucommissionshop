import { useState, useEffect, type FormEvent } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useData';

export function AdminSettingsPage() {
  const { settings, setSettings, loading, error: settingsError } = useWebsiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    business_name: '', tagline: '', logo_url: '', favicon_url: '', hero_image_url: '',
    phone: '', whatsapp: '', email: '', address: '', address_short: '',
    description: '', facebook_url: '', instagram_url: '', footer_content: '',
    website_title: '', meta_description: '',
  });

  useEffect(() => {
    if (settingsError) setError(settingsError);
  }, [settingsError]);

  useEffect(() => {
    if (!settings) return;
    setForm({
      business_name: settings.business_name || '',
      tagline: settings.tagline || '',
      logo_url: settings.logo_url || '',
      favicon_url: settings.favicon_url || '',
      hero_image_url: settings.hero_image_url || '',
      phone: settings.phone || '',
      whatsapp: settings.whatsapp || '',
      email: settings.email || '',
      address: settings.address || '',
      address_short: settings.address_short || '',
      description: settings.description || '',
      facebook_url: settings.facebook_url || '',
      instagram_url: settings.instagram_url || '',
      footer_content: settings.footer_content || '',
      website_title: settings.website_title || '',
      meta_description: settings.meta_description || '',
    });
  }, [settings]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      if (settings) {
        const { data, error } = await supabase.from('website_settings').update(form).eq('id', settings.id).select('*').single();
        if (error) { setError(error.message); return; }
        setSettings(data);
      } else {
        const { data, error } = await supabase.from('website_settings').insert(form).select('*').single();
        if (error) { setError(error.message); return; }
        setSettings(data);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save website settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <LoadingSpinner label="Loading settings..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
        {saved && (
          <div className="p-3 rounded-lg bg-palm-50 border border-palm-200 text-palm-700 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> Settings saved successfully.
          </div>
        )}

        {/* Business info */}
        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Business Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Business Name</label>
              <input type="text" value={form.business_name} onChange={(e) => setForm(prev => ({ ...prev, business_name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Tagline</label>
              <input type="text" value={form.tagline} onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUpload
              label="Logo"
              value={form.logo_url}
              onChange={(url) => setForm(prev => ({ ...prev, logo_url: url }))}
              onRemove={() => setForm(prev => ({ ...prev, logo_url: '' }))}
              aspect="aspect-square"
            />
            <ImageUpload
              label="Favicon"
              value={form.favicon_url}
              onChange={(url) => setForm(prev => ({ ...prev, favicon_url: url }))}
              onRemove={() => setForm(prev => ({ ...prev, favicon_url: '' }))}
              aspect="aspect-square"
            />
          </div>
          <ImageUpload
            label="Homepage Hero Image"
            value={form.hero_image_url}
            onChange={(url) => setForm(prev => ({ ...prev, hero_image_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, hero_image_url: '' }))}
            aspect="aspect-[16/6]"
          />
        </div>

        {/* Contact info */}
        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">WhatsApp</label>
              <input type="text" value={form.whatsapp} onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Address (short)</label>
              <input type="text" value={form.address_short} onChange={(e) => setForm(prev => ({ ...prev, address_short: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-text">Full Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} className="input-field" />
          </div>
        </div>

        {/* Social links */}
        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Facebook URL</label>
              <input type="text" value={form.facebook_url} onChange={(e) => setForm(prev => ({ ...prev, facebook_url: e.target.value }))} className="input-field" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="label-text">Instagram URL</label>
              <input type="text" value={form.instagram_url} onChange={(e) => setForm(prev => ({ ...prev, instagram_url: e.target.value }))} className="input-field" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">SEO & Website</h3>
          <div>
            <label className="label-text">Website Title (browser tab)</label>
            <input type="text" value={form.website_title} onChange={(e) => setForm(prev => ({ ...prev, website_title: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-text">Meta Description</label>
            <textarea rows={2} value={form.meta_description} onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))} className="input-field resize-none" />
          </div>
          <div>
            <label className="label-text">Footer Content</label>
            <textarea rows={2} value={form.footer_content} onChange={(e) => setForm(prev => ({ ...prev, footer_content: e.target.value }))} className="input-field resize-none" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Settings</>}
        </button>
      </form>
    </AdminLayout>
  );
}
