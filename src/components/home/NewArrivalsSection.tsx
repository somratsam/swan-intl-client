'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useNewArrivals } from '@/hooks/useApi';
import SectionTitle from '@/components/ui/SectionTitle';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function NewArrivalsSection() {
  const { data: arrivals, isLoading, isError, refetch } = useNewArrivals();
  const preview = arrivals?.slice(0, 6);

  return (
    <section className="py-28 px-6" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Fresh In"
          title="New Arrivals"
          subtitle="The latest pieces from our curated Italian collections, arriving fresh to our Muscat boutiques."
        />

        {isLoading && <GridSkeleton count={6} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && preview && preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {preview.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden mb-3"
                  style={{ background: '#111' }}
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  />
                </div>
                <p
                  className="text-[9px] tracking-[3px] uppercase mb-1"
                  style={{ color: '#C9A84C' }}
                >
                  {item.brand}
                </p>
                <p className="text-xs line-clamp-2" style={{ color: '#666' }}>
                  {item.caption}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/new-arrivals" className="btn-luxury">
            See All New Arrivals
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
