'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ open, title = 'Confirm Delete', message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-8 border"
            style={{ background: '#111', borderColor: '#2a1a1a' }}
          >
            <div className="w-12 h-12 flex items-center justify-center border mx-auto mb-5" style={{ borderColor: '#f87171' }}>
              <svg width="20" height="20" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-xl font-normal text-center mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
              {title}
            </h3>
            <p className="text-sm text-center mb-8" style={{ color: '#888' }}>{message}</p>
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 text-xs tracking-[2px] uppercase border transition-colors hover:bg-white/5"
                style={{ borderColor: '#333', color: '#888' }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 text-xs tracking-[2px] uppercase font-semibold transition-opacity hover:opacity-80"
                style={{ background: '#c0392b', color: '#fff' }}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
