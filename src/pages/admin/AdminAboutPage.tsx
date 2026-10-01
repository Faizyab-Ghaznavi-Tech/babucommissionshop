import { useState, useEffect, type FormEvent } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LoadingSpinner } from '@/components/States';
import { supabase } from '@/lib/supabase';
import type { AboutContent } from '@/types/database';

export function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    company_story: '', mission: '', vision: '',
    business_description: '', image_1_url: '', image_2_url: '', image_3_url: '',
  });

  useEffect(() => {
    supabase.from('about_content').select('*').limit(1).maybeSingle().then(({ data, error }) => {
      if (!error && data) {
        setAbout(data);
        setForm({
          company_story: data.company_story || '',
          mission: data.mission || '',
          vision: data.vision || '',
          business_description: data.business_description || '',
          image_1_url: data.image_1_url || '',
          image_2_url: data.image_2_url || '',
          image_3_url: data.image_3_url || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    if (about) {
      const { error } = await supabase.from('about_content').update(form).eq('id', about.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('about_content').insert(form);
      if (error) { setError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <AdminLayout title="About Content">
        <LoadingSpinner label="Loading about content..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Content">
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
        {saved && (
          <div className="p-3 rounded-lg bg-palm-50 border border-palm-200 text-palm-700 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> Changes saved successfully.
          </div>
        )}

        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Company Story</h3>
          <textarea
            rows={6}
            value={form.company_story}
            onChange={(e) => setForm(prev => ({ ...prev, company_story: e.target.value }))}
            className="input-field resize-none"
            placeholder="Tell the story of your business..."
          />
          <ImageUpload
            label="Story Image"
            value={form.image_1_url}
            onChange={(url) => setForm(prev => ({ ...prev, image_1_url: url }))}
            onRemove={() => setForm(prev => ({ ...prev, image_1_url: '' }))}
          />
        </div>

        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Mission</h3>
          <textarea
            rows={4}
            value={form.mission}
            onChange={(e) => setForm(prev => ({ ...prev, mission: e.target.value }))}
            className="input-field resize-none"
            placeholder="What is your mission?"
          />
        </div>

        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Vision</h3>
          <textarea
            rows={4}
            value={form.vision}
            onChange={(e) => setForm(prev => ({ ...prev, vision: e.target.value }))}
            className="input-field resize-none"
            placeholder="What is your vision?"
          />
        </div>

        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Business Description</h3>
          <textarea
            rows={5}
            value={form.business_description}
            onChange={(e) => setForm(prev => ({ ...prev, business_description: e.target.value }))}
            className="input-field resize-none"
            placeholder="Describe your business..."
          />
        </div>

        <div className="bg-cream rounded-xl border border-date-100 p-6 space-y-4">
          <h3 className="font-display font-bold text-date-800">Additional Images</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUpload
              label="Image 2"
              value={form.image_2_url}
              onChange={(url) => setForm(prev => ({ ...prev, image_2_url: url }))}
              onRemove={() => setForm(prev => ({ ...prev, image_2_url: '' }))}
            />
            <ImageUpload
              label="Image 3"
              value={form.image_3_url}
              onChange={(url) => setForm(prev => ({ ...prev, image_3_url: url }))}
              onRemove={() => setForm(prev => ({ ...prev, image_3_url: '' }))}
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
        </button>
      </form>
    </AdminLayout>
  );
}
