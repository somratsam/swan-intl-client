import type { Metadata } from 'next';
import StoresPageClient from './StoresPageClient';

export const metadata: Metadata = {
  title: 'Our Stores',
  description: 'Find Swan International luxury boutiques across five locations in Muscat, Oman.',
};

export default function StoresPage() {
  return <StoresPageClient />;
}
