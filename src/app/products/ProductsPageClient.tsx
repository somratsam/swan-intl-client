'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useProducts } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { optimizeImage } from '@/lib/image';

export default function ProductsPageClient() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products?.map((p) => p.category) ?? []))];
  const filtered = activeCategory === 'All' ? products : products?.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-dark-bg))' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Collections</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          Products
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
        <motion.a
          href="https://swan-intl.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase mt-6 transition-colors hover:text-white"
          style={{ color: 'var(--color-accent)' }}
        >
          Shop the Collection at swan-intl.com <ExternalLink size={11} />
        </motion.a>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28">
        {!isLoading && categories.length > 1 && (
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

        {isLoading && <GridSkeleton count={8} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && products && products.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No products available.
          </p>
        )}

        {!isLoading && !isError && products && products.length > 0 && filtered && filtered.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No products found in this category.
          </p>
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.6) }}
                className="card-hover group"
              >
                <Link href={`/products/${product._id}`} className="block" style={{ background: 'var(--color-card-bg)' }}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={optimizeImage(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.25)' }} />
                    <span className="absolute top-3 right-3 text-[9px] tracking-[2px] uppercase px-2 py-1 font-semibold" style={{ background: 'rgba(74,37,69,0.88)', color: 'var(--color-text)' }}>
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h2 className="text-sm font-normal line-clamp-2" style={{ fontFamily: 'Playfair Display, serif', color: '#ddd' }}>
                      {product.name}
                    </h2>
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
