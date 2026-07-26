'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminIndexPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [user, isAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
    </div>
  );
}
