'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUploadImages } from '@/hooks/useApi';
import { validateImageFile, MAX_FILES_PER_UPLOAD } from '@/lib/imageValidation';
import type { ToastType } from './Toast';

export const MAX_BULK_FILES = 25;

export type BulkColumn<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: { value: string; label: string }[];
  required?: boolean;
};

type RowStatus = 'pending' | 'uploading' | 'uploaded' | 'upload-failed' | 'creating' | 'success' | 'create-failed';

type BulkRow<T> = {
  id: string;
  file: File;
  previewUrl: string;
  imageUrl?: string;
  status: RowStatus;
  error?: string;
  invalid?: boolean;
  fields: Record<keyof T, string>;
};

interface BulkAddGridProps<T extends Record<string, string | number>> {
  columns: BulkColumn<T>[];
  createFn: (row: T & { image: string }) => Promise<unknown>;
  onComplete: () => void;
  onClose: () => void;
  onNotify: (message: string, type: ToastType) => void;
  title: string;
}

function emptyFields<T>(columns: BulkColumn<T>[]): Record<keyof T, string> {
  return Object.fromEntries(columns.map((c) => [c.key, ''])) as Record<keyof T, string>;
}

function errorMessage(err: unknown, fallback: string): string {
  return axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : fallback;
}

function statusBadge(row: BulkRow<unknown>) {
  switch (row.status) {
    case 'uploading':
    case 'creating':
      return <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-accent)' }} />;
    case 'success':
      return <CheckCircle2 size={14} style={{ color: '#4ade80' }} />;
    case 'upload-failed':
    case 'create-failed':
      return <AlertCircle size={14} style={{ color: '#f87171' }} />;
    default:
      return <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: 'var(--color-border)' }} />;
  }
}

