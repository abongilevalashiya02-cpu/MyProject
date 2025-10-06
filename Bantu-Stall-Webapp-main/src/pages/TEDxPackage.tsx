
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllRatings, formatRatingsString } from '@/utils/experienceRatingUtils';
import { packageExperiences } from '@/data/packageExperiences';
import SpeakerPackageHero from '../components/packages/SpeakerPackageHero';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import TEDxPackageIntro from '@/components/packages/tedx/TEDxPackageIntro';
import TEDxPackageItinerary from '@/components/packages/tedx/TEDxPackageItinerary';
import TEDxPackageInclusions from '@/components/packages/tedx/TEDxPackageInclusions';
import TEDxPricingSidebar from '@/components/packages/tedx/TEDxPricingSidebar';

const TEDxPackage = () => {
  // Use the authentication hook to require login
  const { user, loading } = useRequireAuth();
  
  // Get the TEDx package data
  const tedxPackage = packageExperiences.find(pkg => pkg.id === 103);
  // Get all ratings for this package
  const ratings = tedxPackage ? getAllRatings(tedxPackage) : {};
  const { ratingsString } = formatRatingsString(ratings);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading TEDx package...</p>
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
        {tedxPackage && (
          <SpeakerPackageHero
            title={tedxPackage.title}
            location={tedxPackage.location}
            duration={tedxPackage.duration}
            rating={tedxPackage.rating}
            reviewCount={tedxPackage.reviewCount}
            spotsLeft={tedxPackage.spotsLeft}
            isLimitedEdition={tedxPackage.isLimitedEdition}
          />
        )}
        
        {/* Package Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  {/* Introduction */}
                  <TEDxPackageIntro ratingsString={ratingsString} />
                  
                  {/* Itinerary */}
                  <TEDxPackageItinerary />
                  
                  {/* What's Included */}
                  <TEDxPackageInclusions />
                </div>
              </div>
              
              {/* Pricing Sidebar */}
              <div className="lg:col-span-1">
                {tedxPackage && (
                  <TEDxPricingSidebar price={tedxPackage.price} />
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

export default TEDxPackage;
