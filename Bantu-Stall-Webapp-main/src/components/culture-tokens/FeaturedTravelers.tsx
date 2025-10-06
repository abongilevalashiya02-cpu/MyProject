
import React from 'react';
import { Star, MapPin, Calendar, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedTravelers: React.FC = () => {
  const stories = [
    {
      name: "Maria Santos",
      location: "São Paulo, Brazil",
      stamps: 342,
      image: "/lovable-uploads/5f4658ed-6a9d-4465-9246-215adef2d821.png",
      story: "Through stamp collecting, I've connected with my African roots while living in Brazil. Every meal at an African restaurant, every craft purchase, feels like coming home.",
      highlight: "Cooked traditional Angolan dishes with local chefs",
      recentActivity: "Visited 3 African cultural centers this month"
    },
    {
      name: "James Mitchell",
      location: "London, UK",
      stamps: 198,
      image: "/lovable-uploads/5f4658ed-6a9d-4465-9246-215adef2d821.png",
      story: "As a cultural anthropologist, the stamp program has opened doors to authentic African experiences I never knew existed in London's diaspora communities.",
      highlight: "Documented 15 traditional craft techniques",
      recentActivity: "Shared stories from 8 African artisans"
    },
    {
      name: "Amara Diallo",
      location: "Dakar, Senegal",
      stamps: 567,
      image: "/lovable-uploads/5f4658ed-6a9d-4465-9246-215adef2d821.png",
      story: "Living in Senegal, I use my stamps to support local artisans and share our rich culture with visitors. It's created a beautiful cycle of cultural exchange.",
      highlight: "Hosted 12 cultural immersion experiences",
      recentActivity: "Mentored 5 young traditional musicians"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cultural Ambassadors</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet fellow travelers who are building bridges between cultures and creating lasting impact 
            through meaningful engagement with African heritage worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((traveler, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <img 
                  src="/lovable-uploads/8f904e85-a315-4e6b-9061-6f959cadf576.png" 
                  alt="African pattern" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{traveler.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      {traveler.location}
                    </div>
                  </div>
                  <Badge className="bg-bantu-orange text-white">
                    {traveler.stamps} stamps
                  </Badge>
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <Quote className="w-6 h-6 text-bantu-orange/60 mb-2" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "{traveler.story}"
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-bantu-yellow mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{traveler.highlight}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-bantu-orange mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{traveler.recentActivity}</span>
                  </div>
                </div>

                {/* Cultural Impact Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cultural Impact</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < 4 ? 'text-bantu-yellow fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-bantu-orange mb-2">15,000+</div>
              <div className="text-gray-600">Active Cultural Ambassadors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bantu-orange mb-2">89</div>
              <div className="text-gray-600">Countries Reached</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bantu-orange mb-2">2,500+</div>
              <div className="text-gray-600">Partner Establishments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bantu-orange mb-2">500K+</div>
              <div className="text-gray-600">Cultural Stamps Earned</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTravelers;
