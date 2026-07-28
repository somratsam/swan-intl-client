'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function EventsPageClient() {
  const { data: events, isLoading, isError, refetch } = useEvents();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(events?.map((e) => e.category) ?? []))];
  const filtered = activeCategory === 'All' ? events : events?.filter((e) => e.category === activeCategory);

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-dark-bg))' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Experiences</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          Events
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {!isLoading && !isError && categories.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-[10px] tracking-[2px] uppercase px-5 py-2 transition-all duration-200"
                style={{
                  border: `1px solid ${activeCategory === cat ? 'var(--color-accent-deep)' : 'var(--color-border)'}`,
                  background: activeCategory === cat ? 'var(--color-accent-deep)' : 'transparent',
                  color: activeCategory === cat ? 'var(--color-text)' : '#777',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading && <GridSkeleton count={6} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && events && events.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No events available.
          </p>
        )}

        {!isLoading && !isError && events && events.length > 0 && filtered && filtered.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No events found in this category.
          </p>
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-hover group"
              >
                <Link href={`/events/${event._id}`} className="block" style={{ background: 'var(--color-card-bg)' }}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                    <span className="absolute top-4 left-4 text-[9px] tracking-[2px] uppercase px-3 py-1 font-semibold" style={{ background: 'rgba(74,37,69,0.9)', color: 'var(--color-text)' }}>
                      {event.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-5 mb-4">
                      <div className="text-center min-w-[40px]">
                        <p className="text-2xl font-bold leading-none" style={{ color: 'var(--color-accent)', fontFamily: 'Playfair Display, serif' }}>
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: '#666' }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div className="w-px h-9" style={{ background: 'var(--color-border)' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#777' }}>{event.time.start} — {event.time.end}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>{event.location.city}, {event.location.country}</p>
                      </div>
                    </div>
                    <h2 className="text-lg font-normal line-clamp-2 mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
                      {event.title}
                    </h2>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-dim)' }}>{event.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
