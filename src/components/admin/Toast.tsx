'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const colors = {
    success: { bg: '#0f1f0f', border: '#2d6a2d', icon: '#4ade80', text: '#86efac' },
    error: { bg: '#1f0f0f', border: '#6a2d2d', icon: '#f87171', text: '#fca5a5' },
    info: { bg: '#0f0f1f', border: '#2d2d6a', icon: '#60a5fa', text: '#93c5fd' },
  };
  const c = colors[type];

  const icons = {
    success: <polyline points="20 6 9 17 4 12" />,
    error: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    info: <><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 border shadow-2xl"
        style={{ background: c.bg, borderColor: c.border, minWidth: '280px', maxWidth: '420px' }}
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full border shrink-0" style={{ borderColor: c.icon }}>
          <svg width="14" height="14" fill="none" stroke={c.icon} strokeWidth="2" viewBox="0 0 24 24">
            {icons[type]}
          </svg>
        </div>
        <p className="text-sm flex-1" style={{ color: c.text }}>{message}</p>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity" style={{ color: c.text }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
