import type { Metadata } from 'next';
import BrandsPageClient from './BrandsPageClient';

export const metadata: Metadata = {
  title: 'Our Brands',
  description: 'Explore our portfolio of six iconic Italian luxury fashion brands available at Swan International boutiques in Muscat, Oman.',
};

export default function BrandsPage() {
  return <BrandsPageClient />;
}
