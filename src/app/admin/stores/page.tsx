'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getStores, createStore, updateStore, deleteStore } from '@/services/api';
import type { TStore } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: Partial<TStore> = {
  name: '', address: '', mapLink: '', phone: '', email: '', openingHours: '',
  images: [], location: { lat: 0, lng: 0 }, isActive: true,
};

export default function AdminStoresPage() {
  const qc = useQueryClient();
  const { data: stores = [], isLoading } = useQuery({ queryKey: ['stores'], queryFn: getStores });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TStore>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const set = (field: keyof TStore) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditing((prev) => ({ ...prev, [field]: e.target.value }));

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateStore(editingId, editing) : createStore(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stores'] }); setModalOpen(false); showToast(editingId ? 'Store updated.' : 'Store created.'); },
    onError: () => showToast('Failed to save store.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stores'] }); setDeleteId(null); showToast('Store deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (s: TStore) => { setEditing({ ...s }); setEditingId(s._id); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>Stores</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{stores.length} store{stores.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Store</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton" style={{ background: '#111' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: '#1a1a1a' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
                {['Name', 'Address', 'Phone', 'Hours', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{s.name}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{s.address?.slice(0, 35)}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{s.phone}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{s.openingHours?.slice(0, 25)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] tracking-[2px] uppercase px-2 py-1" style={{ background: s.isActive ? '#C9A84C22' : '#33333355', color: s.isActive ? '#C9A84C' : '#666', border: `1px solid ${s.isActive ? '#C9A84C44' : '#333'}` }}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(s)} className="text-xs hover:text-white transition-colors" style={{ color: '#C9A84C' }}>Edit</button>
                      <button onClick={() => setDeleteId(s._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: '#555' }}>No stores yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: '#111', borderColor: '#222' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{editingId ? 'Edit Store' : 'Add Store'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([['name', 'Store Name'], ['address', 'Address'], ['phone', 'Phone'], ['email', 'Email'], ['mapLink', 'Google Maps URL'], ['openingHours', 'Opening Hours']] as [keyof TStore, string][]).map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
                    <input value={(editing[f] as string) ?? ''} onChange={set(f)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Latitude</label>
                  <input type="number" step="any" value={editing.location?.lat ?? 0} onChange={(e) => setEditing({ ...editing, location: { ...(editing.location ?? { lat: 0, lng: 0 }), lat: parseFloat(e.target.value) } })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Longitude</label>
                  <input type="number" step="any" value={editing.location?.lng ?? 0} onChange={(e) => setEditing({ ...editing, location: { ...(editing.location ?? { lat: 0, lng: 0 }), lng: parseFloat(e.target.value) } })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    multiple
                    label="Images"
                    value={editing.images ?? []}
                    onChange={(urls) => setEditing({ ...editing, images: urls })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="w-4 h-4 accent-[#C9A84C]" />
                  <span className="text-sm" style={{ color: '#888' }}>Active</span>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: '#888' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Store'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This store will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
