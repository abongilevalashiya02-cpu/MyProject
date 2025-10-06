
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign } from 'lucide-react';

const ResaleOpportunities = () => {
  const resaleItems = [
    {
      id: 1,
      title: "Serengeti Safari Adventure",
      location: "Tanzania",
      price: "$1,200",
      commission: "15%",
      availability: "Year-round",
      tags: ["Wildlife", "Adventure", "Popular"]
    },
    {
      id: 2,
      title: "Marrakech Culinary Tour",
      location: "Morocco",
      price: "$450",
      commission: "20%",
      availability: "March - October",
      tags: ["Culinary", "Cultural"]
    },
    {
      id: 3,
      title: "Cape Winelands Experience",
      location: "South Africa",
      price: "$675",
      commission: "18%",
      availability: "Year-round",
      tags: ["Culinary", "Luxury"]
    },
    {
      id: 4,
      title: "Maasai Cultural Immersion",
      location: "Kenya",
      price: "$550",
      commission: "22%",
      availability: "June - September",
      tags: ["Cultural", "Community", "Unique"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Pre-Built Packages Available for Resale</h3>
        <Badge variant="outline" className="bg-bantu-orange/10 text-bantu-orange border-none">
          {resaleItems.length} Available
        </Badge>
      </div>
      
      <div className="space-y-4">
        {resaleItems.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">{item.location}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.availability}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-2">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium mr-2">{item.price}</span>
                  <span className="text-sm text-green-600">({item.commission} commission)</span>
                </div>
                
                <Button size="sm" className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-1" /> Add to My Listings
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full">View All Resale Opportunities</Button>
    </div>
  );
};

export default ResaleOpportunities;
