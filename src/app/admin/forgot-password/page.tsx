'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useApi';
import Toast, { ToastType } from '@/components/admin/Toast';

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; type: ToastType } | null>(null);

  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword.mutateAsync(email);
      setToast({ msg: 'Reset link sent.', type: 'success' });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setToast({ msg: msg || 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--color-subtle-bg)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(139,111,140,0.045) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold tracking-[4px] uppercase"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-accent)' }}
          >
            Swan
          </h1>
          <p className="text-[8px] tracking-[7px] uppercase mt-1 mb-8" style={{ color: '#444' }}>
            International
          </p>
          <h2
            className="text-xl font-normal"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
          >
            Reset Your Password
          </h2>
          <p className="text-xs mt-2" style={{ color: '#444' }}>
            Enter your admin email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Card */}
        <div className="p-10 border" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
          {submitted ? (
            <div className="text-center">
              <div
                className="w-14 h-14 flex items-center justify-center border mx-auto mb-6"
                style={{ borderColor: 'var(--color-accent)' }}
              >
                <Mail size={20} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3
                className="text-lg font-normal mb-3"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
              >
                Check Your Inbox
              </h3>
              <p className="text-sm mb-8" style={{ color: '#666' }}>
                If an account with that email exists, a password reset link has been sent. The link
                expires in 1 hour.
              </p>
              <Link
                href="/admin/login"
                className="text-xs tracking-[2px] uppercase hover:text-white transition-colors"
                style={{ color: 'var(--color-accent)' }}
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="admin@swanintl.om"
                />
              </div>

              <button
                type="submit"
                disabled={forgotPassword.isPending}
                className="btn-luxury-filled w-full justify-center"
                style={{ opacity: forgotPassword.isPending ? 0.65 : 1 }}
              >
                {forgotPassword.isPending ? (
                  'Sending…'
                ) : (
                  <>
                    <Send size={14} />
                    Send Reset Link
                  </>
                )}
              </button>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 text-xs hover:text-white transition-colors"
                style={{ color: '#666' }}
              >
                <ArrowLeft size={12} />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--color-border)' }}>
          Swan International © {new Date().getFullYear()}
        </p>
      </motion.div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
