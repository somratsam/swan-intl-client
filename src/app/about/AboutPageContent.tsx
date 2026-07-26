'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const brands = [
  { name: 'MAX&Co',                      desc: 'The contemporary label from the Max Mara Fashion Group, offering accessible luxury with timeless Italian design.' },
  { name: 'Pennyblack',                  desc: 'Sophisticated, feminine Italian fashion that balances tradition with modern sensibility.' },
  { name: 'LIU.JO Woman',               desc: 'Glamorous and distinctly Italian, LIU JO brings bold femininity and premium craftsmanship.' },
  { name: 'Furla',                       desc: 'Iconic Italian leather goods and accessories — handbags, shoes, and jewellery crafted to last a lifetime.' },
  { name: 'Marella',                     desc: 'A Max Mara Group label offering wearable luxury with an effortlessly modern aesthetic.' },
  { name: 'United Colors of Benetton',   desc: 'The globally beloved Italian brand known for vibrant colour, quality knitwear, and global perspective.' },
];

const stores = [
  { name: 'City Centre Muscat',               desc: 'Our flagship boutique in one of Muscat\'s most prestigious retail destinations.' },
  { name: 'Al Araimi Boulevard — Swan Galleria', desc: 'A multi-brand luxury gallery in the heart of Al Araimi Boulevard.' },
  { name: 'Mall of Oman',                     desc: 'Bringing Italian elegance to Oman\'s largest shopping destination.' },
  { name: 'Furla at City Centre',             desc: 'A dedicated Furla boutique showcasing the full leather goods collection.' },
  { name: 'Ventisei at Mall of Oman',         desc: 'A curated multi-brand concept store at Mall of Oman.' },
];

const fade = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };

export default function AboutPageContent() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-6 py-48"
        style={{ background: 'linear-gradient(135deg, #000 0%, #0d0d0d 50%, #000 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.055) 0%, transparent 65%)' }}
        />
        <motion.p {...fade} className="text-[10px] tracking-[6px] uppercase mb-6 relative z-10" style={{ color: '#C9A84C' }}>
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-normal max-w-4xl leading-tight relative z-10"
          style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
        >
          Swan <em>International</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 text-xs tracking-[5px] uppercase relative z-10"
          style={{ color: '#555' }}
        >
          Muscat, Sultanate of Oman
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* Company Story */}
        <motion.section {...fade} transition={{ duration: 0.7 }} className="mb-20">
          <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Who We Are</p>
          <h2 className="text-3xl font-normal mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            A Vision for Italian Luxury in Oman
          </h2>
          <p className="text-base leading-loose mb-5" style={{ color: '#777' }}>
            Swan International is Oman's premier destination for luxury Italian fashion. We are proud to represent
            six of Italy's most prestigious and beloved fashion houses — bringing the finest European craftsmanship
            to the discerning connoisseurs of Muscat.
          </p>
          <p className="text-base leading-loose mb-5" style={{ color: '#777' }}>
            Founded under the distinguished vision of H.H. Aliya Bint Thuwainy Al Said, Swan International was
            born from a deep passion for Italian fashion, art, and culture. Our mission has always been simple:
            to make authentic Italian luxury accessible, personal, and extraordinary for the people of Oman.
          </p>
          <p className="text-base leading-loose" style={{ color: '#777' }}>
            Over the years, we have grown from a singular boutique to a network of five curated retail spaces
            across Muscat, each thoughtfully designed to reflect the elegance and refinement of the brands we carry.
          </p>
        </motion.section>

        <div className="divider-gold mb-20" />

        {/* CEO */}
        <motion.section {...fade} transition={{ duration: 0.7 }} className="mb-20 p-10 border" style={{ background: '#0d0d0d', borderColor: 'rgba(201,168,76,0.15)' }}>
          <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Leadership</p>
          <h2 className="text-3xl font-normal mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            H.H. Aliya Bint Thuwainy Al Said
          </h2>
          <p className="text-sm mb-7" style={{ color: '#C9A84C' }}>Founder & Chief Executive Officer</p>
          <p className="text-base leading-loose" style={{ color: '#777' }}>
            Her Highness Aliya Bint Thuwainy Al Said is the visionary force behind Swan International. With a profound
            appreciation for Italian culture and fashion, she established Swan International to bring the world's
            finest Italian labels to the Sultanate of Oman. Under her leadership, the company has grown into the most
            respected luxury fashion retailer in Muscat, renowned for its impeccable curation and exceptional
            customer experience.
          </p>
        </motion.section>

        <div className="divider-gold mb-20" />

        {/* Our Brands */}
        <motion.section {...fade} transition={{ duration: 0.7 }} className="mb-20">
          <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Our Portfolio</p>
          <h2 className="text-3xl font-normal mb-10" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            Six Iconic Italian Brands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 border"
                style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}
              >
                <h3 className="text-lg font-normal mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{brand.name}</h3>
                <p className="text-sm leading-loose" style={{ color: '#666' }}>{brand.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/brands" className="btn-luxury">Explore All Brands</Link>
          </div>
        </motion.section>

        <div className="divider-gold mb-20" />

        {/* Our Stores */}
        <motion.section {...fade} transition={{ duration: 0.7 }} className="mb-20">
          <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Our Locations</p>
          <h2 className="text-3xl font-normal mb-10" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            Five Boutiques Across Muscat
          </h2>
          <div className="space-y-4">
            {stores.map((store, i) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-6 p-6 border"
                style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}
              >
                <span
                  className="text-xl font-light mt-0.5 shrink-0"
                  style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif', minWidth: '32px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-normal mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>{store.name}</h3>
                  <p className="text-sm" style={{ color: '#666' }}>{store.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/stores" className="btn-luxury">View All Stores</Link>
          </div>
        </motion.section>

        <div className="divider-gold mb-20" />

        {/* Mission / Vision */}
        <motion.section {...fade} transition={{ duration: 0.7 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
              <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Our Mission</p>
              <p className="text-base leading-loose" style={{ color: '#777' }}>
                To curate and deliver the finest Italian fashion experiences to the people of Oman, combining
                world-class brands with unparalleled personal service in beautifully designed retail spaces.
              </p>
            </div>
            <div className="p-8 border" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
              <p className="text-[10px] tracking-[4px] uppercase mb-5" style={{ color: '#C9A84C' }}>Our Vision</p>
              <p className="text-base leading-loose" style={{ color: '#777' }}>
                To be recognised as the undisputed home of Italian luxury fashion in the Gulf region — a brand
                synonymous with excellence, elegance, and authentic Italian culture.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
