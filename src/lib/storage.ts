import { supabase } from '@/lib/supabase';

const BUCKET = 'media';
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (file.size > MAX_IMAGE_SIZE_BYTES) return 'File size must be under 5 MB.';
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (!supportedTypes.includes(file.type)) {
    return 'Choose a raster image such as PNG, JPG, WebP, GIF, or AVIF.';
  }
  return null;
}

function storageErrorMessage(message: string): string {
  if (/bucket not found/i.test(message)) {
    return `Supabase Storage bucket "${BUCKET}" was not found. Run supabase/migrations/20261001062000_006_configure_media_bucket.sql in the SQL Editor for the project configured by VITE_SUPABASE_URL. If it is already applied, check that VITE_SUPABASE_URL points to that same project.`;
  }
  return message;
}

function unknownErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

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
  const ext = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  return `${unique}.${ext}`;
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string; error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) return { url: '', path: '', error: validationError };

  const path = generateFilePath(file.name);

  if (onProgress) {
    onProgress(0);
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      return { url: '', path: '', error: storageErrorMessage(error.message) };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    if (onProgress) {
      onProgress(100);
    }

    return { url: urlData.publicUrl, path: data.path, error: null };
  } catch (error) {
    return { url: '', path: '', error: storageErrorMessage(unknownErrorMessage(error)) };
  }
}

export async function deleteFile(path: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    return { error: error ? storageErrorMessage(error.message) : null };
  } catch (error) {
    return { error: storageErrorMessage(unknownErrorMessage(error)) };
  }
}

export async function uploadAndRegisterImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string; error: string | null }> {
  const uploaded = await uploadFile(file, onProgress);
  if (uploaded.error) return uploaded;

  try {
    const { error } = await supabase.from('media').insert({
      filename: file.name,
      file_url: uploaded.url,
      file_path: uploaded.path,
      file_size: file.size,
      mime_type: file.type,
    });

    if (error) {
      const cleanup = await deleteFile(uploaded.path);
      const cleanupMessage = cleanup.error ? ` Cleanup also failed: ${cleanup.error}` : '';
      return {
        url: '',
        path: '',
        error: `The image uploaded, but its media library record could not be saved: ${error.message}. The uploaded file was removed.${cleanupMessage}`,
      };
    }

    return uploaded;
  } catch (error) {
    const cleanup = await deleteFile(uploaded.path);
    const cleanupMessage = cleanup.error ? ` Cleanup also failed: ${cleanup.error}` : '';
    return {
      url: '',
      path: '',
      error: `The image uploaded, but its media library record could not be saved: ${unknownErrorMessage(error)}. The uploaded file was removed.${cleanupMessage}`,
    };
  }
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
