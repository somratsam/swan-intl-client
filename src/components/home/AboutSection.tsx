'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBrands, useStores } from '@/hooks/useApi';

function StatValue({ isLoading, isError, value }: { isLoading: boolean; isError: boolean; value: number | undefined }) {
  if (isLoading) return <span className="skeleton inline-block h-10 w-14 rounded-sm" />;
  if (isError || value === undefined) return <>–</>;
  return <>{value}</>;
}

export default function AboutSection() {
  const { data: brands, isLoading: brandsLoading, isError: brandsError } = useBrands();
  const { data: stores, isLoading: storesLoading, isError: storesError } = useStores();
  const activeStoreCount = stores?.filter((s) => s.isActive).length;

  return (
    <section className="py-28 px-6 overflow-hidden" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75 }}
          >
            <p className="text-[10px] tracking-[5px] uppercase mb-5" style={{ color: '#C9A84C' }}>
              Our Story
            </p>
            <h2
              className="text-4xl md:text-5xl font-normal leading-tight mb-8"
              style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
            >
              Italy's Finest,{' '}
              <br />
              <em>Brought to Muscat</em>
            </h2>
            <p className="text-sm leading-loose mb-5" style={{ color: '#777' }}>
              Swan International is Oman's premier destination for luxury Italian fashion. Founded
              under the vision of H.H. Aliya Bint Thuwainy Al Said, we have carefully curated a
              portfolio of Italy's most distinguished fashion houses.
            </p>
            <p className="text-sm leading-loose mb-10" style={{ color: '#777' }}>
              From the timeless elegance of MAX&Co to the bold sophistication of LIU.JO Woman,
              each brand represents a distinct facet of Italian luxury. Our boutiques across
              Muscat offer an unparalleled experience for the discerning fashion connoisseur.
            </p>
            <Link href="/about" className="btn-luxury">
              Discover Our Story
            </Link>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="grid grid-cols-3 gap-px"
            style={{ background: '#1a1a1a' }}
          >
            <div className="flex flex-col items-center justify-center p-8 md:p-12" style={{ background: '#0d0d0d' }}>
              <span className="text-5xl font-light mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}>
                <StatValue isLoading={brandsLoading} isError={brandsError} value={brands?.length} />
              </span>
              <span className="text-[9px] tracking-[3px] uppercase text-center" style={{ color: '#555' }}>
                Italian Brands
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 md:p-12" style={{ background: '#0d0d0d' }}>
              <span className="text-5xl font-light mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}>
                <StatValue isLoading={storesLoading} isError={storesError} value={activeStoreCount} />
              </span>
              <span className="text-[9px] tracking-[3px] uppercase text-center" style={{ color: '#555' }}>
                Muscat Locations
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 md:p-12" style={{ background: '#0d0d0d' }}>
              <span className="text-5xl font-light mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}>
                10+
              </span>
              <span className="text-[9px] tracking-[3px] uppercase text-center" style={{ color: '#555' }}>
                Years of Luxury
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
