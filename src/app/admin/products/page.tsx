'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getProducts, createProduct, updateProduct, deleteProduct, getBrands } from '@/services/api';
import type { TProduct, TProductItem } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';
import BulkAddGrid from '@/components/admin/BulkAddGrid';
import type { BulkColumn } from '@/components/admin/BulkAddGrid';

const EMPTY_ITEM: TProductItem = { title: '', brand: '', image: '', description: '', gallery: [] };
const EMPTY: Partial<TProduct> = { name: '', image: '', category: '', description: '', price: 0, tags: [], items: [{ ...EMPTY_ITEM }] };

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TProduct>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateProduct(editingId, editing) : createProduct(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setModalOpen(false); showToast(editingId ? 'Product updated.' : 'Product created.'); },
    onError: () => showToast('Failed to save product.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setDeleteId(null); showToast('Product deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (p: TProduct) => { setEditing({ ...p }); setEditingId(p._id); setModalOpen(true); };

  type BulkProductRow = { brand: string; name: string; category: string; price: number };
  const bulkColumns: BulkColumn<BulkProductRow>[] = [
    { key: 'brand', label: 'Brand', type: 'select', required: true, options: brands.map((b) => ({ value: b.brand, label: b.brand })) },
    { key: 'name', label: 'Product Name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'price', label: 'Price (OMR)', type: 'number', required: true },
  ];

  const bulkCreateProduct = (row: BulkProductRow & { image: string }) => {
    // items[] is required by the backend but not exposed in bulk mode — one
    // default item is auto-generated per row, seeded from the row's own data,
    // so the create call satisfies the schema without the admin ever seeing
    // items[] fields. Gallery must be non-empty (backend rejects []), so it's
    // seeded with the same main image rather than left empty.
    const description = `${row.name} — details coming soon.`;
    return createProduct({
      name: row.name,
      image: row.image,
      category: row.category,
      description,
      price: row.price,
      tags: [row.brand],
      items: [{
        title: row.name,
        brand: row.brand,
        image: row.image,
        description,
        gallery: [row.image],
      }],
    });
  };

  const updateItem = (idx: number, field: keyof TProductItem, value: string | string[]) => {
    const items = [...(editing.items ?? [])];
    items[idx] = { ...items[idx], [field]: value };
    setEditing({ ...editing, items });
  };

  const F = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setBulkOpen(true)} className="text-xs tracking-[2px] uppercase px-4 py-2.5 border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}>Bulk Add</button>
          <button onClick={openCreate} className="btn-luxury-filled">+ Add Product</button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" style={{ background: 'var(--color-card-bg)' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-dark-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Variants', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-14 overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{p.name?.slice(0, 30)}</td>
                  <td className="px-4 py-3"><span className="text-[9px] px-2 py-1" style={{ background: '#8B6F8C22', color: 'var(--color-accent)' }}>{p.category}</span></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-accent)' }}>OMR {p.price?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.items?.length ?? 0} variant{(p.items?.length ?? 0) !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-xs hover:text-white transition-colors" style={{ color: 'var(--color-accent)' }}>Edit</button>
                      <button onClick={() => setDeleteId(p._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--color-text-dim)' }}>No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <F label="Product Name" value={editing.name ?? ''} onChange={(v) => setEditing({ ...editing, name: v })} />
                  <F label="Category" value={editing.category ?? ''} onChange={(v) => setEditing({ ...editing, category: v })} />
                  <div>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Price (OMR)</label>
                    <input type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                  </div>
                </div>
                <ImageUpload
                  label="Main Image"
                  value={editing.image ?? ''}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  onError={(msg) => showToast(msg, 'error')}
                />
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Description</label>
                  <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors resize-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <F label="Tags (comma separated)" value={(editing.tags ?? []).join(', ')} onChange={(v) => setEditing({ ...editing, tags: v.split(',').map((t) => t.trim()).filter(Boolean) })} />

                {/* Items/Variants */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[3px] uppercase" style={{ color: 'var(--color-accent)' }}>Variants / Items</p>
                    <button onClick={() => setEditing({ ...editing, items: [...(editing.items ?? []), { ...EMPTY_ITEM }] })} className="text-[10px] tracking-[1px] uppercase px-3 py-1 border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}>+ Add Variant</button>
                  </div>
                  {(editing.items ?? []).map((item, idx) => (
                    <div key={idx} className="p-4 border mb-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-dark-bg)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs" style={{ color: '#666' }}>Variant {idx + 1}</p>
                        {(editing.items ?? []).length > 1 && (
                          <button onClick={() => setEditing({ ...editing, items: (editing.items ?? []).filter((_, i) => i !== idx) })} className="text-[10px] hover:text-red-400 transition-colors" style={{ color: 'var(--color-text-dim)' }}>Remove</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <F label="Title" value={item.title} onChange={(v) => updateItem(idx, 'title', v)} />
                        <F label="Brand" value={item.brand} onChange={(v) => updateItem(idx, 'brand', v)} />
                        <F label="Image URL" value={item.image} onChange={(v) => updateItem(idx, 'image', v)} />
                        <div className="col-span-2">
                          <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Description</label>
                          <textarea rows={2} value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors resize-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Gallery URLs (one per line)</label>
                          <textarea rows={2} value={item.gallery.join('\n')} onChange={(e) => updateItem(idx, 'gallery', e.target.value.split('\n').filter(Boolean))} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors resize-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Product'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bulkOpen && (
          <BulkAddGrid
            title="Bulk Add Products"
            columns={bulkColumns}
            createFn={bulkCreateProduct}
            onComplete={() => qc.invalidateQueries({ queryKey: ['products'] })}
            onClose={() => setBulkOpen(false)}
            onNotify={(msg, type) => showToast(msg, type)}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This product will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
