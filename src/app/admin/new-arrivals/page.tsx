'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getNewArrivals, createNewArrival, updateNewArrival, deleteNewArrival } from '@/services/api';
import type { TNewArrival } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const EMPTY: Partial<TNewArrival> = { brand: '', caption: '', image: '' };

export default function AdminNewArrivalsPage() {
  const qc = useQueryClient();
  const { data: arrivals = [], isLoading } = useQuery({ queryKey: ['newArrivals'], queryFn: getNewArrivals });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TNewArrival>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateNewArrival(editingId, editing) : createNewArrival(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['newArrivals'] }); setModalOpen(false); showToast(editingId ? 'Updated.' : 'New arrival added.'); },
    onError: () => showToast('Failed to save.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteNewArrival(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['newArrivals'] }); setDeleteId(null); showToast('Deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (a: TNewArrival) => { setEditing({ ...a }); setEditingId(a._id); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>New Arrivals</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{arrivals.length} item{arrivals.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Arrival</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" style={{ background: '#111' }} />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {arrivals.map((a) => (
            <div key={a._id} className="group relative" style={{ background: '#111' }}>
              <div className="relative aspect-[3/4] overflow-hidden">
                {a.image && <Image src={a.image} alt={a.caption} fill className="object-cover" sizes="200px" />}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3" style={{ background: 'rgba(0,0,0,0.7)' }}>
                  <button onClick={() => openEdit(a)} className="text-xs px-3 py-1.5 border hover:bg-white/10 transition-colors" style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>Edit</button>
                  <button onClick={() => setDeleteId(a._id)} className="text-xs px-3 py-1.5 border hover:bg-red-900/30 transition-colors" style={{ borderColor: '#c0392b', color: '#f87171' }}>Del</button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] tracking-[2px] uppercase mb-1" style={{ color: '#C9A84C' }}>{a.brand}</p>
                <p className="text-xs line-clamp-2" style={{ color: '#666' }}>{a.caption}</p>
              </div>
            </div>
          ))}
          {arrivals.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm" style={{ color: '#555' }}>No arrivals yet.</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-8 border" style={{ background: '#111', borderColor: '#222' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{editingId ? 'Edit Arrival' : 'Add New Arrival'}</h2>
              <div className="space-y-4">
                {([['brand', 'Brand Name'], ['caption', 'Caption'], ['image', 'Image URL']] as [keyof TNewArrival, string][]).map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
                    <input value={(editing[f] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                  </div>
                ))}
                {editing.image && (
                  <div className="relative w-32 h-40 overflow-hidden mx-auto" style={{ background: '#0a0a0a' }}>
                    <Image src={editing.image} alt="Preview" fill className="object-cover" sizes="128px" onError={() => {}} />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: '#888' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This arrival will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
