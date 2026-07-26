import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: {
    default: 'Swan International | Luxury Italian Fashion in Muscat, Oman',
    template: '%s | Swan International',
  },
  description:
    'Swan International — Oman\'s premier luxury Italian fashion destination in Muscat. Representing MAX&Co, Pennyblack, LIU.JO Woman, Furla, Marella, and United Colors of Benetton.',
  keywords: ['luxury fashion', 'Italian fashion', 'Muscat', 'Oman', 'Swan International', 'designer brands'],
  openGraph: {
    siteName: 'Swan International',
    locale: 'en_OM',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#0a0a0a', color: '#fff' }}>
        <AuthProvider>
          <ReactQueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
