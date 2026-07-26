'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
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

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); router.push('/'); };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.96)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span
              className="text-xl font-bold tracking-[3px] uppercase"
              style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}
            >
              Swan
            </span>
            <span
              className="text-[8px] tracking-[5px] uppercase"
              style={{ color: '#666', marginTop: '-1px' }}
            >
              International
            </span>
          </Link>

          {/* Desktop links — visible at lg+ */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-[10px] xl:text-[11px] tracking-[1.5px] xl:tracking-[2px] uppercase font-medium transition-colors duration-200"
                    style={{ color: isActive ? '#C9A84C' : '#aaa' }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px"
                        style={{ background: '#C9A84C' }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right — admin controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAdmin && user ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-[10px] tracking-[2px] uppercase px-4 py-2 border transition-all duration-200 hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C]"
                  style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[10px] tracking-[2px] uppercase transition-colors hover:text-white"
                  style={{ color: '#555' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="text-[10px] tracking-[2px] uppercase px-4 py-2 border transition-all duration-200 hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C]"
                style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Hamburger — mobile/tablet only */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ color: '#C9A84C' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile / Tablet menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: '#0a0a0a' }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-8 h-16 border-b" style={{ borderColor: '#1a1a1a' }}>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}>Swan</span>
                <span className="text-[8px] tracking-[5px] uppercase" style={{ color: '#555' }}>International</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ color: '#C9A84C' }} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-8">
              <ul className="space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className="block py-3 text-2xl font-light tracking-wide border-b transition-colors duration-200"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          color: isActive ? '#C9A84C' : '#ccc',
                          borderColor: '#0f0f0f',
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}

                {/* Admin link in mobile menu */}
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.04, duration: 0.3 }}
                >
                  {isAdmin && user ? (
                    <Link
                      href="/admin/dashboard"
                      className="block py-3 text-2xl font-light tracking-wide"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/admin/login"
                      className="block py-3 text-2xl font-light tracking-wide"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#C9A84C' }}
                    >
                      Admin Login
                    </Link>
                  )}
                </motion.li>
              </ul>
            </nav>

            {/* Footer bar */}
            <div className="px-8 py-6 border-t flex items-center justify-between" style={{ borderColor: '#1a1a1a' }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#333' }}>Muscat, Oman</p>
              {isAdmin && user && (
                <button
                  onClick={handleLogout}
                  className="text-xs tracking-[2px] uppercase transition-colors hover:text-red-400"
                  style={{ color: '#555' }}
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
