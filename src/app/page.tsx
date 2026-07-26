import HeroBanner from '@/components/home/HeroBanner';
import BrandsSection from '@/components/home/BrandsSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import OffersSection from '@/components/home/OffersSection';
import EventsSection from '@/components/home/EventsSection';
import StoresSection from '@/components/home/StoresSection';
import AboutSection from '@/components/home/AboutSection';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BrandsSection />
      <NewArrivalsSection />
      <OffersSection />
      <EventsSection />
      <StoresSection />
      <AboutSection />
    </>
  );
}
