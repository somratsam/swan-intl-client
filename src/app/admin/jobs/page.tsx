'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getJobs, createJob, updateJob, deleteJob } from '@/services/api';
import type { TJob } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const JOB_TYPES: TJob['jobType'][] = ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary'];

const EMPTY: Partial<TJob> = {
  title: '', company: '', companyLogo: '', description: '', location: '',
  salary: 0, jobType: 'full-time', requirements: [], responsibilities: [], benefits: [],
};

function arrayArea(label: string, value: string[], onChange: (v: string[]) => void) {
  return (
    <div>
      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label} <span style={{ color: '#555' }}>(one per line)</span></label>
      <textarea rows={4} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
    </div>
  );
}

export default function AdminJobsPage() {
  const qc = useQueryClient();
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TJob>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const saveMut = useMutation({
    mutationFn: () => editingId ? updateJob(editingId, editing) : createJob(editing),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); setModalOpen(false); showToast(editingId ? 'Job updated.' : 'Job created.'); },
    onError: () => showToast('Failed to save job.', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); setDeleteId(null); showToast('Job deleted.'); },
    onError: () => showToast('Failed to delete.', 'error'),
  });

  const openCreate = () => { setEditing(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (j: TJob) => { setEditing({ ...j }); setEditingId(j._id); setModalOpen(true); };

  const JOB_TYPE_COLORS: Record<string, string> = { 'full-time': '#C9A84C', 'part-time': '#7eb8c9', 'contract': '#c97e7e', 'freelance': '#9ec97e', 'internship': '#c9b47e', 'temporary': '#b47ec9' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>Jobs</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>{jobs.length} position{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-luxury-filled">+ Add Job</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 skeleton" style={{ background: '#111' }} />)}</div>
      ) : (
        <div className="border" style={{ borderColor: '#1a1a1a' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
                {['Title', 'Company', 'Location', 'Salary', 'Type', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: '#ddd' }}>{j.title}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{j.company}</td>
                  <td className="px-4 py-3" style={{ color: '#888' }}>{j.location}</td>
                  <td className="px-4 py-3" style={{ color: '#C9A84C' }}>OMR {j.salary?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] tracking-[1px] uppercase px-2 py-1 capitalize" style={{ background: `${JOB_TYPE_COLORS[j.jobType] || '#C9A84C'}22`, color: JOB_TYPE_COLORS[j.jobType] || '#C9A84C', border: `1px solid ${JOB_TYPE_COLORS[j.jobType] || '#C9A84C'}44` }}>
                      {j.jobType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(j)} className="text-xs hover:text-white transition-colors" style={{ color: '#C9A84C' }}>Edit</button>
                      <button onClick={() => setDeleteId(j._id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: '#666' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: '#555' }}>No jobs yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 border overflow-y-auto max-h-[90vh]" style={{ background: '#111', borderColor: '#222' }}>
              <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{editingId ? 'Edit Job' : 'Add Job'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {([['title', 'Job Title'], ['company', 'Company'], ['location', 'Location']] as [keyof TJob, string][]).map(([f, label]) => (
                    <div key={f}>
                      <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
                      <input value={(editing[f] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Salary (OMR)</label>
                    <input type="number" value={editing.salary ?? 0} onChange={(e) => setEditing({ ...editing, salary: Number(e.target.value) })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Job Type</label>
                    <select value={editing.jobType ?? 'full-time'} onChange={(e) => setEditing({ ...editing, jobType: e.target.value as TJob['jobType'] })} className="w-full px-4 py-2.5 text-sm border outline-none focus:border-[#C9A84C] transition-colors" style={{ borderColor: '#222', color: '#fff', background: '#111' }}>
                      {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <ImageUpload
                  label="Company Logo"
                  value={editing.companyLogo ?? ''}
                  onChange={(url) => setEditing({ ...editing, companyLogo: url })}
                  onError={(msg) => showToast(msg, 'error')}
                />
                <div>
                  <label className="block text-[10px] tracking-[3px] uppercase mb-2" style={{ color: '#888' }}>Description</label>
                  <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none" style={{ borderColor: '#222', color: '#fff' }} />
                </div>
                {arrayArea('Requirements', editing.requirements ?? [], (v) => setEditing({ ...editing, requirements: v }))}
                {arrayArea('Responsibilities', editing.responsibilities ?? [], (v) => setEditing({ ...editing, responsibilities: v }))}
                {arrayArea('Benefits (optional)', editing.benefits ?? [], (v) => setEditing({ ...editing, benefits: v }))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 text-xs tracking-[2px] uppercase border hover:bg-white/5 transition-colors" style={{ borderColor: '#333', color: '#888' }}>Cancel</button>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 btn-luxury-filled justify-center" style={{ opacity: saveMut.isPending ? 0.7 : 1 }}>{saveMut.isPending ? 'Saving…' : 'Save Job'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} message="This job posting will be permanently deleted." onConfirm={() => deleteId && deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMut.isPending} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
