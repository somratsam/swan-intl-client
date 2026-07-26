'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Image as ImageIcon, Tag, MapPin,
  Percent, Calendar, Sparkles, ShoppingBag, Briefcase, LogOut, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard',   href: '/admin/dashboard',    Icon: LayoutDashboard },
  { label: 'Banners',     href: '/admin/banners',       Icon: ImageIcon       },
  { label: 'Brands',      href: '/admin/brands',        Icon: Tag             },
  { label: 'Stores',      href: '/admin/stores',        Icon: MapPin          },
  { label: 'Offers',      href: '/admin/offers',        Icon: Percent         },
  { label: 'Events',      href: '/admin/events',        Icon: Calendar        },
  { label: 'New Arrivals',href: '/admin/new-arrivals',  Icon: Sparkles        },
  { label: 'Products',    href: '/admin/products',      Icon: ShoppingBag     },
  { label: 'Jobs',        href: '/admin/jobs',          Icon: Briefcase       },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && (!user || !isAdmin)) {
      router.replace('/admin/login');
    }
  }, [user, isAdmin, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050505' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 h-full z-40 flex flex-col w-16 lg:w-60"
        style={{ background: '#080808', borderRight: '1px solid #141414' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-5 border-b shrink-0" style={{ borderColor: '#141414' }}>
          <Link href="/admin/dashboard">
            <span
              className="text-lg font-bold tracking-[3px] uppercase"
              style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}
            >
              S
            </span>
            <span
              className="text-sm font-bold tracking-[3px] uppercase ml-1 hidden lg:inline"
              style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}
            >
              wan
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {navItems.map(({ label, href, Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={label}
                    className="flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group rounded-sm"
                    style={{
                      background:   active ? 'rgba(201,168,76,0.08)' : 'transparent',
                      borderLeft:   active ? '2px solid #C9A84C'     : '2px solid transparent',
                    }}
                  >
                    <Icon
                      size={16}
                      className="shrink-0 transition-colors group-hover:text-[#C9A84C]"
                      style={{ color: active ? '#C9A84C' : '#444' }}
                    />
                    <span
                      className="text-xs tracking-[0.5px] whitespace-nowrap hidden lg:block"
                      style={{ color: active ? '#C9A84C' : '#666' }}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / Logout */}
        <div className="p-3 lg:p-4 border-t shrink-0" style={{ borderColor: '#141414' }}>
          <div className="hidden lg:block mb-3">
            <p className="text-xs truncate" style={{ color: '#666' }}>{user.email}</p>
            <p className="text-[9px] tracking-[2px] uppercase mt-0.5" style={{ color: '#444' }}>{user.role}</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="flex items-center justify-center lg:justify-start gap-2 text-xs w-full transition-colors hover:text-red-400"
            style={{ color: '#444' }}
          >
            <LogOut size={14} />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main
        className="flex-1 min-h-screen overflow-x-hidden"
        style={{ marginLeft: '64px' }}
      >
        <style>{`@media (min-width: 1024px) { main { margin-left: 240px !important; } }`}</style>

        {/* Top bar */}
        <div
          className="h-16 flex items-center px-6 border-b sticky top-0 z-30"
          style={{
            background:    'rgba(8,8,8,0.96)',
            backdropFilter:'blur(12px)',
            borderColor:   '#141414',
          }}
        >
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs tracking-[2px] uppercase hover:text-white transition-colors"
              style={{ color: '#444' }}
            >
              View Site <ExternalLink size={11} />
            </Link>
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C' }}
            >
              {user.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

    </div>
  );
}
