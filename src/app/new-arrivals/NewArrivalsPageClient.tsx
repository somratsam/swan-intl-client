'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNewArrivals } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function NewArrivalsPageClient() {
  const { data: arrivals, isLoading, isError, refetch } = useNewArrivals();
  const [activeBrand, setActiveBrand] = useState('All');

  const brands = ['All', ...Array.from(new Set(arrivals?.map((a) => a.brand) ?? []))];
  const filtered = activeBrand === 'All' ? arrivals : arrivals?.filter((a) => a.brand === activeBrand);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #000, #0a0a0a)' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: '#C9A84C' }}>Fresh In</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
          New Arrivals
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {!isLoading && brands.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className="text-[10px] tracking-[2px] uppercase px-5 py-2 transition-all duration-200"
                style={{
                  border: `1px solid ${activeBrand === brand ? '#C9A84C' : '#1e1e1e'}`,
                  background: activeBrand === brand ? '#C9A84C' : 'transparent',
                  color: activeBrand === brand ? '#000' : '#777',
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {isLoading && <GridSkeleton count={12} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && arrivals && arrivals.length === 0 && (
          <p className="text-center py-16" style={{ color: '#555' }}>
            No new arrivals available.
          </p>
        )}

        {!isLoading && !isError && arrivals && arrivals.length > 0 && filtered && filtered.length === 0 && (
          <p className="text-center py-16" style={{ color: '#555' }}>
            No new arrivals found for this brand.
          </p>
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: '#111' }}>
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.3)' }} />
                </div>
                <p className="text-[9px] tracking-[3px] uppercase mb-1" style={{ color: '#C9A84C' }}>{item.brand}</p>
                <p className="text-xs line-clamp-2" style={{ color: '#666' }}>{item.caption}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
