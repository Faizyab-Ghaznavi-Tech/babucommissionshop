import { supabase } from '@/lib/supabase';

const BUCKET = 'media';

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateFilePath(filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg';
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  return `${unique}.${ext}`;
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string; error: string | null }> {
  const path = generateFilePath(file.name);

  if (onProgress) {
    onProgress(0);
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    return { url: '', path: '', error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  if (onProgress) {
    onProgress(100);
  }

  return { url: urlData.publicUrl, path: data.path, error: null };
}

export async function deleteFile(path: string): Promise<{ error: string | null }> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return { error: error?.message ?? null };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
