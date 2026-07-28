'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { login } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login: authLogin, isAdmin, user } = useAuth();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPw,      setShowPw]      = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    if (user && isAdmin) router.replace('/admin/dashboard');
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (sessionStorage.getItem('swan_session_expired')) {
      sessionStorage.removeItem('swan_session_expired');
      setError('Your session has expired. Please sign in again.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.data.user.role !== 'admin') {
        setError('Access denied. Admin accounts only.');
        setLoading(false);
        return;
      }
      if (!res.data.token) {
        setError('Login failed — no token received. Please try again.');
        setLoading(false);
        return;
      }
      authLogin(res.data.token, res.data.user);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Invalid email or password.');
    } finally {
      setLoading(false);
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
            Admin Portal
          </h2>
          <p className="text-xs mt-2" style={{ color: '#444' }}>Authorised access only</p>
        </div>

        {/* Form card */}
        <div className="p-10 border" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
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

            <div>
              <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>
                Password
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
              disabled={loading}
              className="btn-luxury-filled w-full justify-center"
              style={{ opacity: loading ? 0.65 : 1 }}
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  <LogIn size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--color-border)' }}>
          Swan International © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
