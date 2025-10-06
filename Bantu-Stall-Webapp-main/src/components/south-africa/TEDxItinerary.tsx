import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Mic, Star, Clock, Globe } from 'lucide-react';

const TEDxItinerary = () => {
  const scheduleData = [
    {
      date: "Tues, Nov 18",
      time: "Afternoon",
      activity: "Arrival in Johannesburg & Check-in",
      location: "Johannesburg",
      purpose: "Settle in; accommodation provided",
      attendees: "Mr. Klinkenberg & Team",
      mandatory: false
    },
    {
      date: "Tues, Nov 18", 
      time: "6:00 PM onwards",
      activity: "Welcome Dinner",
      location: "Johannesburg",
      purpose: "Networking with speakers, sponsors, volunteers",
      attendees: "Mr. Klinkenberg (Team encouraged)",
      mandatory: true
    },
    {
      date: "Wed, Nov 19",
      time: "Full Day",
      activity: "Courage & Confidence Building Workshop",
      location: "Pretoria",
      purpose: "Peer-to-peer learning, includes outdoor activity",
      attendees: "Mr. Klinkenberg",
      mandatory: true
    },
    {
      date: "Thurs, Nov 20",
      time: "Morning/Daytime",
      activity: "Explore Johannesburg: Soweto Tour",
      location: "Soweto, Johannesburg",
      purpose: "Cultural excursion",
      attendees: "Mr. Klinkenberg & Team",
      mandatory: false
    },
    {
      date: "Thurs, Nov 20",
      time: "3:00 PM onwards", 
      activity: "Final Rehearsal",
      location: "TEDxMaudeStreet Venue",
      purpose: "Stage readiness, voice projection, venue familiarization",
      attendees: "Mr. Klinkenberg",
      mandatory: true
    },
    {
      date: "Fri, Nov 21",
      time: "Morning",
      activity: "Final Preparations for TEDx Event",
      location: "Accommodation/Venue",
      purpose: "Personal preparation, mental focus",
      attendees: "Mr. Klinkenberg (Team support)",
      mandatory: false
    },
    {
      date: "Fri, Nov 21",
      time: "1:00 PM onwards",
      activity: "TEDxMaudeStreet Main Event",
      location: "TEDxMaudeStreet Venue", 
      purpose: "Mr. Klinkenberg delivers his talk",
      attendees: "Mr. Klinkenberg (Team attends)",
      mandatory: true
    },
    {
      date: "Fri, Nov 21",
      time: "Evening",
      activity: "Post-Event Activities",
      location: "TBC",
      purpose: "Networking, celebration",
      attendees: "Mr. Klinkenberg & Team",
      mandatory: false
    },
    {
      date: "Sat, Nov 22",
      time: "Full Day",
      activity: "Custom Day (G20 Summit Period)",
      location: "Johannesburg/Surrounding Areas",
      purpose: "Personalized exploration during G20 Summit",
      attendees: "Mr. Klinkenberg & Team",
      mandatory: false
    },
    {
      date: "Sun, Nov 23",
      time: "Full Day",
      activity: "Custom Day (G20 Summit Period)",
      location: "Johannesburg/Surrounding Areas",
      purpose: "Continued personalized exploration",
      attendees: "Mr. Klinkenberg & Team",
      mandatory: false
    }
  ];

  const highlights = [
    {
      icon: Mic,
      title: "TEDx Talk Delivery",
      description: "Up to 15-minute presentation on specialized research themes including the DA Vinci Code, filmed for global YouTube audience."
    },
    {
      icon: Users,
      title: "Speaker Development",
      description: "Mandatory courage & confidence building workshop with peer-to-peer learning and outdoor activities in Pretoria."
    },
    {
      icon: MapPin,
      title: "Cultural Immersion",
      description: "Guided tour of historic Soweto, providing deep cultural context and understanding of Johannesburg's heritage."
    },
    {
      icon: Star,
      title: "Global Impact",
      description: "Talk will be professionally filmed and featured on the TEDx YouTube channel, reaching audiences worldwide."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="bg-red-600 text-white mb-4">TEDxMaudeStreet</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            TEDxMaudeStreet Engagement
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Following the heritage expedition, Mr. Klinkenberg continues his South African journey 
            with a prestigious speaking engagement at TEDxMaudeStreet in Johannesburg.
          </p>
        </div>

        {/* TEDx Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((highlight, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <highlight.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TEDx Schedule */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">TEDxMaudeStreet Schedule</CardTitle>
            <p className="text-center text-gray-600">
              November 18-23, 2025 • Johannesburg, South Africa
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-red-600">
                    <th className="text-left p-3 font-semibold">Date & Time</th>
                    <th className="text-left p-3 font-semibold">Activity</th>
                    <th className="text-left p-3 font-semibold">Location</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Attendees</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{item.date}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.time}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.activity}</span>
                          {item.mandatory && (
                            <Badge variant="outline" className="text-xs border-red-600 text-red-600">
                              Mandatory
                            </Badge>
                          )}
                          {item.date.includes("Nov 22") || item.date.includes("Nov 23") ? (
                            <Badge variant="outline" className="text-xs border-blue-600 text-blue-600">
                              G20 Summit Period
                            </Badge>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{item.location}</td>
                      <td className="p-3 text-sm">{item.purpose}</td>
                      <td className="p-3 text-sm">{item.attendees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Event Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                <span>Audience of approximately 100 attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                <span>Talk duration: Up to 15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-red-600" />
                <span>Professional filming for YouTube</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>Johannesburg, South Africa</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Comprehensive Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  <span>Accommodation & meals included</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  <span>Shuttles & tour guides provided</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  <span>Safety & security assurance</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  <span>Community of speakers & volunteers</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  <span>Translation & assistance available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* G20 Summit Custom Days */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold">G20 Summit Period Custom Days</h3>
          </div>
          <p className="text-gray-700 mb-6">
            November 22-23, 2025 coincides with the G20 Summit in South Africa, creating unique opportunities 
            for custom experiences during this significant global event period.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-2">Safari Experience</h4>
              <p className="text-gray-600 text-sm">
                "Celebrate the African way with a slow Safari Day" - an unhurried, immersive encounter 
                with Africa's renowned wildlife and natural landscapes, away from summit activities.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-2">Summit-Adjacent Cultural Exploration</h4>
              <p className="text-gray-600 text-sm">
                Unique opportunity to experience Johannesburg during a major international event, 
                with potential cultural exchanges and heightened global atmosphere throughout the city.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> The G20 Summit period adds a distinctive global dimension to the visit, 
              with enhanced security and international presence throughout Johannesburg. Custom day activities 
              will be carefully planned to complement this unique timing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TEDxItinerary;
