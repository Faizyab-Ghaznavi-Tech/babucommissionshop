import { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Search, Copy, Check, FolderOpen } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { ConfirmDialog } from '@/components/admin/Dialogs';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { uploadAndRegisterImage, validateImageFile, deleteFile, formatBytes, formatDate } from '@/lib/storage';
import { useWebsiteSettings } from '@/hooks/useData';
import type { MediaItem } from '@/types/database';

const imagePlacements = [
  { field: 'hero_image_url', label: 'Home page hero' },
  { field: 'wholesale_background_url', label: 'Wholesale background' },
  { field: 'dates_background_url', label: 'Products page background' },
  { field: 'announcements_background_url', label: 'Announcements background' },
  { field: 'services_background_url', label: 'Services background' },
  { field: 'about_background_url', label: 'About background' },
] as const;

type ImagePlacementField = typeof imagePlacements[number]['field'];

export function AdminMediaPage() {
  const { settings, setSettings, loading: settingsLoading } = useWebsiteSettings();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [selectedPlacementByMedia, setSelectedPlacementByMedia] = useState<Record<string, ImagePlacementField | ''>>({});
  const [applyingMediaId, setApplyingMediaId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setMedia(data as MediaItem[]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Could not load the media library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const filtered = media.filter(m =>
    !search || m.filename.toLowerCase().includes(search.toLowerCase()) || m.alt_text.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setNotice('');
    setUploading(true);
    let uploadedCount = 0;
    const failures: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const validationError = validateImageFile(file);
        if (validationError) {
          failures.push(`${file.name}: ${validationError}`);
          continue;
        }

        const result = await uploadAndRegisterImage(file);
        if (result.error) {
          failures.push(`${file.name}: ${result.error}`);
        } else {
          uploadedCount += 1;
        }
      }

      if (uploadedCount > 0) await fetchMedia();
      if (failures.length > 0) setError(failures.join(' '));
      if (uploadedCount > 0) {
        setNotice(`${uploadedCount} image${uploadedCount === 1 ? '' : 's'} uploaded successfully.`);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (settingsLoading) {
      setError('Please wait for website settings to finish loading before deleting an image.');
      return;
    }
    const activePlacements = imagePlacements
      .filter(({ field }) => settings?.[field] === deleteTarget.file_url)
      .map(({ label }) => label);
    if (activePlacements.length > 0) {
      setError(`This image is currently used for ${activePlacements.join(', ')}. Choose a replacement before deleting it.`);
      setDeleteTarget(null);
      return;
    }
    setError('');
    try {
      const storageResult = await deleteFile(deleteTarget.file_path);
      if (storageResult.error) {
        setError(storageResult.error);
        return;
      }

      const { error } = await supabase.from('media').delete().eq('id', deleteTarget.id);
      if (error) {
        setError(`The image file was deleted, but its media library record could not be removed: ${error.message}`);
        return;
      }

      setDeleteTarget(null);
      await fetchMedia();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this media file.');
    }
  };

  const applyImagePlacement = async (item: MediaItem) => {
    const selectedField = selectedPlacementByMedia[item.id];
    const placement = imagePlacements.find(({ field }) => field === selectedField);
    if (!placement) return;

    setError('');
    setNotice('');
    setApplyingMediaId(item.id);

    try {
      const payload = { [placement.field]: item.file_url };
      const result = settings
        ? await supabase.from('website_settings').update(payload).eq('id', settings.id).select('*').single()
        : await supabase.from('website_settings').insert(payload).select('*').single();

      if (result.error) {
        if (/schema cache/i.test(result.error.message) && result.error.message.includes('website_settings')) {
          const migration = placement.field === 'hero_image_url'
            ? '20261002092000_011_add_homepage_hero_image.sql'
            : '20261005100000_012_add_section_background_images.sql';
          setError(`Supabase is missing the column for this image placement. Apply ${migration} to the connected project, then reload this page. The migration refreshes the API schema cache.`);
        } else {
          setError(result.error.message);
        }
        return;
      }

      setSettings(result.data);
      setNotice(`${item.filename} is now assigned to the ${placement.label.toLowerCase()}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not apply this image placement.');
    } finally {
      setApplyingMediaId(null);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Could not copy the image URL. Check browser clipboard permissions.');
    }
  };

  return (
    <AdminLayout title="Media Library">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
          <input type="text" placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-primary whitespace-nowrap disabled:opacity-60"
        >
          <Upload size={18} />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {error && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      {notice && <div role="status" className="mb-4 p-3 rounded-lg bg-palm-50 border border-palm-200 text-palm-700 text-sm">{notice}</div>}

      {loading ? (
        <LoadingSpinner label="Loading media..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No media files" message="Upload images to build your media library." icon={<FolderOpen size={48} />} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-cream rounded-xl border border-date-100 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-date-100 relative">
                <img src={m.file_url} alt={m.alt_text || m.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(m.file_url)}
                    className="w-8 h-8 rounded-full bg-white/90 text-date-700 flex items-center justify-center hover:bg-white transition-colors"
                    title="Copy URL"
                  >
                    {copied === m.file_url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(m)}
                    className="w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-date-700 truncate">{m.filename}</p>
                <p className="text-xs text-date-400">{formatBytes(m.file_size)}</p>
                <p className="text-xs text-date-300 mt-0.5">{formatDate(m.created_at)}</p>
                {imagePlacements.some(({ field }) => settings?.[field] === m.file_url) && (
                  <p className="mt-2 text-[0.68rem] leading-4 text-palm-700">
                    Used for: {imagePlacements.filter(({ field }) => settings?.[field] === m.file_url).map(({ label }) => label).join(', ')}
                  </p>
                )}
                <select
                  aria-label={`Choose where to use ${m.filename}`}
                  value={selectedPlacementByMedia[m.id] || ''}
                  onChange={(event) => setSelectedPlacementByMedia((current) => ({
                    ...current,
                    [m.id]: event.target.value as ImagePlacementField | '',
                  }))}
                  disabled={settingsLoading || applyingMediaId !== null}
                  className="input-field mt-2 !min-h-9 !px-2 !py-1 text-xs"
                >
                  <option value="">Choose where to use this image</option>
                  {imagePlacements.map(({ field, label }) => <option key={field} value={field}>{label}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => applyImagePlacement(m)}
                  disabled={settingsLoading || applyingMediaId !== null || !selectedPlacementByMedia[m.id] || imagePlacements.some(({ field }) => field === selectedPlacementByMedia[m.id] && settings?.[field] === m.file_url)}
                  className="mt-2 w-full rounded-md bg-date-800 px-2 py-2 text-xs font-semibold text-cream transition-colors hover:bg-date-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {applyingMediaId === m.id ? 'Applying...' : 'Apply to section'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Media File"
        message={`Are you sure you want to delete "${deleteTarget?.filename}"? If this image is used elsewhere, it will no longer display.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
