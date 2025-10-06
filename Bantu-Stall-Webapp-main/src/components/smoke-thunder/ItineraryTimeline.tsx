
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock } from 'lucide-react';

const ItineraryTimeline = () => {
  const itineraryDays = [
    {
      date: "November 22",
      day: "Saturday",
      location: "Johannesburg",
      theme: "Global Connections & Local Roots",
      activities: [
        "Arrival at O.R. Tambo International Airport",
        "Luxury accommodation check-in in Sandton",
        "Welcome Networking Dinner (G20 side event)"
      ],
      highlight: "Strategic alignment with G20 Summit for premium networking"
    },
    {
      date: "November 23", 
      day: "Sunday",
      location: "Johannesburg",
      theme: "Heritage & Innovation",
      activities: [
        "Soweto Historical Tour featuring Nelson Mandela's House",
        "Workshop session at Native Rebel Restaurant",
        "Evening free to explore Sandton"
      ],
      highlight: "Experience living history and contemporary culture"
    },
    {
      date: "November 24",
      day: "Monday", 
      location: "Victoria Falls",
      theme: "Arrival & Adrenaline",
      activities: [
        "Flight from Johannesburg to Victoria Falls",
        "Lunch practice session at Batoka Gorge",
        "Sunset Dinner Cruise on the Zambezi River"
      ],
      highlight: "Transition from urban energy to natural wonder"
    },
    {
      date: "November 25",
      day: "Tuesday",
      location: "Victoria Falls", 
      theme: "Nature's Majesty & Cultural Rhythms",
      activities: [
        "Lion Encounter (ethical observation experience)",
        "Workshop session and Victoria Falls hike",
        "Vultures Lunch at Safari Lodge",
        "Boma Dinner with traditional entertainment"
      ],
      highlight: "Immersive wildlife and cultural experiences"
    },
    {
      date: "November 26",
      day: "Wednesday",
      location: "Victoria Falls",
      theme: "Ideas, Arts & Celebration", 
      activities: [
        "Deliver your Talk - Production concludes at 3:00 PM",
        "Dinner at Baines Restaurant",
        "SIMUNYE Theatre Performance"
      ],
      highlight: "Culmination with transformative ideas and artistic expression"
    },
    {
      date: "November 27",
      day: "Thursday",
      location: "Victoria Falls",
      theme: "Farewell Safari & Departure",
      activities: [
        "Early morning safari experience",
        "Departure options: Cape Town connection or US return"
      ],
      highlight: "Final wildlife encounter before journey's end"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Detailed Itinerary</h2>
          <p className="text-lg text-gray-600">Your day-by-day journey through Africa's wonders</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {itineraryDays.map((day, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < itineraryDays.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-bantu-orange/30 hidden md:block"></div>
              )}
              
              <Card className="mb-8 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-bantu-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-bantu-orange" />
                        <span className="font-semibold">{day.date} - {day.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{day.location}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-bantu-orange">
                    {day.theme}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Daily Activities</h4>
                      <ul className="space-y-2">
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-bantu-orange mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Day Highlight</h4>
                      <Badge variant="outline" className="text-bantu-orange border-bantu-orange mb-2">
                        Featured Experience
                      </Badge>
                      <p className="text-sm text-gray-600">{day.highlight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItineraryTimeline;
