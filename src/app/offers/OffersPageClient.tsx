'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useOffers } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { optimizeImage } from '@/lib/image';

const isActive = (endDate: string) => new Date(endDate) >= new Date();

export default function OffersPageClient() {
  const { data: offers, isLoading, isError, refetch } = useOffers();

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div
        className="pt-40 pb-20 px-6 text-center"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-dark-bg))' }}
      >
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
          Exclusive
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          Current Offers
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {isLoading && <GridSkeleton count={6} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && offers && offers.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No offers available.
          </p>
        )}

        {!isLoading && !isError && offers && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => {
              const active = isActive(offer.dateRange.endDate);
              return (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card-hover group"
                >
                  <Link href={`/offers/${offer._id}`} className="block" style={{ background: 'var(--color-card-bg)' }}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={optimizeImage(offer.image)}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                      <span
                        className="absolute top-4 right-4 text-[9px] tracking-[2px] uppercase px-3 py-1 font-semibold"
                        style={{ background: active ? 'var(--color-accent-deep)' : 'var(--color-border)', color: active ? 'var(--color-text)' : 'var(--color-text-dim)' }}
                      >
                        {active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {offer.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] tracking-[2px] uppercase px-2 py-1" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-lg font-normal mb-3 line-clamp-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
                        {offer.title}
                      </h2>
                      <p className="text-xs" style={{ color: '#666' }}>
                        {new Date(offer.dateRange.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {' — '}
                        {new Date(offer.dateRange.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
