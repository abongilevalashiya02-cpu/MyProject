
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SouthAfricaHero from '../components/south-africa/SouthAfricaHero';
import ExperienceOverview from '../components/south-africa/ExperienceOverview';
import DetailedItinerary from '../components/south-africa/DetailedItinerary';
import ItineraryTable from '../components/south-africa/ItineraryTable';
import WorldHeritageSites from '../components/south-africa/WorldHeritageSites';
import TEDxItinerary from '../components/south-africa/TEDxItinerary';
import ExperienceRatings from '../components/south-africa/ExperienceRatings';
import BookingSection from '../components/south-africa/BookingSection';

const SouthAfricaExperience: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <SouthAfricaHero />
        <ExperienceOverview />
        <ExperienceRatings />
        <ItineraryTable />
        <WorldHeritageSites />
        <DetailedItinerary />
        <TEDxItinerary />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
};

export default SouthAfricaExperience;
