
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Users, MapPin } from 'lucide-react';

const BookingSection = () => {
  const inclusions = [
    "5 Nights Luxury Accommodation",
    "All Meals & Fine Dining Experiences", 
    "Expert Heritage Guide Throughout",
    "All UNESCO World Heritage Site Entries",
    "VIP Airport Transfers",
    "Domestic Flight Cape Town to Durban",
    "Private Transportation", 
    "Rock Art Site Access & Interpretation",
    "Robben Island Ferry & Tour",
    "Table Mountain Cable Car",
    "Stargazing Experience",
    "Cultural Village Experience"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Booking Card */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-bantu-orange text-white">Exclusive Experience</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Heritage Expedition Package</CardTitle>
                <p className="text-gray-600">6 Days / 5 Nights • November 13-18, 2025</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      What's Included
                    </h4>
                    <div className="space-y-2">
                      {inclusions.slice(0, 6).map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-bantu-orange rounded-full mr-2" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Star className="h-5 w-5 text-bantu-orange mr-2" />
                      Experience Highlights
                    </h4>
                    <div className="space-y-2">
                      {inclusions.slice(6).map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-bantu-orange rounded-full mr-2" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-bantu-orange">Contact for Pricing</p>
                      <p className="text-sm text-gray-600">Customized experience for your group</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Private Group</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>3 UNESCO Sites</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white py-3">
                      Request Detailed Proposal
                    </Button>
                    <Button variant="outline" className="w-full">
                      Download Itinerary PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expert Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">David Klinkenberg</h4>
                    <p className="text-sm text-gray-600">
                      Renowned expert in historical narratives, ancient civilizations, 
                      and cryptography. Author of "On The Origin of Civilization."
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Heritage Specialists</h4>
                    <p className="text-sm text-gray-600">
                      Local experts in San culture, rock art interpretation, 
                      and South African heritage sites.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  November is ideal for South Africa with:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>Perfect weather for hiking</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>Clear skies for stargazing</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>Optimal rock art visibility</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>Spring wildflower season</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Group Size:</span>
                    <span className="text-sm font-medium">Private Group</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">6 Days, 5 Nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Difficulty:</span>
                    <span className="text-sm font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Transport:</span>
                    <span className="text-sm font-medium">Private Vehicles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