export default function BulkAddGrid<T extends Record<string, string | number>>({
  columns,
  createFn,
  onComplete,
  onClose,
  onNotify,
  title,
}: BulkAddGridProps<T>) {
  const [rows, setRows] = useState<BulkRow<T>[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'creating' | 'done'>('idle');
  const [phaseProgress, setPhaseProgress] = useState({ current: 0, total: 0 });
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const uploadMutation = useUploadImages();

  useEffect(() => {
    return () => {
      rowsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    };
  }, []);

  const handleFilesSelected = (fileList: FileList | File[]) => {
    if (saving) return;
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const valid: File[] = [];
    const rejected: string[] = [];
    for (const file of incoming) {
      const err = validateImageFile(file);
      if (err) rejected.push(`${file.name} — ${err}`);
      else valid.push(file);
    }

    if (rows.length + valid.length > MAX_BULK_FILES) {
      onNotify(
        `That would add ${valid.length} images, but the limit is ${MAX_BULK_FILES} per bulk session (you have ${rows.length} already). Remove some first or drop fewer at once.`,
        'error',
      );
      return;
    }

    if (rejected.length > 0) {
      onNotify(
        `${rejected.length} file${rejected.length > 1 ? 's' : ''} skipped: ${rejected[0]}${rejected.length > 1 ? ` (+${rejected.length - 1} more)` : ''}`,
        'error',
      );
    }

    const newRows: BulkRow<T>[] = valid.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      fields: emptyFields(columns),
    }));

    setRows((prev) => [...prev, ...newRows]);
  };

  const updateRowField = (id: string, key: keyof T, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, fields: { ...r.fields, [key]: value }, invalid: false } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id);
      if (row) URL.revokeObjectURL(row.previewUrl);
      return prev.filter((r) => r.id !== id);
    });
  };

  const isRowValid = (row: BulkRow<T>) =>
    columns.every((c) => !c.required || String(row.fields[c.key] ?? '').trim() !== '');

  // row.fields is always Record<keyof T, string> at runtime (HTML inputs only
  // ever return strings) — coerce 'number' columns here so createFn always
  // receives the types its own signature promises, rather than relying on
  // every caller to remember to convert.
  const buildPayload = (row: BulkRow<T>): T => {
    const out = {} as Record<string, string | number>;
    for (const col of columns) {
      const raw = row.fields[col.key];
      out[col.key as string] = col.type === 'number' ? Number(raw) : raw;
    }
    return out as T;
  };

  const syncRow = (workingRows: BulkRow<T>[], id: string, patch: Partial<BulkRow<T>>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const wr = workingRows.find((r) => r.id === id);
    if (wr) Object.assign(wr, patch);
  };

  const handleSaveAll = async () => {
    const workingRows = rows.filter((r) => r.status !== 'success').map((r) => ({ ...r }));
    if (workingRows.length === 0) return;

    const invalid = workingRows.filter((r) => !isRowValid(r));
    if (invalid.length > 0) {
      const invalidIds = new Set(invalid.map((r) => r.id));
      setRows((prev) => prev.map((r) => (invalidIds.has(r.id) ? { ...r, invalid: true } : r)));
      onNotify('Fill in every required field before saving — incomplete rows are highlighted.', 'error');
      return;
    }

    setSaving(true);

    const needUpload = workingRows.filter((r) => !r.imageUrl);
    if (needUpload.length > 0) {
      setPhase('uploading');
      setPhaseProgress({ current: 0, total: needUpload.length });
      for (let i = 0; i < needUpload.length; i += MAX_FILES_PER_UPLOAD) {
        const chunk = needUpload.slice(i, i + MAX_FILES_PER_UPLOAD);
        chunk.forEach((r) => syncRow(workingRows, r.id, { status: 'uploading' }));
        try {
          const urls = await uploadMutation.mutateAsync({ files: chunk.map((r) => r.file) });
          chunk.forEach((r, idx) => syncRow(workingRows, r.id, { imageUrl: urls[idx], status: 'uploaded' }));
        } catch {
          // One bad file in a batch fails the whole request — retry this chunk
          // file-by-file so we isolate exactly which one is bad instead of
          // marking every row in the chunk as failed.
          for (const row of chunk) {
            try {
              const urls = await uploadMutation.mutateAsync({ files: [row.file] });
              syncRow(workingRows, row.id, { imageUrl: urls[0], status: 'uploaded' });
            } catch (fileErr) {
              syncRow(workingRows, row.id, { status: 'upload-failed', error: errorMessage(fileErr, 'Upload failed.') });
            }
          }
        }
        setPhaseProgress((p) => ({ current: Math.min(p.current + chunk.length, needUpload.length), total: needUpload.length }));
      }
    }

    const needCreate = workingRows.filter((r) => r.imageUrl && r.status !== 'success');
    if (needCreate.length > 0) {
      setPhase('creating');
      setPhaseProgress({ current: 0, total: needCreate.length });
      for (const row of needCreate) {
        syncRow(workingRows, row.id, { status: 'creating' });
        try {
          await createFn({ ...buildPayload(row), image: row.imageUrl! });
          syncRow(workingRows, row.id, { status: 'success' });
        } catch (err) {
          syncRow(workingRows, row.id, { status: 'create-failed', error: errorMessage(err, 'Failed to create record.') });
        }
        setPhaseProgress((p) => ({ current: p.current + 1, total: needCreate.length }));
      }
    }

    setPhase('done');
    setSaving(false);
    onComplete();

    const successCount = workingRows.filter((r) => r.status === 'success').length;
    const failCount = workingRows.length - successCount;
    if (failCount > 0) {
      onNotify(`${successCount} of ${workingRows.length} saved. ${failCount} failed — fix and retry.`, 'error');
    } else {
      onNotify(`All ${successCount} saved.`, 'success');
    }
  };

  const onDragEnter: React.DragEventHandler = (e) => {
    e.preventDefault();
    if (saving) return;
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
    if (saving) return;
    handleFilesSelected(e.dataTransfer.files);
  };

  const atLimit = rows.length >= MAX_BULK_FILES;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={() => !saving && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl p-8 border overflow-y-auto max-h-[90vh]"
        style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-xl font-normal mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          {title}
        </h2>
        <p className="text-xs mb-6" style={{ color: '#666' }}>
          Up to {MAX_BULK_FILES} images per session. Create-only — to edit an existing record, use the regular Edit flow.
        </p>

        {phase !== 'idle' && phase !== 'done' && (
          <div className="mb-6">
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
              {phase === 'uploading' ? 'Uploading images' : 'Creating records'}: {phaseProgress.current}/{phaseProgress.total}
            </p>
            <div className="w-full h-1 overflow-hidden" style={{ background: 'var(--color-border)' }}>
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${phaseProgress.total ? (phaseProgress.current / phaseProgress.total) * 100 : 0}%`,
                  background: 'var(--color-accent)',
                }}
              />
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="overflow-x-auto mb-4 border" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0d0d0d', borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left px-3 py-2 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>Image</th>
                  {columns.map((col) => (
                    <th key={String(col.key)} className="text-left px-3 py-2 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>
                      {col.label}
                    </th>
                  ))}
                  <th className="text-left px-3 py-2 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>Status</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="px-3 py-2">
                      <div className="relative w-12 h-12 overflow-hidden" style={{ background: 'var(--color-dark-bg)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.previewUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-3 py-2">
                        {col.type === 'select' ? (
                          <select
                            value={row.fields[col.key] ?? ''}
                            onChange={(e) => updateRowField(row.id, col.key, e.target.value)}
                            disabled={saving || row.status === 'success'}
                            className="w-full px-2 py-1.5 text-xs border outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                            style={{
                              borderColor: row.invalid && !row.fields[col.key] ? '#c0392b' : 'var(--color-border)',
                              color: 'var(--color-text)',
                              background: '#0d0d0d',
                            }}
                          >
                            <option value="">Select…</option>
                            {col.options?.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={col.type === 'number' ? 'number' : 'text'}
                            value={row.fields[col.key] ?? ''}
                            onChange={(e) => updateRowField(row.id, col.key, e.target.value)}
                            disabled={saving || row.status === 'success'}
                            className="w-full px-2 py-1.5 text-xs bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                            style={{
                              borderColor: row.invalid && !row.fields[col.key] ? '#c0392b' : 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {statusBadge(row)}
                        {row.error && <span className="text-[10px]" style={{ color: '#f87171' }}>{row.error}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {row.status !== 'success' && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={saving}
                          className="hover:text-red-400 transition-colors disabled:opacity-40"
                          style={{ color: 'var(--color-text-dim)' }}
                          aria-label="Remove row"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          onClick={() => !saving && !atLimit && inputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          disabled={saving || atLimit}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 border border-dashed transition-colors disabled:cursor-not-allowed"
          style={{
            borderColor: dragActive ? 'var(--color-accent)' : 'var(--color-border)',
            background: dragActive ? 'rgba(139,111,140,0.05)' : 'transparent',
            opacity: saving || atLimit ? 0.5 : 1,
          }}
        >
          <Upload size={18} style={{ color: '#666' }} />
          <p className="text-xs" style={{ color: '#666' }}>
            {atLimit ? `Limit reached — ${MAX_BULK_FILES} images max per session` : `Drag & drop photos, or click to browse (up to ${MAX_BULK_FILES})`}
          </p>
          <p className="text-[10px]" style={{ color: '#444' }}>JPG, PNG or WEBP — max 5MB each</p>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={saving || atLimit}
          onChange={(e) => {
            if (e.target.files) handleFilesSelected(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors disabled:opacity-40"
            style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || rows.length === 0}
            className="flex-1 btn-luxury-filled justify-center"
            style={{ opacity: saving || rows.length === 0 ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
