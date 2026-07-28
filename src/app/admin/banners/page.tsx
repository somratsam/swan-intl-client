'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/services/api';
import type { TBanner } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: Partial<TBanner> = { title: '', subtitle: '', image: '', link: '', isActive: true, order: 0 };

export default function AdminBannersPage() {
  const qc = useQueryClient();
  const { data: banners = [], isLoading } = useQuery({ queryKey: ['banners'], queryFn: getBanners });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TBanner>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateBanner(editingId, editing) : createBanner(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['banners'] }); setModalOpen(false); showToast(editingId ? 'Banner updated.' : 'Banner created.'); },
    onError: () => showToast('Failed to save banner.', 'error'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['banners'] }); setDeleteId(null); showToast('Banner deleted.'); },
    onError: () => showToast('Failed to delete banner.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (b: TBanner) => { setEditing({ ...b }); setEditingId(b._id); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>Banners</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{banners.length} banner{banners.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Banner</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton rounded" style={{ background: 'var(--color-card-bg)' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-dark-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Image', 'Title', 'Subtitle', 'Order', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-10 overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      {b.image && <Image src={b.image} alt={b.title} fill className="object-cover" sizes="64px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#ddd' }}>{b.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{b.subtitle?.slice(0, 40)}{b.subtitle?.length > 40 ? '…' : ''}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{b.order}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] tracking-[2px] uppercase px-2 py-1" style={{ background: b.isActive ? '#8B6F8C22' : '#33333355', color: b.isActive ? 'var(--color-accent)' : '#666', border: `1px solid ${b.isActive ? '#8B6F8C44' : '#333'}` }}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(b)} className="text-xs hover:text-white transition-colors" style={{ color: 'var(--color-accent)' }}>Edit</button>
                      <button onClick={() => setDeleteId(b._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--color-text-dim)' }}>No banners yet. Add your first banner.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg p-8 border overflow-y-auto max-h-[90vh]" style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>{editingId ? 'Edit Banner' : 'Add Banner'}</h2>
              <div className="space-y-4">
                {([['title', 'Title', 'text'], ['subtitle', 'Subtitle', 'text']] as [keyof TBanner, string, string][]).map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
                    <input type={type} value={(editing[field] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                  </div>
                ))}
                <ImageUpload
                  label="Image"
                  value={editing.image ?? ''}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  onError={(msg) => showToast(msg, 'error')}
                />
                {([['link', 'Link URL', 'url']] as [keyof TBanner, string, string][]).map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
                    <input type={type} value={(editing[field] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Order</label>
                    <input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="w-4 h-4 accent-[var(--color-accent)]" />
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>
                  {saveMut.isPending ? 'Saving…' : 'Save Banner'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This banner will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
