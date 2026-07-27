'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/api';
import type { TEvent } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: Partial<TEvent> = {
  image: '', title: '', description: '', date: '', category: '', tags: [],
  location: { address: '', city: '', country: '' },
  time: { start: '', end: '' },
  organizer: { name: '', contact: '', phone: '' },
};

export default function AdminEventsPage() {
  const qc = useQueryClient();
  const { data: events = [], isLoading } = useQuery({ queryKey: ['events'], queryFn: getEvents });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TEvent>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateEvent(editingId, editing) : createEvent(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); setModalOpen(false); showToast(editingId ? 'Event updated.' : 'Event created.'); },
    onError: () => showToast('Failed to save event.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); setDeleteId(null); showToast('Event deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (e: TEvent) => { setEditing({ ...e }); setEditingId(e._id); setModalOpen(true); };

  const F = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>Events</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{events.length} event{events.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Event</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton" style={{ background: '#111' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: '#1a1a1a' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
                {['Image', 'Title', 'Date', 'Category', 'Location', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-10 overflow-hidden" style={{ background: '#1a1a1a' }}>
                      {e.image && <Image src={e.image} alt={e.title} fill className="object-cover" sizes="64px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{e.title?.slice(0, 30)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#888' }}>{e.date ? new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td className="px-4 py-3"><span className="text-[9px] px-2 py-1" style={{ background: '#C9A84C22', color: '#C9A84C' }}>{e.category}</span></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#888' }}>{e.location?.city}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(e)} className="text-xs hover:text-white transition-colors" style={{ color: '#C9A84C' }}>Edit</button>
                      <button onClick={() => setDeleteId(e._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: '#555' }}>No events yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: '#111', borderColor: '#222' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{editingId ? 'Edit Event' : 'Add Event'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <F label="Title" value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} />
                  <F label="Date" value={editing.date ? editing.date.slice(0, 10) : ''} type="date" onChange={(v) => setEditing({ ...editing, date: v })} />
                  <F label="Category" value={editing.category ?? ''} onChange={(v) => setEditing({ ...editing, category: v })} />
                  <F label="Start Time" value={editing.time?.start ?? ''} onChange={(v) => setEditing({ ...editing, time: { ...(editing.time ?? { start: '', end: '' }), start: v } })} />
                  <F label="End Time" value={editing.time?.end ?? ''} onChange={(v) => setEditing({ ...editing, time: { ...(editing.time ?? { start: '', end: '' }), end: v } })} />
                </div>
                <ImageUpload
                  label="Image"
                  value={editing.image ?? ''}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  onError={(msg) => showToast(msg, 'error')}
                />
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Description</label>
                  <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: '#C9A84C' }}>Location</p>
                <div className="grid grid-cols-3 gap-4">
                  <F label="Address" value={editing.location?.address ?? ''} onChange={(v) => setEditing({ ...editing, location: { ...(editing.location ?? { address: '', city: '', country: '' }), address: v } })} />
                  <F label="City" value={editing.location?.city ?? ''} onChange={(v) => setEditing({ ...editing, location: { ...(editing.location ?? { address: '', city: '', country: '' }), city: v } })} />
                  <F label="Country" value={editing.location?.country ?? ''} onChange={(v) => setEditing({ ...editing, location: { ...(editing.location ?? { address: '', city: '', country: '' }), country: v } })} />
                </div>
                <p className="text-[10px] tracking-[3px] uppercase pt-2" style={{ color: '#C9A84C' }}>Organizer</p>
                <div className="grid grid-cols-3 gap-4">
                  <F label="Name" value={editing.organizer?.name ?? ''} onChange={(v) => setEditing({ ...editing, organizer: { ...(editing.organizer ?? { name: '', contact: '', phone: '' }), name: v } })} />
                  <F label="Email" value={editing.organizer?.contact ?? ''} onChange={(v) => setEditing({ ...editing, organizer: { ...(editing.organizer ?? { name: '', contact: '', phone: '' }), contact: v } })} />
                  <F label="Phone" value={editing.organizer?.phone ?? ''} onChange={(v) => setEditing({ ...editing, organizer: { ...(editing.organizer ?? { name: '', contact: '', phone: '' }), phone: v } })} />
                </div>
                <F label="Tags (comma separated)" value={(editing.tags ?? []).join(', ')} onChange={(v) => setEditing({ ...editing, tags: v.split(',').map((t) => t.trim()).filter(Boolean) })} />
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: '#888' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Event'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This event will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
