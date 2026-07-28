'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useResetPassword } from '@/hooks/useApi';
import Toast, { ToastType } from '@/components/admin/Toast';

function Shell({ children }: { children: React.ReactNode }) {
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
            Set A New Password
          </h2>
        </div>

        <div className="p-10 border" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
          {children}
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--color-border)' }}>
          Swan International © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword]  = useState('');
  const [showPw,          setShowPw]           = useState(false);
  const [error,           setError]            = useState('');
  const [success,         setSuccess]          = useState(false);
  const [toast,           setToast]            = useState<{ msg: string; type: ToastType } | null>(null);

  const resetPassword = useResetPassword();

  if (!token) {
    return (
      <Shell>
        <div className="text-center">
          <p className="text-sm mb-8" style={{ color: '#666' }}>
            This password reset link is invalid. Please request a new one.
          </p>
          <Link
            href="/admin/forgot-password"
            className="text-xs tracking-[2px] uppercase hover:text-white transition-colors"
            style={{ color: 'var(--color-accent)' }}
          >
            Request A New Link
          </Link>
        </div>
      </Shell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password });
      setToast({ msg: 'Password reset successfully.', type: 'success' });
      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 1800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'This link is invalid or has expired.');
      setToast({ msg: msg || 'This link is invalid or has expired.', type: 'error' });
    }
  };

  return (
    <>
    <Shell>
      {success ? (
        <div className="text-center">
          <div
            className="w-14 h-14 flex items-center justify-center border mx-auto mb-6"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <CheckCircle2 size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h3
            className="text-lg font-normal mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
          >
            Password Reset
          </h3>
          <p className="text-sm" style={{ color: '#666' }}>
            Redirecting you to sign in…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                style={{ color: '#444' }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>
              Confirm Password
            </label>
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-transparent border outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs py-3 px-4 border"
              style={{ color: '#f87171', background: '#1a0808', borderColor: '#4a1515' }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="btn-luxury-filled w-full justify-center"
            style={{ opacity: resetPassword.isPending ? 0.65 : 1 }}
          >
            {resetPassword.isPending ? (
              'Resetting…'
            ) : (
              <>
                <KeyRound size={14} />
                Reset Password
              </>
            )}
          </button>

          {error && (
            <Link
              href="/admin/forgot-password"
              className="block text-center text-xs hover:text-white transition-colors"
              style={{ color: '#666' }}
            >
              Request a new link
            </Link>
          )}
        </form>
      )}
    </Shell>
    {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
