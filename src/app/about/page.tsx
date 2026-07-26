import type { Metadata } from 'next';
import AboutPageContent from './AboutPageContent';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Swan International — the story of Oman\'s premier luxury Italian fashion destination, founded by H.H. Aliya Bint Thuwainy Al Said.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
