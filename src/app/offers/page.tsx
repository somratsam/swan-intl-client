import type { Metadata } from 'next';
import OffersPageClient from './OffersPageClient';

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Discover exclusive offers and limited-time deals at Swan International boutiques in Muscat, Oman.',
};

export default function OffersPage() {
  return <OffersPageClient />;
}
