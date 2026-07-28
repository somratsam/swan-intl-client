'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useStores } from '@/hooks/useApi';
import SectionTitle from '@/components/ui/SectionTitle';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function StoresSection() {
  const { data: stores, isLoading, isError, refetch } = useStores();
  const preview = stores?.filter((s) => s.isActive).slice(0, 3);

  return (
    <section className="py-28 px-6" style={{ background: 'var(--color-dark-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Find Us"
          title="Our Boutiques"
          subtitle="Luxury locations across Muscat, each thoughtfully designed to offer an immersive shopping experience."
        />

        {isLoading && <GridSkeleton count={3} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && preview && preview.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((store, i) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border transition-all duration-300 hover:border-[var(--color-accent)] group"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-6 border transition-colors duration-300 group-hover:border-[var(--color-accent)]"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent)' }}
                >
                  <MapPin size={15} />
                </div>
                <h3
                  className="text-lg font-normal mb-3"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
                >
                  {store.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#777', lineHeight: '1.6' }}>
                  {store.address}
                </p>
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>{store.phone}</p>
                <p className="text-xs mb-7" style={{ color: '#444' }}>{store.openingHours}</p>
                <a
                  href={store.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[2px] uppercase transition-colors duration-200 hover:text-white"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Get Directions →
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !isError && preview && preview.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No stores available.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/stores" className="btn-luxury">
            All Store Locations
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
