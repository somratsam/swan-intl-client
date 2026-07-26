import type { Metadata } from 'next';
import JobsPageClient from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Swan International team. Explore luxury retail career opportunities in Muscat, Oman.',
};

export default function JobsPage() {
  return <JobsPageClient />;
}
