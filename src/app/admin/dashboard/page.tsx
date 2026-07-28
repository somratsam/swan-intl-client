'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getBanners, getBrands, getEvents, getJobs, getNewArrivals, getOffers, getProducts, getStores } from '@/services/api';
import Link from 'next/link';

const stats = [
  { label: 'Brands', key: 'brands', href: '/admin/brands', color: '#facc15', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Stores', key: 'stores', href: '/admin/stores', color: '#60a5fa', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { label: 'Banners', key: 'banners', href: '/admin/banners', color: '#a78bfa', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Offers', key: 'offers', href: '/admin/offers', color: '#34d399', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { label: 'Events', key: 'events', href: '/admin/events', color: '#f472b6', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'New Arrivals', key: 'arrivals', href: '/admin/new-arrivals', color: '#fb923c', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { label: 'Products', key: 'products', href: '/admin/products', color: '#38bdf8', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { label: 'Jobs', key: 'jobs', href: '/admin/jobs', color: '#4ade80', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function AdminDashboard() {
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: getStores });
  const { data: banners } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
  const { data: offers } = useQuery({ queryKey: ['offers'], queryFn: getOffers });
  const { data: events } = useQuery({ queryKey: ['events'], queryFn: getEvents });
  const { data: arrivals } = useQuery({ queryKey: ['newArrivals'], queryFn: getNewArrivals });
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });

  const counts: Record<string, number> = {
    brands: brands?.length ?? 0,
    stores: stores?.length ?? 0,
    banners: banners?.length ?? 0,
    offers: offers?.length ?? 0,
    events: events?.length ?? 0,
    arrivals: arrivals?.length ?? 0,
    products: products?.length ?? 0,
    jobs: jobs?.length ?? 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>Swan International — Content Overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={stat.href}
              className="block p-6 border transition-all duration-200 hover:border-[var(--color-border)] group"
              style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: `${stat.color}33`, background: `${stat.color}11` }}>
                  <svg width="16" height="16" fill="none" stroke={stat.color} strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <svg width="14" height="14" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:stroke-[var(--color-text-muted)] transition-colors">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </div>
              <p className="text-3xl font-light mb-1" style={{ color: stat.color, fontFamily: 'Playfair Display, serif' }}>
                {counts[stat.key]}
              </p>
              <p className="text-xs tracking-[2px] uppercase" style={{ color: 'var(--color-text-dim)' }}>{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10 p-6 border" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
        <p className="text-xs tracking-[3px] uppercase mb-5" style={{ color: 'var(--color-accent)' }}>Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {stats.map((s) => (
            <Link key={s.key} href={s.href} className="text-[10px] tracking-[2px] uppercase px-4 py-2 border hover:border-[var(--color-accent)] hover:text-white transition-all" style={{ borderColor: 'var(--color-border)', color: '#666' }}>
              + {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
