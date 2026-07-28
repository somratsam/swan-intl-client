'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useStores } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { optimizeImage } from '@/lib/image';

export default function StoresPageClient() {
  const { data: stores, isLoading, isError, refetch } = useStores();
  const activeStores = stores?.filter((s) => s.isActive);

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-dark-bg))' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Find Us</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          Our Boutiques
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {isLoading && <GridSkeleton count={4} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && activeStores && activeStores.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No stores available.
          </p>
        )}

        {!isLoading && !isError && activeStores && activeStores.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeStores.map((store, i) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden border"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
              >
                {store.images.length > 0 && (
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={optimizeImage(store.images[0])}
                      alt={store.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                  </div>
                )}
                <div className="p-8">
                  <h2 className="text-xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
                    {store.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="text-[9px] tracking-[3px] uppercase mb-1" style={{ color: 'var(--color-accent)' }}>Address</p>
                        <p className="text-sm" style={{ color: '#777' }}>{store.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="text-[9px] tracking-[3px] uppercase mb-1" style={{ color: 'var(--color-accent)' }}>Hours</p>
                        <p className="text-sm" style={{ color: '#777' }}>{store.openingHours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="text-[9px] tracking-[3px] uppercase mb-1" style={{ color: 'var(--color-accent)' }}>Phone</p>
                        <a href={`tel:${store.phone}`} className="text-sm hover:text-white transition-colors" style={{ color: '#777' }}>{store.phone}</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="text-[9px] tracking-[3px] uppercase mb-1" style={{ color: 'var(--color-accent)' }}>Email</p>
                        <a href={`mailto:${store.email}`} className="text-sm hover:text-white transition-colors" style={{ color: '#777' }}>{store.email}</a>
                      </div>
                    </div>
                  </div>
                  <a href={store.mapLink} target="_blank" rel="noopener noreferrer" className="btn-luxury text-xs">
                    <MapPin size={13} />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
