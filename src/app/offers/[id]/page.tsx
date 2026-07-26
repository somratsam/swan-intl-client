'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { useOfferById } from '@/hooks/useApi';
import { DetailSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading, isError, refetch } = useOfferById(id);

  if (isLoading) return <DetailSkeleton />;
  if (isError)   return <ErrorMessage onRetry={refetch} />;
  if (!offer)    return null;

  const active = new Date(offer.dateRange.endDate) >= new Date();

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={offer.image} alt={offer.title} fill priority className="object-cover" sizes="100vw" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 100%)' }}
        />
        <Link
          href="/offers"
          className="absolute top-24 left-6 z-20 flex items-center gap-2 text-xs tracking-[2px] uppercase hover:text-white transition-colors"
          style={{ color: '#888' }}
        >
          <ArrowLeft size={14} /> All Offers
        </Link>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10">
          <span
            className="text-[9px] tracking-[3px] uppercase px-4 py-2 mb-5 font-semibold"
            style={{ background: active ? '#C9A84C' : '#1a1a1a', color: active ? '#000' : '#555' }}
          >
            {active ? 'Active Offer' : 'Expired'}
          </span>
          <h1 className="text-4xl md:text-5xl font-normal max-w-3xl" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            {offer.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Date range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-10 mb-12 pb-12 border-b"
          style={{ borderColor: '#1a1a1a' }}
        >
          <div>
            <p className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#C9A84C' }}>Start Date</p>
            <p className="text-lg" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
              {new Date(offer.dateRange.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#C9A84C' }}>End Date</p>
            <p className="text-lg" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
              {new Date(offer.dateRange.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {offer.tags.map((tag) => (
              <span key={tag} className="text-[9px] tracking-[2px] uppercase px-3 py-1.5" style={{ border: '1px solid #1e1e1e', color: '#555' }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-base leading-loose" style={{ color: '#888', lineHeight: '1.85' }}>{offer.description}</p>
        </motion.div>

        {/* Exclusive Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { label: 'Loyalty Rewards', value: offer.exclusiveOfferDetails.loyaltyRewards },
            { label: 'Gift Vouchers',   value: offer.exclusiveOfferDetails.giftVouchers   },
            { label: 'Special Events',  value: offer.exclusiveOfferDetails.specialEvents  },
          ].map(({ label, value }) => (
            <div key={label} className="p-6 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
              <p className="text-[9px] tracking-[3px] uppercase mb-3" style={{ color: '#C9A84C' }}>{label}</p>
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Store + Social */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
            <p className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: '#C9A84C' }}>Store Details</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <p className="text-sm" style={{ color: '#777' }}>{offer.location.address}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} style={{ color: '#C9A84C' }} />
                <p className="text-sm" style={{ color: '#777' }}>{offer.contact.phone}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={13} style={{ color: '#C9A84C' }} />
                <p className="text-sm" style={{ color: '#777' }}>{offer.contact.email}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={13} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                <p className="text-sm" style={{ color: '#777' }}>{offer.contact.storeHours}</p>
              </div>
            </div>
          </div>
          <div className="p-8 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
            <p className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: '#C9A84C' }}>Social Media</p>
            <div className="space-y-4">
              {offer.social_media.instagram && (
                <a href={offer.social_media.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: '#777' }}>
                  <FaInstagram size={15} /> Instagram
                </a>
              )}
              {offer.social_media.facebook && (
                <a href={offer.social_media.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: '#777' }}>
                  <FaFacebook size={15} /> Facebook
                </a>
              )}
              {offer.social_media.twitter && (
                <a href={offer.social_media.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: '#777' }}>
                  <span style={{ color: '#C9A84C', fontSize: '14px' }}>𝕏</span> Twitter
                </a>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
