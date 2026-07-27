'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/services/api';
import type { TBrand } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: Partial<TBrand> = {
  brand: '', address: '', phone: '', email: '', brandImage: '', brandLogo: '',
  description: '', features: [], bannerImage: [], gallery: [], products: '', history: '', mainBanner: '',
};

function arrayField(val: string[] | undefined, onChange: (v: string[]) => void, label: string) {
  const str = (val ?? []).join('\n');
  return (
    <div>
      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label} <span style={{ color: '#555' }}>(one per line)</span></label>
      <textarea rows={3} value={str} onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
        className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
    </div>
  );
}

export default function AdminBrandsPage() {
  const qc = useQueryClient();
  const { data: brands = [], isLoading } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TBrand>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const set = (field: keyof TBrand) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => ({ ...prev, [field]: e.target.value }));

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateBrand(editingId, editing) : createBrand(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brands'] }); setModalOpen(false); showToast(editingId ? 'Brand updated.' : 'Brand created.'); },
    onError: () => showToast('Failed to save brand.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brands'] }); setDeleteId(null); showToast('Brand deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (b: TBrand) => { setEditing({ ...b }); setEditingId(b._id); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>Brands</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{brands.length} brand{brands.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Brand</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 skeleton" style={{ background: '#111' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: '#1a1a1a' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
                {['Logo', 'Brand', 'Address', 'Phone', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-14 h-8 overflow-hidden" style={{ background: '#1a1a1a' }}>
                      {b.brandLogo && <Image src={b.brandLogo} alt={b.brand} fill className="object-contain p-1" sizes="56px" style={{ filter: 'invert(1)' }} />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{b.brand}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{b.address?.slice(0, 40)}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{b.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(b)} className="text-xs hover:text-white transition-colors" style={{ color: '#C9A84C' }}>Edit</button>
                      <button onClick={() => setDeleteId(b._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#555' }}>No brands yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: '#111', borderColor: '#222' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{editingId ? 'Edit Brand' : 'Add Brand'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([['brand', 'Brand Name'], ['address', 'Address'], ['phone', 'Phone'], ['email', 'Email'], ['products', 'Products Description']] as [keyof TBrand, string][]).map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
                    <input value={(editing[f] as string) ?? ''} onChange={set(f)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Description</label>
                  <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>History</label>
                  <textarea rows={3} value={editing.history ?? ''} onChange={(e) => setEditing({ ...editing, history: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                <div>{arrayField(editing.features, (v) => setEditing({ ...editing, features: v }), 'Features')}</div>
                <div>
                  <ImageUpload
                    label="Brand Image"
                    value={editing.brandImage ?? ''}
                    onChange={(url) => setEditing({ ...editing, brandImage: url })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Brand Logo"
                    value={editing.brandLogo ?? ''}
                    onChange={(url) => setEditing({ ...editing, brandLogo: url })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Main Banner"
                    value={editing.mainBanner ?? ''}
                    onChange={(url) => setEditing({ ...editing, mainBanner: url })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    multiple
                    label="Banner Images"
                    value={editing.bannerImage ?? []}
                    onChange={(urls) => setEditing({ ...editing, bannerImage: urls })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    multiple
                    label="Gallery"
                    value={editing.gallery ?? []}
                    onChange={(urls) => setEditing({ ...editing, gallery: urls })}
                    onError={(msg) => showToast(msg, 'error')}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: '#888' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Brand'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This brand will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
