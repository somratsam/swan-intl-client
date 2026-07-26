'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBrands } from '@/hooks/useApi';
import SectionTitle from '@/components/ui/SectionTitle';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function BrandsSection() {
  const { data: brands, isLoading, isError, refetch } = useBrands();

  return (
    <section className="py-28 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Our Portfolio"
          title="Iconic Italian Brands"
          subtitle="We represent six of Italy's most prestigious fashion houses, bringing European elegance to the heart of Muscat."
        />

        {isLoading && <GridSkeleton count={6} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && brands && brands.length === 0 && (
          <p className="text-center py-16" style={{ color: '#555' }}>
            No brands available.
          </p>
        )}

        {!isLoading && !isError && brands && brands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#1a1a1a' }}>
            {brands.map((brand, i) => (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
              >
                <Link
                  href={`/brands/${brand._id}`}
                  className="group block relative overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={brand.brandImage}
                    alt={brand.brand}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                    <h3
                      className="text-xl font-normal mb-2"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
                    >
                      {brand.brand}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: '#C9A84C' }}
                    >
                      Explore <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
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
          <Link href="/brands" className="btn-luxury">
            View All Brands
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
