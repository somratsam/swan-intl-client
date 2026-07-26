'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useOffers } from '@/hooks/useApi';
import SectionTitle from '@/components/ui/SectionTitle';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const isActive = (endDate: string) => new Date(endDate) >= new Date();

export default function OffersSection() {
  const { data: offers, isLoading, isError, refetch } = useOffers();
  const preview = offers?.slice(0, 3);

  return (
    <section className="py-28 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Exclusive"
          title="Current Offers"
          subtitle="Discover limited-time offers and exclusive deals at our Muscat boutiques."
        />

        {isLoading && <GridSkeleton count={3} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && preview && preview.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((offer, i) => {
              const active = isActive(offer.dateRange.endDate);
              return (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover"
                >
                  <Link
                    href={`/offers/${offer._id}`}
                    className="group block"
                    style={{ background: '#111' }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                        }}
                      />
                      <span
                        className="absolute top-4 right-4 text-[9px] tracking-[2px] uppercase px-3 py-1 font-semibold"
                        style={{
                          background: active ? '#C9A84C' : '#1a1a1a',
                          color: active ? '#000' : '#555',
                        }}
                      >
                        {active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {offer.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] tracking-[2px] uppercase px-2 py-1"
                            style={{ border: '1px solid #222', color: '#666' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3
                        className="text-lg font-normal mb-3 line-clamp-2"
                        style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
                      >
                        {offer.title}
                      </h3>
                      <p className="text-xs" style={{ color: '#666' }}>
                        Until{' '}
                        {new Date(offer.dateRange.endDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && preview && preview.length === 0 && (
          <p className="text-center py-16" style={{ color: '#555' }}>
            No offers available.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/offers" className="btn-luxury">
            View All Offers
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
