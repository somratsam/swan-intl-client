'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { useUploadImages } from '@/hooks/useApi';
import { validateImageFiles } from '@/lib/imageValidation';

type ImageUploadProps =
  | { multiple: true; value: string[]; onChange: (urls: string[]) => void; onError?: (message: string) => void; label?: string }
  | { multiple?: false; value: string; onChange: (url: string) => void; onError?: (message: string) => void; label?: string };

function isValidHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ImageUpload(props: ImageUploadProps) {
  const { onError, label } = props;
  const multiple = props.multiple ?? false;
  const currentImages = props.multiple ? props.value : props.value ? [props.value] : [];

  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [manualUrl, setManualUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const objectUrlsRef = useRef<string[]>([]);

  const uploadMutation = useUploadImages();
  const uploading = uploadMutation.isPending;

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const reportError = (message: string) => onError?.(message);

  const revokeLocalPreviews = () => {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = [];
    setLocalPreviews([]);
  };

  const handleFiles = (fileList: FileList | File[]) => {
    if (uploading) return;
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const validationError = validateImageFiles(files, multiple);
    if (validationError) {
      reportError(validationError);
      return;
    }

    const urls = files.map((f) => URL.createObjectURL(f));
    objectUrlsRef.current = urls;
    setLocalPreviews(urls);
    setProgress(0);

    uploadMutation.mutate(
      { files, onUploadProgress: setProgress },
      {
        onSuccess: (uploadedUrls) => {
          revokeLocalPreviews();
          if (props.multiple) {
            props.onChange([...props.value, ...uploadedUrls]);
          } else {
            props.onChange(uploadedUrls[0]);
          }
        },
        onError: (err) => {
          revokeLocalPreviews();
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : 'Upload failed. Please try again.';
          reportError(message);
        },
      },
    );
  };

  const handleRemove = (index: number) => {
    if (uploading) return;
    if (props.multiple) {
      props.onChange(props.value.filter((_, i) => i !== index));
    } else {
      props.onChange('');
    }
  };

  const handleManualUrlAdd = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    if (!isValidHttpUrl(trimmed)) {
      reportError('Please enter a valid http(s) image URL.');
      return;
    }
    if (props.multiple) {
      props.onChange([...props.value, trimmed]);
    } else {
      props.onChange(trimmed);
    }
    setManualUrl('');
  };

  const onDragEnter: React.DragEventHandler = (e) => {
    e.preventDefault();
    if (uploading) return;
    dragCounter.current += 1;
    setDragActive(true);
  };
  const onDragLeave: React.DragEventHandler = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragActive(false);
    }
  };
  const onDragOver: React.DragEventHandler = (e) => e.preventDefault();
  const onDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragActive(false);
    if (uploading) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {label && (
        <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </label>
      )}

      {currentImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {currentImages.map((url, i) => (
            <div key={`${url}-${i}`} className="relative w-20 h-20 overflow-hidden border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-dark-bg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                disabled={uploading}
                aria-label="Remove image"
                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full transition-colors disabled:opacity-40"
                style={{ background: 'rgba(0,0,0,0.75)', color: 'var(--color-text)' }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center gap-2 py-8 border border-dashed transition-colors disabled:cursor-not-allowed"
        style={{
          borderColor: dragActive ? 'var(--color-accent)' : 'var(--color-border)',
          background: dragActive ? 'rgba(139,111,140,0.05)' : 'transparent',
          opacity: uploading ? 0.6 : 1,
        }}
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Uploading… {progress}%</p>
            <div className="w-40 h-1 overflow-hidden" style={{ background: 'var(--color-border)' }}>
              <div className="h-full transition-all duration-200" style={{ width: `${progress}%`, background: 'var(--color-accent)' }} />
            </div>
            {localPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {localPreviews.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="" className="w-12 h-12 object-cover border" style={{ borderColor: 'var(--color-border)' }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Upload size={20} style={{ color: '#666' }} />
            <p className="text-xs" style={{ color: '#666' }}>
              Drag &amp; drop or click to upload{multiple ? ' (up to 10)' : ''}
            </p>
            <p className="text-[10px]" style={{ color: '#444' }}>JPG, PNG or WEBP — max 5MB each</p>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={uploading}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      <div className="flex items-center gap-2 mt-3">
        <LinkIcon size={12} style={{ color: '#444' }} />
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleManualUrlAdd();
            }
          }}
          disabled={uploading}
          placeholder="Or paste an image URL"
          className="flex-1 px-3 py-2 text-xs bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        />
        <button
          type="button"
          onClick={handleManualUrlAdd}
          disabled={uploading || !manualUrl.trim()}
          className="text-[10px] tracking-[2px] uppercase px-3 py-2 border transition-colors disabled:opacity-40"
          style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
