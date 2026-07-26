'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { useStores } from '@/hooks/useApi';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ContactPageContent() {
  const { data: stores, isLoading, isError, refetch } = useStores();
  const activeStores = stores?.filter((s) => s.isActive);
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #000, #0a0a0a)' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: '#C9A84C' }}>Get In Touch</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
          Contact Us
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Store Contacts */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase mb-8" style={{ color: '#C9A84C' }}>Our Boutiques</p>

            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-6 border space-y-3" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
                    <div className="skeleton h-4 w-1/2 rounded-sm" />
                    <div className="skeleton h-3 w-full rounded-sm" />
                    <div className="skeleton h-3 w-2/3 rounded-sm" />
                    <div className="skeleton h-3 w-2/3 rounded-sm" />
                    <div className="skeleton h-3 w-1/2 rounded-sm" />
                  </div>
                ))}
              </div>
            )}

            {isError && <ErrorMessage onRetry={refetch} />}

            {!isLoading && !isError && activeStores && activeStores.length === 0 && (
              <p className="text-center py-16" style={{ color: '#555' }}>
                No stores available.
              </p>
            )}

            {!isLoading && !isError && activeStores && activeStores.length > 0 && (
              <div className="space-y-4">
                {activeStores.map((store, i) => (
                  <motion.div
                    key={store._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-6 border"
                    style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}
                  >
                    <h3 className="text-sm font-normal mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{store.name}</h3>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                        <p className="text-xs" style={{ color: '#666' }}>{store.address}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone size={12} style={{ color: '#C9A84C' }} />
                        <a href={`tel:${store.phone}`} className="text-xs hover:text-white transition-colors" style={{ color: '#666' }}>{store.phone}</a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail size={12} style={{ color: '#C9A84C' }} />
                        <a href={`mailto:${store.email}`} className="text-xs hover:text-white transition-colors" style={{ color: '#666' }}>{store.email}</a>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Clock size={12} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                        <p className="text-xs" style={{ color: '#555' }}>{store.openingHours}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Social */}
            <div className="mt-6 p-6 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
              <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Follow Us</p>
              <div className="flex gap-5">
                <a href="https://instagram.com/swanintloman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors" style={{ color: '#666' }}>
                  <FaInstagram size={16} /> Instagram
                </a>
                <a href="https://facebook.com/swanintloman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors" style={{ color: '#666' }}>
                  <FaFacebook size={16} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-[10px] tracking-[4px] uppercase mb-8" style={{ color: '#C9A84C' }}>Send A Message</p>

            {submitted ? (
              <div className="p-10 border text-center" style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.2)' }}>
                <div className="w-14 h-14 flex items-center justify-center border mx-auto mb-6" style={{ borderColor: '#C9A84C' }}>
                  <svg width="20" height="20" fill="none" stroke="#C9A84C" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-normal mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>Message Sent</h3>
                <p className="text-sm mb-8" style={{ color: '#666' }}>Thank you for reaching out. We will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-luxury mx-auto">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: 'name',    label: 'Full Name',      type: 'text'  },
                  { id: 'email',   label: 'Email Address',  type: 'email' },
                  { id: 'subject', label: 'Subject',        type: 'text'  },
                ].map(({ id, label, type }) => (
                  <div key={id}>
                    <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>{label}</label>
                    <input
                      type={type}
                      required
                      value={form[id as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors"
                      style={{ borderColor: '#1e1e1e', color: '#fff' }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[9px] tracking-[3px] uppercase mb-2" style={{ color: '#666' }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-transparent border outline-none focus:border-[#C9A84C] transition-colors resize-none"
                    style={{ borderColor: '#1e1e1e', color: '#fff' }}
                  />
                </div>
                <button type="submit" className="btn-luxury-filled w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
