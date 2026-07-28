'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEvents } from '@/hooks/useApi';
import SectionTitle from '@/components/ui/SectionTitle';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function EventsSection() {
  const { data: events, isLoading, isError, refetch } = useEvents();
  const preview = events?.slice(0, 3);

  return (
    <section className="py-28 px-6" style={{ background: 'var(--color-subtle-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Experiences"
          title="Upcoming Events"
          subtitle="Be part of exclusive fashion events, private viewings, and curated experiences across our Muscat boutiques."
        />

        {isLoading && <GridSkeleton count={3} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && preview && preview.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1 }}
                className="card-hover group"
                style={{ background: 'var(--color-card-bg)' }}
              >
                <Link href={`/events/${event._id}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)',
                      }}
                    />
                    <span
                      className="absolute top-4 left-4 text-[9px] tracking-[2px] uppercase px-3 py-1 font-semibold"
                      style={{ background: 'rgba(74,37,69,0.92)', color: 'var(--color-text)' }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center min-w-[40px]">
                        <p
                          className="text-2xl font-bold leading-none"
                          style={{ color: 'var(--color-accent)', fontFamily: 'Playfair Display, serif' }}
                        >
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: '#666' }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div className="w-px h-9" style={{ background: 'var(--color-border)' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#777' }}>
                          {event.time.start} — {event.time.end}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
                          {event.location.city}
                        </p>
                      </div>
                    </div>
                    <h3
                      className="text-lg font-normal line-clamp-2"
                      style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
                    >
                      {event.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !isError && preview && preview.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No events available.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/events" className="btn-luxury">
            View All Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
