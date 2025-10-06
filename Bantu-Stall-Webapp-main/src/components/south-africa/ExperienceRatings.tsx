
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign, Leaf, Shield, Armchair } from 'lucide-react';
import { formatRatingsString } from '@/utils/experienceRatingUtils';

const ExperienceRatings = () => {
  // Define the ratings for this specific experience
  const experienceRatings = {
    'Luxury': 5, // Private group, premium accommodations, VIP service
    'Budget-Friendly': 2, // High-end experience with comprehensive inclusions
    'Eco-Friendly': 4, // UNESCO sites focus, wilderness areas, sustainable tourism
    'Cultural Depth': 5, // Deep heritage focus, expert guides, ancient art sites
    'Comfort': 5, // Private transfers, luxury lodges, comprehensive support
  };

  const { ratingsString } = formatRatingsString(experienceRatings);

  const ratingDetails = [
    {
      icon: Star,
      type: 'Luxury',
      rating: experienceRatings['Luxury'],
      description: 'Premium private group experience with VIP services, luxury accommodations, and exclusive access to UNESCO World Heritage sites.'
    },
    {
      icon: DollarSign,
      type: 'Budget-Friendly',
      rating: experienceRatings['Budget-Friendly'],
      description: 'Comprehensive high-end experience with all inclusions. Investment reflects premium nature and extensive duration (11 days).'
    },
    {
      icon: Leaf,
      type: 'Eco-Friendly',
      rating: experienceRatings['Eco-Friendly'],
      description: 'Focus on UNESCO World Heritage conservation, wilderness areas, and sustainable tourism practices in protected regions.'
    },
    {
      icon: Shield,
      type: 'Cultural Depth',
      rating: experienceRatings['Cultural Depth'],
      description: 'Unparalleled cultural immersion through ancient San rock art, heritage sites, and expert-led historical interpretation.'
    },
    {
      icon: Armchair,
      type: 'Comfort',
      rating: experienceRatings['Comfort'],
      description: 'Maximum comfort with private transfers, luxury lodges, comprehensive logistical support, and dedicated guides throughout.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience Rating
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Rated according to Bantu Stall's comprehensive experience criteria
          </p>
          <div className="text-2xl font-bold text-bantu-orange mb-4">
            {ratingsString}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {ratingDetails.map((detail, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 text-center">
                <detail.icon className="h-8 w-8 text-bantu-orange mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{detail.type}</h3>
                <div className="text-2xl font-bold text-bantu-orange mb-2">
                  {detail.rating}/5
                </div>
                <p className="text-gray-600 text-sm">{detail.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experience Duration & Value */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Extended Experience Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-bantu-orange mb-2">11 Days</div>
                <p className="text-sm text-gray-600">Total expedition duration including TEDx engagement</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bantu-orange mb-2">3 Regions</div>
                <p className="text-sm text-gray-600">Cape Town, Cederberg, Drakensberg with extended stays</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bantu-orange mb-2">5 UNESCO Sites</div>
                <p className="text-sm text-gray-600">Including Table Mountain, Robben Island, Rock Art sites</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Enhanced Cultural Immersion</h4>
              <p className="text-sm text-gray-700">
                The extended duration allows for deeper exploration of each heritage site, 
                meaningful cultural exchanges, and comprehensive understanding of South Africa's 
                complex history and natural wonders. Additional time in each region enables 
                authentic connections with local communities and experts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ExperienceRatings;
