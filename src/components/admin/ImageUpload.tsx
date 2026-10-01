import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadAndRegisterImage, validateImageFile } from '@/lib/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string, path: string) => void;
  onRemove?: () => void;
  label?: string;
  aspect?: string;
}

export function ImageUpload({ value, onChange, onRemove, label = 'Image', aspect = 'aspect-video' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const { url, path, error: uploadError } = await uploadAndRegisterImage(file, setProgress);

      if (uploadError) {
        setError(uploadError);
        return;
      }

      onChange(url, path);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (onRemove) onRemove();
  };

  return (
    <div>
      {label && <label className="label-text">{label}</label>}
      {value ? (
        <div className={`relative ${aspect} rounded-lg overflow-hidden bg-date-100 border border-date-200`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className={`${aspect} rounded-lg border-2 border-dashed border-date-200 flex flex-col items-center justify-center gap-2 text-date-400 hover:border-date-300 hover:text-date-500 transition-colors cursor-pointer`}>
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Uploading... {progress > 0 ? `${progress}%` : ''}</p>
            </>
          ) : (
            <>
              <Upload size={28} />
              <p className="text-sm">Click to upload</p>
              <p className="text-xs text-date-300">PNG, JPG up to 5 MB</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading || !!value}
      />
      {!value && !uploading && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-2 text-sm text-date-600 hover:text-date-800 font-medium"
        >
          Choose File
        </button>
      )}
    </div>
  );
}
