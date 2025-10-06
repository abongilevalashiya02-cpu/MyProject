
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Mountain } from 'lucide-react';
import PackageHighlight from '../components/packages/PackageHighlight';
import PackageRating from '../components/packages/PackageRating';
import { toast } from 'sonner';
import { getAllRatings, formatRatingsString } from '@/utils/experienceRatingUtils';
import { packageExperiences } from '@/data/packageExperiences';

const AdventurePackage = () => {
  const handleBookNow = () => {
    toast.success("Thank you for your interest! A confirmation email has been sent.");
  };

  // Get the adventure package data
  const adventurePackage = packageExperiences.find(pkg => pkg.id === 102);
  // Get all ratings for this package
  const ratings = adventurePackage ? getAllRatings(adventurePackage) : {};
  const { ratingsString } = formatRatingsString(ratings);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <img 
            src="/lovable-uploads/ae6c97c8-d66e-4379-83ab-5118189656cd.png" 
            alt="Adventure in Africa" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Badge className="mb-4 bg-green-600 text-white">Business Package</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Adventure Excursion Package</h1>
              <p className="text-xl text-white/90 mb-6">Victoria Falls, Zimbabwe | August 12-17, 2025</p>
              <div className="flex flex-wrap gap-4 items-center text-white">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  <span>6 Days</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>Victoria Falls, Zimbabwe</span>
                </div>
                <div className="flex items-center">
                  <PackageRating rating={4.8} reviewCount={36} className="text-white" useCustomSymbols={true} />
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>20 spots left</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Package Details */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-3xl font-bold mb-6">Thrilling African Adventure</h2>
                  
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-medium">Package Rating:</p>
                    <p className="text-gray-700">{ratingsString}</p>
                  </div>
                  
                  <p className="text-lg mb-6">
                    Embark on an unforgettable adventure at the magnificent Victoria Falls. This all-inclusive package
                    offers the perfect blend of exhilarating activities, wildlife encounters, and cultural experiences,
                    allowing you to witness the beauty and power of "The Smoke That Thunders."
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4">Package Highlights</h2>
                  
                  <PackageHighlight 
                    title="High-Level Networking" 
                    description="Connect with luminaries from Southern Africa alongside international guests from the US & EU, creating valuable professional relationships in a unique and inspiring setting."
                  />
                  
                  <PackageHighlight 
                    title="Sunset Boat Cruise" 
                    description="Begin your adventure with a tranquil sunset cruise on the Zambezi River, providing a chance to connect with fellow travelers."
                  />
                  
                  <PackageHighlight 
                    title="Wildlife Encounters" 
                    description="Enjoy ethical interactions with Africa's majestic wildlife, including elephants and lions."
                  />
                  
                  <PackageHighlight 
                    title="Chobe Safari" 
                    description="Experience a full-day safari in Botswana's Chobe National Park, renowned for its diverse wildlife and stunning landscapes."
                  />
                  
                  <PackageHighlight 
                    title="Adventure Activities" 
                    description="Take a dip in the exhilarating Devil's Pool, observe the Vulture Feeding Spectacle, and savor a gourmet bush breakfast during the 'Feast of the Beast.'"
                  />
                  
                  <PackageHighlight 
                    title="Cultural Immersion" 
                    description="Be captivated by the Simunye Cultural Performance, offering insights into local traditions and arts."
                  />
                  
                  <PackageHighlight 
                    title="Attend a Global Event" 
                    description="Enjoy a complimentary ticket to attend the Main event, where you can absorb inspiring talks and connect with thought leaders."
                  />
                  
                  <PackageHighlight 
                    title="Gourmet Dining" 
                    description="Indulge in curated dining experiences at top venues, including The Boma, Baines Restaurant, and River Brewery."
                  />
                  
                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-lg font-bold text-amber-800">Optional Complimentary Layover</h3>
                    <p className="text-amber-700">Sandton, South Africa on August 11, 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-bantu-orange">$4,400</p>
                      <p className="text-gray-600">All-Inclusive, Excluding International Flights</p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between border-b pb-2">
                        <span>Theme</span>
                        <span className="font-medium">"The Smoke That Thunders"</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Duration</span>
                        <span className="font-medium">6 Days</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Group Size</span>
                        <span className="font-medium">Limited to 30 Travelers</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Starting Date</span>
                        <span className="font-medium">August 12, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Language</span>
                        <span className="font-medium">English</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
                        onClick={handleBookNow}
                      >
                        Secure Your Spot - $2000 Deposit
                      </Button>
                      <Button variant="outline" className="w-full">
                        Download Itinerary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdventurePackage;
