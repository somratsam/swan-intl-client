'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBrands } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function BrandsPageClient() {
  const { data: brands, isLoading, isError, refetch } = useBrands();

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="pt-40 pb-20 px-6 text-center"
        style={{ background: 'linear-gradient(to bottom, #000, #0a0a0a)' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] tracking-[5px] uppercase mb-4"
          style={{ color: '#C9A84C' }}
        >
          Our Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-normal"
          style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
        >
          Our Brands
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="divider-gold w-20 mx-auto mt-8"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {isLoading && <GridSkeleton count={6} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && brands && brands.length === 0 && (
          <p className="text-center py-16" style={{ color: '#555' }}>
            No brands available.
          </p>
        )}

        {!isLoading && !isError && brands && brands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, i) => (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-hover group"
              >
                <Link href={`/brands/${brand._id}`} className="block" style={{ background: '#111' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={brand.brandImage}
                      alt={brand.brand}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                      }}
                    />
                    {brand.brandLogo && (
                      <div className="absolute top-4 left-4">
                        <Image
                          src={brand.brandLogo}
                          alt={`${brand.brand} logo`}
                          width={80}
                          height={40}
                          className="object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2
                      className="text-xl font-normal mb-3"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
                    >
                      {brand.brand}
                    </h2>
                    <p className="text-sm line-clamp-3 mb-4" style={{ color: '#777', lineHeight: '1.7' }}>
                      {brand.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {brand.features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[9px] tracking-[2px] uppercase px-2 py-1"
                          style={{ border: '1px solid #222', color: '#555' }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase transition-colors duration-200 group-hover:text-white"
                      style={{ color: '#C9A84C' }}
                    >
                      Explore Brand <ArrowRight size={11} />
                    </span>
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
