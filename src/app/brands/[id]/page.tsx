'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { useBrandById } from '@/hooks/useApi';
import { DetailSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: brand, isLoading, isError, refetch } = useBrandById(id);

  if (isLoading) return <DetailSkeleton />;
  if (isError)   return <ErrorMessage onRetry={refetch} />;
  if (!brand)    return null;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Full-screen hero */}
      <div className="relative h-screen overflow-hidden">
        <Image
          src={brand.mainBanner || brand.brandImage}
          alt={brand.brand}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Back link */}
        <Link
          href="/brands"
          className="absolute top-24 left-6 z-20 flex items-center gap-2 text-xs tracking-[2px] uppercase transition-colors hover:text-white"
          style={{ color: '#888' }}
        >
          <ArrowLeft size={14} /> All Brands
        </Link>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center z-10">
          {brand.brandLogo && (
            <Image
              src={brand.brandLogo}
              alt={`${brand.brand} logo`}
              width={150}
              height={75}
              className="object-contain mb-6"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          )}
          <h1
            className="text-5xl md:text-7xl font-normal mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
          >
            {brand.brand}
          </h1>
          <p className="text-xs tracking-[4px] uppercase" style={{ color: '#C9A84C' }}>
            {brand.address}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24">

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[10px] tracking-[4px] uppercase mb-4" style={{ color: '#C9A84C' }}>About</p>
          <h2 className="text-3xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            The Brand Story
          </h2>
          <p className="text-base leading-loose" style={{ color: '#777' }}>{brand.description}</p>
          <div className="divider-gold w-16 mt-8" />
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[10px] tracking-[4px] uppercase mb-4" style={{ color: '#C9A84C' }}>Heritage</p>
          <h2 className="text-3xl font-normal mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            History
          </h2>
          <p className="text-base leading-loose" style={{ color: '#777' }}>{brand.history}</p>
        </motion.section>

        {/* Features */}
        {brand.features.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[4px] uppercase mb-6" style={{ color: '#C9A84C' }}>Highlights</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brand.features.map((f) => (
                <div key={f} className="p-4 border" style={{ borderColor: '#1a1a1a', background: '#0d0d0d' }}>
                  <p className="text-xs tracking-[2px] uppercase" style={{ color: '#777' }}>{f}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Gallery */}
        {brand.gallery.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[4px] uppercase mb-6" style={{ color: '#C9A84C' }}>Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {brand.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden group">
                  <Image
                    src={img}
                    alt={`${brand.brand} gallery ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Store info */}
        <motion.section
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="p-10 border"
          style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}
        >
          <p className="text-[10px] tracking-[4px] uppercase mb-6" style={{ color: '#C9A84C' }}>Store Information</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
              <div>
                <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Address</p>
                <p className="text-sm" style={{ color: '#888' }}>{brand.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
              <div>
                <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Phone</p>
                <a href={`tel:${brand.phone}`} className="text-sm hover:text-white transition-colors" style={{ color: '#888' }}>{brand.phone}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
              <div>
                <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Email</p>
                <a href={`mailto:${brand.email}`} className="text-sm hover:text-white transition-colors" style={{ color: '#888' }}>{brand.email}</a>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
