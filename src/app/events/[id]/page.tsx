'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { useEvents } from '@/hooks/useApi';
import { DetailSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { optimizeImage } from '@/lib/image';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: events, isLoading, isError, refetch } = useEvents();
  const event = events?.find((e) => e._id === id);

  if (isLoading) return <DetailSkeleton />;
  if (isError)   return <ErrorMessage onRetry={refetch} />;
  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--color-dark-bg)' }}>
      <p className="text-sm" style={{ color: '#666' }}>Event not found.</p>
      <Link href="/events" className="btn-luxury">Back to Events</Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      {/* Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={optimizeImage(event.image)} alt={event.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 100%)' }} />
        <Link
          href="/events"
          className="absolute top-24 left-6 z-20 flex items-center gap-2 text-xs tracking-[2px] uppercase hover:text-white transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={14} /> All Events
        </Link>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10">
          <span className="text-[9px] tracking-[3px] uppercase px-4 py-2 mb-5 font-semibold" style={{ background: 'rgba(74,37,69,0.92)', color: 'var(--color-text)' }}>
            {event.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-normal max-w-3xl" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 pb-14 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {[
            { icon: Calendar, label: 'Date',     value: new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { icon: Clock,    label: 'Time',     value: `${event.time.start} — ${event.time.end}` },
            { icon: MapPin,   label: 'Location', value: event.location.city },
            { icon: MapPin,   label: 'Address',  value: event.location.address },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} style={{ color: 'var(--color-accent)' }} />
                <p className="text-[9px] tracking-[3px] uppercase" style={{ color: 'var(--color-accent)' }}>{label}</p>
              </div>
              <p className="text-sm" style={{ color: '#ccc' }}>{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-base leading-loose" style={{ color: 'var(--color-text-muted)', lineHeight: '1.85' }}>{event.description}</p>
        </motion.div>

        {/* Organizer */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 border mb-10" style={{ background: 'var(--color-dark-bg)', borderColor: 'var(--color-border)' }}>
          <p className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: 'var(--color-accent)' }}>Organizer</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Name</p>
              <p className="text-sm" style={{ color: '#ccc' }}>{event.organizer.name}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
              <div>
                <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Email</p>
                <a href={`mailto:${event.organizer.contact}`} className="text-sm hover:text-white transition-colors" style={{ color: '#ccc' }}>{event.organizer.contact}</a>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
              <div>
                <p className="text-[9px] tracking-[2px] uppercase mb-1.5" style={{ color: '#444' }}>Phone</p>
                <a href={`tel:${event.organizer.phone}`} className="text-sm hover:text-white transition-colors" style={{ color: '#ccc' }}>{event.organizer.phone}</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {event.tags.map((tag) => (
            <span key={tag} className="text-[9px] tracking-[2px] uppercase px-4 py-2" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}>
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
