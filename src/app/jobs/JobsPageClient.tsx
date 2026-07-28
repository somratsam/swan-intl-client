'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Mail } from 'lucide-react';
import { useJobs } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const TYPE_COLORS: Record<string, string> = {
  'full-time':  '#e0a05e',
  'part-time':  '#7eb8c9',
  'contract':   '#c97e7e',
  'freelance':  '#9ec97e',
  'internship': '#c9b47e',
  'temporary':  '#b47ec9',
};

export default function JobsPageClient() {
  const { data: jobs, isLoading, isError, refetch } = useJobs();
  const [activeType, setActiveType] = useState('All');

  const types = ['All', ...Array.from(new Set(jobs?.map((j) => j.jobType) ?? []))];
  const filtered = activeType === 'All' ? jobs : jobs?.filter((j) => j.jobType === activeType);

  return (
    <div style={{ background: 'var(--color-dark-bg)', minHeight: '100vh' }}>
      <div className="pt-40 pb-20 px-6 text-center" style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-dark-bg))' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[5px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Join Us</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-normal" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
          Careers
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} className="divider-gold w-20 mx-auto mt-8" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-28">
        {!isLoading && types.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className="text-[10px] tracking-[2px] uppercase px-5 py-2 transition-all duration-200 capitalize"
                style={{
                  border: `1px solid ${activeType === type ? 'var(--color-accent-deep)' : 'var(--color-border)'}`,
                  background: activeType === type ? 'var(--color-accent-deep)' : 'transparent',
                  color: activeType === type ? 'var(--color-text)' : '#777',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {isLoading && <GridSkeleton count={4} />}
        {isError && <ErrorMessage onRetry={refetch} />}

        {!isLoading && !isError && jobs && jobs.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No jobs available.
          </p>
        )}

        {!isLoading && !isError && jobs && jobs.length > 0 && filtered && filtered.length === 0 && (
          <p className="text-center py-16" style={{ color: 'var(--color-text-dim)' }}>
            No jobs found for this type.
          </p>
        )}

        {!isLoading && !isError && filtered && filtered.length > 0 && (
          <div className="space-y-6">
            {filtered.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-8 border"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[9px] tracking-[2px] uppercase px-3 py-1 font-semibold capitalize"
                        style={{
                          background: `${TYPE_COLORS[job.jobType] || '#e0a05e'}18`,
                          color: TYPE_COLORS[job.jobType] || '#e0a05e',
                          border: `1px solid ${TYPE_COLORS[job.jobType] || '#e0a05e'}30`,
                        }}
                      >
                        {job.jobType}
                      </span>
                    </div>
                    <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)' }}>
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: '#666' }}>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={12} />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-semibold" style={{ color: 'var(--color-accent)', fontFamily: 'Playfair Display, serif' }}>
                      OMR {job.salary.toLocaleString()}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>per month</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-7" style={{ color: '#777', lineHeight: '1.75' }}>{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
                  <div>
                    <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Requirements</p>
                    <ul className="space-y-2.5">
                      {job.requirements.map((req, ri) => (
                        <li key={ri} className="flex items-start gap-2.5 text-sm" style={{ color: '#777' }}>
                          <span style={{ color: 'var(--color-accent)', marginTop: '3px', fontSize: '10px' }}>—</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Benefits</p>
                      <ul className="space-y-2.5">
                        {job.benefits.map((ben, bi) => (
                          <li key={bi} className="flex items-start gap-2.5 text-sm" style={{ color: '#777' }}>
                            <span style={{ color: 'var(--color-accent)', marginTop: '2px', fontSize: '11px' }}>✓</span>
                            {ben}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <a
                  href={`mailto:careers@swanintl.om?subject=Application: ${job.title}`}
                  className="btn-luxury-filled inline-flex items-center gap-2"
                >
                  <Mail size={13} />
                  Apply Now
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
