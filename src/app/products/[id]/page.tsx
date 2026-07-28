'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useProductById } from '@/hooks/useApi';
import { DetailSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { optimizeImage } from '@/lib/image';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProductById(id);
  const [activeItem,       setActiveItem]       = useState(0);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);

  if (isLoading) return <DetailSkeleton />;
  if (isError)   return <ErrorMessage onRetry={refetch} />;
  if (!product)  return null;

  const currentItem = product.items[activeItem];

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div className="pt-28 pb-24 max-w-7xl mx-auto px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[2px] uppercase mb-12 hover:text-white transition-colors"
          style={{ color: '#666' }}
        >
          <ArrowLeft size={14} /> All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Image column */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[3/4] overflow-hidden mb-4" style={{ background: 'var(--color-card-bg)' }}>
              <Image
                src={optimizeImage(currentItem?.image || product.image)}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {currentItem?.gallery.length > 0 && (
              <div className="flex gap-3">
                {currentItem.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGalleryImg(i)}
                    className="relative w-16 h-16 overflow-hidden border-2 transition-all duration-200"
                    style={{
                      borderColor: activeGalleryImg === i ? 'var(--color-accent)' : 'var(--color-border)',
                    }}
                  >
                    <Image src={optimizeImage(img)} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details column */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] tracking-[4px] uppercase mb-3" style={{ color: 'var(--color-accent)' }}>{product.category}</p>
            <h1 className="text-4xl font-normal mb-4" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
              {product.name}
            </h1>
            <a
              href="https://swan-intl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-filled mb-6"
            >
              Shop the Collection at swan-intl.com <ExternalLink size={14} />
            </a>
            <div className="divider-gold w-16 mb-7" />
            <p className="text-sm leading-loose mb-8" style={{ color: '#777', lineHeight: '1.8' }}>{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {product.tags.map((tag) => (
                <span key={tag} className="text-[9px] tracking-[2px] uppercase px-3 py-1" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Variants */}
            {product.items.length > 1 && (
              <div className="mb-8">
                <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Variants</p>
                <div className="flex flex-wrap gap-3">
                  {product.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveItem(i); setActiveGalleryImg(0); }}
                      className="text-xs px-4 py-2 transition-all duration-200"
                      style={{
                        border: `1px solid ${activeItem === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: activeItem === i ? 'rgba(139,111,140,0.08)' : 'transparent',
                        color: activeItem === i ? 'var(--color-accent)' : '#777',
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Item detail */}
            {currentItem && (
              <div className="p-6 border" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
                <p className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--color-accent)' }}>{currentItem.brand}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{currentItem.description}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
