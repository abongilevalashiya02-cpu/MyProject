
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllRatings, formatRatingsString } from '@/utils/experienceRatingUtils';
import { packageExperiences } from '@/data/packageExperiences';
import SpeakerPackageHero from '../components/packages/SpeakerPackageHero';
import PackageDetails from '../components/packages/PackageDetails';
import BookingCard from '../components/packages/BookingCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const SpeakerPackage = () => {
  // Use the authentication hook to require login
  const { user, loading } = useRequireAuth();
  
  // Get the speaker package data
  const speakerPackage = packageExperiences.find(pkg => pkg.id === 101);
  // Get all ratings for this package
  const ratings = speakerPackage ? getAllRatings(speakerPackage) : {};
  const { ratingsString } = formatRatingsString(ratings);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading speaker package...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        {speakerPackage && (
          <SpeakerPackageHero
            title={speakerPackage.title}
            location={speakerPackage.location}
            duration={speakerPackage.duration}
            rating={speakerPackage.rating}
            reviewCount={speakerPackage.reviewCount}
            spotsLeft={speakerPackage.spotsLeft}
            isLimitedEdition={speakerPackage.isLimitedEdition}
          />
        )}
        
        {/* Package Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PackageDetails ratingsString={ratingsString} />
              </div>
              
              <div className="lg:col-span-1">
                {speakerPackage && (
                  <BookingCard 
                    price={speakerPackage.price} 
                    startDate="August 12, 2025" 
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpeakerPackage;
