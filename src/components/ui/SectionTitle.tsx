'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      className={clsx('mb-14', centered && 'text-center')}
    >
      {eyebrow && (
        <p
          className="text-[10px] font-semibold tracking-[5px] uppercase mb-4"
          style={{ color: '#C9A84C' }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight"
        style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-5 text-sm md:text-base leading-relaxed max-w-2xl',
            centered && 'mx-auto'
          )}
          style={{ color: '#777', lineHeight: '1.8' }}
        >
          {subtitle}
        </p>
      )}
      <div
        className={clsx('mt-6 divider-gold w-20', centered && 'mx-auto')}
      />
    </motion.div>
  );
}
