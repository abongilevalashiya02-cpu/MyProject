
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, DollarSign, Lightbulb, Building, Globe } from 'lucide-react';
import BookingForm from '../components/smoke-thunder/BookingForm';

const LuandaRetreat = () => {
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
                4 Days in Luanda, Angola
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Urban Adaptability Retreat
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
                Creative Resilience & Strategic Innovation in Angola's Dynamic Capital
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>4 Days, 3 Nights</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Luanda, Angola</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>$3,200 per person</span>
                </div>
              </div>
              <Button 
                className="bg-white text-bantu-orange hover:bg-gray-100 font-semibold px-8 py-3"
                onClick={() => setShowBookingForm(true)}
              >
                Book Your Retreat Now
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-red-800">
                Solving the Challenge of Rapid Change & AI Transformation Anxiety
              </h2>
              <p className="text-lg text-red-700 mb-8">
                In today's rapidly evolving business landscape, teams struggle with adapting to constant change, 
                AI transformation anxiety, and maintaining creative resilience. This retreat addresses these 
                critical challenges through immersive cultural learning and strategic workshops.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-red-200">
                  <CardHeader>
                    <Lightbulb className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-red-800">Creative Resilience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">Develop innovative problem-solving skills through cultural immersion</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardHeader>
                    <Building className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-red-800">Urban Adaptability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">Navigate complex environments and market shifts with confidence</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardHeader>
                    <Globe className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-red-800">Cultural Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">Enhance global perspective and leadership capabilities</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Concept & Corporate Value */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Concept & Corporate Value</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  This retreat is meticulously designed to cultivate "Creative Resilience" and enhance "Urban Adaptability" 
                  within corporate teams. Participants will immerse themselves in Luanda's vibrant post-colonial culture, 
                  art, and music, drawing profound lessons in innovation, perseverance, and navigating complex urban environments.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The rich historical context of Angolan leadership and resilience will serve as a powerful backdrop for 
                  strategic discussions and interactive problem-solving sessions, directly addressing the challenges of 
                  rapid technological change and AI transformation anxiety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Itinerary */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">4-Day Immersive Itinerary</h2>
            
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Day 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange text-2xl">Day 1: Arrival & Cultural Immersion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Morning:</h4>
                    <p className="text-gray-700">
                      Private transfer from Quatro de Fevereiro International Airport (LAD) to superior first-class hotel. 
                      Welcome briefing and retreat orientation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Afternoon:</h4>
                    <p className="text-gray-700">
                      Heritage and City Tour focusing on Luanda's art scene and post-colonial leadership narrative. 
                      Visit historic São Miguel Fortress and Museum of the Armed Forces.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Evening:</h4>
                    <p className="text-gray-700">
                      Welcome dinner at highly-rated local restaurant featuring traditional Angolan music 
                      for team bonding and cultural appreciation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Day 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange text-2xl">Day 2: Adaptability & Resilience Workshop</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Morning:</h4>
                    <p className="text-gray-700">
                      Corporate workshop on "Urban Adaptability" and "Creative Resilience" covering market shifts, 
                      innovative problem-solving, and effective leadership through change.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Afternoon:</h4>
                    <p className="text-gray-700">
                      Visit National Museum of Slavery for historical perspective on resilience. 
                      Guided walk through Volo-Volo Market to observe urban dynamics and cultural intelligence.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Evening:</h4>
                    <p className="text-gray-700">
                      Team dinner followed by reflective session on courage and overcoming challenges, 
                      drawing from day's cultural insights.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Day 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange text-2xl">Day 3: Strategic Visioning & Community Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Morning:</h4>
                    <p className="text-gray-700">
                      Leadership circles and strategic visioning sessions drawing parallels from Angola's 
                      historical journey and contemporary urban development.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Afternoon:</h4>
                    <p className="text-gray-700">
                      "Experience Luanda" tour with bilingual guides including live traditional dance performance. 
                      Optional visit to Miradouro da Lua for reflective contemplation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Evening:</h4>
                    <p className="text-gray-700">
                      Group networking "dine-around" at various local eateries for informal interaction 
                      and appreciation of Angolan cuisine.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Day 4 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange text-2xl">Day 4: Departure & Lasting Impressions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Morning:</h4>
                    <p className="text-gray-700">
                      Final team breakfast and wrap-up session focusing on actionable takeaways and commitment 
                      to newly developed strategies. Optional visit to Shipwreck Graveyard for coastal reflection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Afternoon:</h4>
                    <p className="text-gray-700">
                      Transfer to Quatro de Fevereiro International Airport (LAD) for departure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Building Activities */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Activities & Team Building Integration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Heritage Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Guided exploration of historical sites fostering shared discovery and diverse perspectives.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Cultural Immersion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Traditional performances and market visits promoting cultural intelligence and empathy.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Strategic Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Structured sessions on adaptability and problem-solving, cultivating critical thinking.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Reflective Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Moments for personal clarity and group reflection promoting mindful restoration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-bantu-orange text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Investment in Your Team's Future</h2>
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl font-bold mb-4">$3,200</div>
              <p className="text-xl mb-8">per person - All inclusive corporate retreat</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>3 nights superior first-class accommodation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>All meals and cultural dining experiences</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Private transfers and transportation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Expert bilingual guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>All workshop materials and activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Cultural performances and experiences</span>
                </div>
              </div>
              
              <Button 
                className="bg-white text-bantu-orange hover:bg-gray-100 font-semibold px-8 py-3"
                onClick={() => setShowBookingForm(true)}
              >
                Transform Your Team Today
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Creative Resilience?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Equip your team with the adaptability and innovative thinking needed to thrive 
              in an era of rapid change and AI transformation.
            </p>
            <Button 
              className="button-primary"
              onClick={() => setShowBookingForm(true)}
            >
              Book Your Luanda Retreat
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

export default LuandaRetreat;
