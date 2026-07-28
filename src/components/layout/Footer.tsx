'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useBrands, useStores } from '@/hooks/useApi';

const quickLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Brands',       href: '/brands' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Offers',       href: '/offers' },
  { label: 'Events',       href: '/events' },
  { label: 'Stores',       href: '/stores' },
  { label: 'Products',     href: '/products' },
  { label: 'Jobs',         href: '/jobs' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

const social = [
  { icon: FaInstagram, href: 'https://instagram.com/swanintloman', label: 'Instagram' },
  { icon: FaFacebook,  href: 'https://facebook.com/swanintloman',  label: 'Facebook' },
  { icon: FaWhatsapp,  href: 'https://wa.me/96824184792',          label: 'WhatsApp' },
];

export default function Footer() {
  const pathname = usePathname();
  const { data: brands, isLoading: brandsLoading, isError: brandsError } = useBrands();
  const { data: stores, isLoading: storesLoading, isError: storesError } = useStores();
  const activeStores = stores?.filter((s) => s.isActive);

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ background: 'var(--color-subtle-bg)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-text)' }}
              >
                <Image src="/swan-logo.png" alt="" width={28} height={20} />
              </span>
              <div>
                <h2
                  className="text-2xl font-bold tracking-[3px] uppercase"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-accent)' }}
                >
                  Swan
                </h2>
                <p className="text-[8px] tracking-[6px] uppercase mt-1" style={{ color: '#444' }}>
                  International
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-dim)', lineHeight: '1.75' }}>
              Luxury Italian fashion retailer in Muscat, Oman. Curating Europe's
              finest labels for the discerning connoisseur.
            </p>
            <p className="text-[10px] tracking-[3px] uppercase" style={{ color: 'var(--color-accent)' }}>
              Muscat, Sultanate of Oman
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              {social.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'var(--color-text-dim)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          {brandsLoading && (
            <div>
              <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>
                Our Brands
              </h4>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-3 w-3/4 rounded-sm" />
                ))}
              </div>
            </div>
          )}
          {!brandsLoading && !brandsError && brands && brands.length > 0 && (
            <div>
              <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>
                Our Brands
              </h4>
              <ul className="space-y-2.5">
                {brands.map((brand) => (
                  <li key={brand._id}>
                    <Link
                      href={`/brands/${brand._id}`}
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: 'var(--color-text-dim)' }}
                    >
                      {brand.brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stores */}
          {storesLoading && (
            <div>
              <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>
                Our Stores
              </h4>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-3 w-3/4 rounded-sm" />
                ))}
              </div>
            </div>
          )}
          {!storesLoading && !storesError && activeStores && activeStores.length > 0 && (
            <div>
              <h4 className="text-[10px] tracking-[3px] uppercase font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>
                Our Stores
              </h4>
              <ul className="space-y-2.5">
                {activeStores.map((store) => (
                  <li key={store._id}>
                    <Link
                      href="/stores"
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: 'var(--color-text-dim)' }}
                    >
                      {store.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider-gold mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#333' }}>
            © {new Date().getFullYear()} Swan International. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: '#333' }}>
            CEO: H.H. Aliya Bint Thuwainy Al Said
          </p>
        </div>
      </div>
    </footer>
  );
}
