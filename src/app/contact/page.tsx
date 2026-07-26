import type { Metadata } from 'next';
import ContactPageContent from './ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Swan International. Find our store locations, phone numbers, and email contacts in Muscat, Oman.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
