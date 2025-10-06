
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WorldHeritageSites = () => {
  const sites = [
    {
      title: "Cape Floral Region Protected Areas",
      image: "/lovable-uploads/be806ffc-213d-4526-9fc2-ba5265398bb5.png",
      description: "Home to over 9,000 vascular plant species with 69% endemic to the region. Table Mountain showcases unique Fynbos vegetation adapted to Mediterranean climate.",
      highlights: ["Table Mountain", "Unique Fynbos Vegetation", "69% Endemic Species", "New7Wonders of Nature"]
    },
    {
      title: "Robben Island",
      image: "/lovable-uploads/8be6743f-cbcf-4f22-98dd-dff89e54bbe5.png",
      description: "A global symbol of the triumph of human spirit, freedom and democracy over oppression. Former prison where Nelson Mandela spent 18 of his 27 years in captivity.",
      highlights: ["Nelson Mandela's Cell", "Political History", "Symbol of Freedom", "Former Political Prisoners as Guides"]
    },
    {
      title: "Maloti-Drakensberg Park",
      image: "/lovable-uploads/6e4dc32b-3e3f-4f48-977b-b97c871979cb.png",
      description: "The largest concentration of rock paintings in Africa south of the Sahara, with over 35,000 individual images created by San people over 4,000 years.",
      highlights: ["35,000+ Rock Paintings", "4,000 Years of Art", "Basaltic Buttresses", "San Spiritual Life"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="bg-bantu-orange text-white mb-4">UNESCO World Heritage Sites</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Extraordinary Heritage Destinations
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Each site offers a unique window into South Africa's natural grandeur, ancient artistry, 
            and pivotal historical narratives that have shaped the nation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {sites.map((site, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={site.image} 
                  alt={site.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{site.title}</h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{site.description}</p>
                <div className="space-y-2">
                  {site.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-bantu-orange rounded-full mr-2" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorldHeritageSites;
