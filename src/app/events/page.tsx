import type { Metadata } from 'next';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Exclusive fashion events, private viewings, and curated experiences at Swan International boutiques in Muscat.',
};

export default function EventsPage() {
  return <EventsPageClient />;
}
