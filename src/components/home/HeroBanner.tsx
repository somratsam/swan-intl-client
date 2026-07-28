'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useApi';
import { HeroSkeleton } from '@/components/ui/LoadingSkeleton';
import { optimizeImage } from '@/lib/image';

export default function HeroBanner() {
  const { data: banners, isLoading } = useBanners();
  const [current,    setCurrent]    = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const items = banners?.filter((b) => b.isActive) ?? [];
  const total = items.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % Math.max(total, 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, total]);

  if (isLoading) return <HeroSkeleton />;

  /* ── Fallback when no banners ── */
  if (total === 0) {
    return (
      <div
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark-bg) 50%, var(--color-primary) 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(139,111,140,0.06) 0%, transparent 65%)',
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] tracking-[7px] uppercase mb-7"
            style={{ color: 'var(--color-accent)' }}
          >
            Muscat, Sultanate of Oman
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-normal leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
          >
            Swan <em>International</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs sm:text-sm tracking-[5px] uppercase"
            style={{ color: '#666' }}
          >
            Luxury Italian Fashion
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[4px] uppercase" style={{ color: '#444' }}>Scroll</span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, var(--color-accent), transparent)' }} />
        </motion.div>
      </div>
    );
  }

  /* ── Banner carousel ── */
  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <Image
            src={optimizeImage(items[current].image)}
            alt={items[current].title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* Text scrim — dark band behind the text, fading toward the top/bottom edges */}
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.55) 80%, transparent 100%)',
        }}
      />

      {/* Text */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`txt-${current}`}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.75 }}
            className="max-w-4xl"
          >
            <p className="text-[10px] tracking-[7px] uppercase mb-5" style={{ color: 'var(--color-text)' }}>
              Swan International
            </p>
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-normal leading-tight mb-5"
              style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}
            >
              {items[current].title}
            </h1>
            {items[current].subtitle && (
              <p
                className="text-xs sm:text-sm tracking-[4px] uppercase max-w-lg mx-auto"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {items[current].subtitle}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text)' }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3 items-center">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-400"
              style={{
                width:  i === current ? '28px' : '6px',
                height: '2px',
                background: i === current ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 right-8 z-30 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, var(--color-accent), transparent)' }} />
        <span className="text-[9px] tracking-[3px] uppercase" style={{ color: 'var(--color-text-dim)' }}>Scroll</span>
      </motion.div>
    </div>
  );
}
