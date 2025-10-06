
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import BookingForm from '../components/smoke-thunder/BookingForm';
import ItineraryTimeline from '../components/smoke-thunder/ItineraryTimeline';
import PricingOptions from '../components/smoke-thunder/PricingOptions';

const SmokeThunderExcursion = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-bantu-orange to-bantu-yellow relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                November 22-27, 2025
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Mosi Oa Tunya 2025 Tour
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
                A Journey of Connection & Wonder through Johannesburg & Victoria Falls
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>6 Days, 5 Nights</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Johannesburg & Victoria Falls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Individual & Couple Options</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Overview</h2>
              <p className="text-lg text-gray-600">
                Immerse yourself in a carefully curated journey that blends global connections, 
                rich heritage, natural wonders, and transformative ideas through the heart of Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Johannesburg
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Global connections at G20 side events, heritage tours through Soweto, 
                    and innovative workshops at cultural hubs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Victoria Falls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Witness the majesty of "Mosi-oa-Tunya," enjoy cultural immersion, 
                    wildlife encounters, and The Smoke That Thunders event participation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Cape Town Add-on
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Optional 3-day extension featuring Table Mountain, Peninsula tours, 
                    and wine country experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Options Section */}
        <PricingOptions onBookNow={() => setShowBookingForm(true)} />

        {/* Detailed Itinerary */}
        <ItineraryTimeline />

        {/* Call to Action */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Journey?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join us for this transformative experience that combines cultural immersion, 
              natural wonders, and meaningful connections.
            </p>
            <Button 
              className="button-primary"
              onClick={() => setShowBookingForm(true)}
            >
              Book Your Excursion Now
            </Button>
          </div>
        </section>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm onClose={() => setShowBookingForm(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SmokeThunderExcursion;
