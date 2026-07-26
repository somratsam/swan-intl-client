import type { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse luxury Italian fashion products at Swan International boutiques in Muscat, Oman.',
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
