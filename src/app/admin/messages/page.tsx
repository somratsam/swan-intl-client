'use client';

import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Send } from 'lucide-react';
import { getContacts, markContactAsRead, replyToContact } from '@/services/api';
import type { TContact } from '@/types';
import Toast, { ToastType } from '@/components/admin/Toast';

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['contacts'], queryFn: () => getContacts(1, 50) });
  const contacts = data?.contacts ?? [];
  const unreadCount = contacts.filter((c) => !c.read).length;

  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [replyDrafts,  setReplyDrafts]  = useState<Record<string, string>>({});
  const [toast,        setToast]        = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => setToast({ msg, type }), []);

  const markReadMut = useMutation({
    mutationFn: (id: string) => markContactAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });

  const replyMut = useMutation({
    mutationFn: ({ id, replyText }: { id: string; replyText: string }) => replyToContact(id, replyText),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: ['contacts'] });
      setReplyDrafts((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
      showToast('Reply sent.');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast(msg || 'Failed to send reply.', 'error');
    },
  });

  const toggleExpand = (contact: TContact) => {
    if (expandedId === contact._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(contact._id);
    if (!contact.read) {
      markReadMut.mutate(contact._id);
    }
  };

  const handleReply = (id: string) => {
    const replyText = (replyDrafts[id] ?? '').trim();
    if (!replyText) return;
    replyMut.mutate({ id, replyText });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
            Messages
          </h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>
            {contacts.length} message{contacts.length !== 1 ? 's' : ''}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 skeleton rounded" style={{ background: 'var(--color-card-bg)' }} />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="border py-16 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}>
          No messages yet.
        </div>
      ) : (
        <div className="border" style={{ borderColor: 'var(--color-border)' }}>
          {contacts.map((contact) => {
            const isExpanded = expandedId === contact._id;
            return (
              <div key={contact._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleExpand(contact)}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: contact.read ? 'transparent' : 'var(--color-accent)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm truncate"
                        style={{ color: contact.read ? '#999' : 'var(--color-text)', fontWeight: contact.read ? 400 : 600 }}
                      >
                        {contact.name}
                      </span>
                      <span className="text-xs truncate" style={{ color: 'var(--color-text-dim)' }}>{contact.email}</span>
                    </div>
                    <p className="text-sm truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{contact.subject}</p>
                  </div>
                  {contact.repliedAt && (
                    <span
                      className="text-[9px] tracking-[2px] uppercase px-2 py-1 shrink-0"
                      style={{ background: '#8B6F8C22', color: 'var(--color-accent)', border: '1px solid #8B6F8C44' }}
                    >
                      Replied
                    </span>
                  )}
                  <span className="text-xs shrink-0" style={{ color: '#666' }}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 transition-transform"
                    style={{ color: '#666', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-4 pb-6 pt-2">
                        <p className="text-sm whitespace-pre-wrap mb-6" style={{ color: '#ccc' }}>{contact.message}</p>

                        {contact.repliedAt ? (
                          <div className="p-4 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-dark-bg)' }}>
                            <p className="text-[9px] tracking-[2px] uppercase mb-2" style={{ color: 'var(--color-accent)' }}>
                              Your reply — {new Date(contact.repliedAt).toLocaleString()}
                            </p>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: '#ccc' }}>{contact.replyText}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <textarea
                              rows={4}
                              value={replyDrafts[contact._id] ?? ''}
                              onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [contact._id]: e.target.value }))}
                              placeholder="Write a reply…"
                              className="w-full px-4 py-3 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                            />
                            <button
                              onClick={() => handleReply(contact._id)}
                              disabled={replyMut.isPending || !(replyDrafts[contact._id] ?? '').trim()}
                              className="btn-luxury-filled"
                              style={{ opacity: replyMut.isPending ? 0.65 : 1 }}
                            >
                              <Send size={14} />
                              {replyMut.isPending ? 'Sending…' : 'Send Reply'}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
