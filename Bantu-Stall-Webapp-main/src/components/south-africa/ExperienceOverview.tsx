
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mountain, Palette, Shield, Leaf } from 'lucide-react';

const ExperienceOverview = () => {
  const highlights = [
    {
      icon: Mountain,
      title: "Table Mountain & Cape Floral Region",
      description: "Explore one of the New7Wonders of Nature and the unique Fynbos vegetation with 69% endemic species."
    },
    {
      icon: Shield,
      title: "Robben Island",
      description: "Visit Nelson Mandela's former prison cell and discover a global symbol of freedom and democracy."
    },
    {
      icon: Palette,
      title: "Ancient San Rock Art",
      description: "Decode 4,000-year-old paintings in both Cederberg and Drakensberg - Africa's largest collection."
    },
    {
      icon: Leaf,
      title: "Maloti-Drakensberg Park",
      description: "Experience soaring basaltic buttresses and the most concentrated rock art south of the Sahara."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            An Invitation to Discovery
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            This expedition has been meticulously designed to resonate with the profound inquiries that 
            characterize intellectual exploration, offering tangible connections to humanity's deep past 
            and its enduring stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((highlight, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <highlight.icon className="h-12 w-12 text-bantu-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-center">Setting the Stage</h3>
          <p className="text-gray-700 leading-relaxed">
            This itinerary focuses on an immersive exploration of three core World Heritage regions, 
            each offering a distinct window into South Africa's soul. These sites have been selected 
            not only for their global significance but for the unique confluence they represent: 
            landscapes of unparalleled natural grandeur, the ancient artistry of the San people whose 
            rock paintings form one of the world's oldest and most extensive artistic traditions, and 
            pivotal historical narratives that have shaped the nation and resonated globally.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceOverview;
