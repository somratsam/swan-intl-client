'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getOffers, createOffer, updateOffer, deleteOffer } from '@/services/api';
import type { TOffer } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: Partial<TOffer> = {
  image: '', title: '', description: '', tags: [],
  dateRange: { startDate: '', endDate: '' },
  location: { address: '', mapLink: '' },
  contact: { phone: '', email: '', storeHours: '' },
  social_media: { facebook: '', instagram: '', twitter: '' },
  exclusiveOfferDetails: { loyaltyRewards: '', giftVouchers: '', specialEvents: '' },
};

export default function AdminOffersPage() {
  const qc = useQueryClient();
  const { data: offers = [], isLoading } = useQuery({ queryKey: ['offers'], queryFn: getOffers });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TOffer>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateOffer(editingId, editing) : createOffer(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['offers'] }); setModalOpen(false); showToast(editingId ? 'Offer updated.' : 'Offer created.'); },
    onError: () => showToast('Failed to save offer.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['offers'] }); setDeleteId(null); showToast('Offer deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (o: TOffer) => { setEditing({ ...o }); setEditingId(o._id); setModalOpen(true); };

  const InputField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>Offers</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{offers.length} offer{offers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Offer</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton" style={{ background: 'var(--color-card-bg)' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-dark-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Image', 'Title', 'Date Range', 'Tags', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-10 overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      {o.image && <Image src={o.image} alt={o.title} fill className="object-cover" sizes="64px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{o.title?.slice(0, 30)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {o.dateRange?.startDate ? new Date(o.dateRange.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    {' → '}
                    {o.dateRange?.endDate ? new Date(o.dateRange.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {o.tags?.slice(0, 2).map((t) => <span key={t} className="text-[9px] px-2 py-0.5" style={{ background: 'var(--color-border)', color: '#666' }}>{t}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(o)} className="text-xs hover:text-white transition-colors" style={{ color: 'var(--color-accent)' }}>Edit</button>
                      <button onClick={() => setDeleteId(o._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--color-text-dim)' }}>No offers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>{editingId ? 'Edit Offer' : 'Add Offer'}</h2>
              <div className="space-y-4">
                <InputField label="Title" value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} />
                <ImageUpload
                  label="Image"
                  value={editing.image ?? ''}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  onError={(msg) => showToast(msg, 'error')}
                />
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Description</label>
                  <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors resize-none" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Start Date" value={editing.dateRange?.startDate ? editing.dateRange.startDate.slice(0, 10) : ''} onChange={(v) => setEditing({ ...editing, dateRange: { ...(editing.dateRange ?? { startDate: '', endDate: '' }), startDate: v } })} />
                  <InputField label="End Date" value={editing.dateRange?.endDate ? editing.dateRange.endDate.slice(0, 10) : ''} onChange={(v) => setEditing({ ...editing, dateRange: { ...(editing.dateRange ?? { startDate: '', endDate: '' }), endDate: v } })} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: 'var(--color-accent)' }}>Location</p>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Address" value={editing.location?.address ?? ''} onChange={(v) => setEditing({ ...editing, location: { ...(editing.location ?? { address: '', mapLink: '' }), address: v } })} />
                  <InputField label="Map Link" value={editing.location?.mapLink ?? ''} onChange={(v) => setEditing({ ...editing, location: { ...(editing.location ?? { address: '', mapLink: '' }), mapLink: v } })} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: 'var(--color-accent)' }}>Contact</p>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Phone" value={editing.contact?.phone ?? ''} onChange={(v) => setEditing({ ...editing, contact: { ...(editing.contact ?? { phone: '', email: '', storeHours: '' }), phone: v } })} />
                  <InputField label="Email" value={editing.contact?.email ?? ''} onChange={(v) => setEditing({ ...editing, contact: { ...(editing.contact ?? { phone: '', email: '', storeHours: '' }), email: v } })} />
                  <InputField label="Store Hours" value={editing.contact?.storeHours ?? ''} onChange={(v) => setEditing({ ...editing, contact: { ...(editing.contact ?? { phone: '', email: '', storeHours: '' }), storeHours: v } })} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: 'var(--color-accent)' }}>Social Media</p>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Instagram" value={editing.social_media?.instagram ?? ''} onChange={(v) => setEditing({ ...editing, social_media: { ...(editing.social_media ?? { facebook: '', instagram: '', twitter: '' }), instagram: v } })} />
                  <InputField label="Facebook" value={editing.social_media?.facebook ?? ''} onChange={(v) => setEditing({ ...editing, social_media: { ...(editing.social_media ?? { facebook: '', instagram: '', twitter: '' }), facebook: v } })} />
                  <InputField label="Twitter" value={editing.social_media?.twitter ?? ''} onChange={(v) => setEditing({ ...editing, social_media: { ...(editing.social_media ?? { facebook: '', instagram: '', twitter: '' }), twitter: v } })} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: 'var(--color-accent)' }}>Exclusive Details</p>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Loyalty Rewards" value={editing.exclusiveOfferDetails?.loyaltyRewards ?? ''} onChange={(v) => setEditing({ ...editing, exclusiveOfferDetails: { ...(editing.exclusiveOfferDetails ?? { loyaltyRewards: '', giftVouchers: '', specialEvents: '' }), loyaltyRewards: v } })} />
                  <InputField label="Gift Vouchers" value={editing.exclusiveOfferDetails?.giftVouchers ?? ''} onChange={(v) => setEditing({ ...editing, exclusiveOfferDetails: { ...(editing.exclusiveOfferDetails ?? { loyaltyRewards: '', giftVouchers: '', specialEvents: '' }), giftVouchers: v } })} />
                  <InputField label="Special Events" value={editing.exclusiveOfferDetails?.specialEvents ?? ''} onChange={(v) => setEditing({ ...editing, exclusiveOfferDetails: { ...(editing.exclusiveOfferDetails ?? { loyaltyRewards: '', giftVouchers: '', specialEvents: '' }), specialEvents: v } })} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Tags (comma separated)</label>
                  <input value={(editing.tags ?? []).join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: 'var(--color-text-muted)' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Offer'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This offer will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
