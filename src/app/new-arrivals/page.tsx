import type { Metadata } from 'next';
import NewArrivalsPageClient from './NewArrivalsPageClient';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Shop the latest Italian fashion arrivals at Swan International boutiques in Muscat.',
};

export default function NewArrivalsPage() {
  return <NewArrivalsPageClient />;
}
