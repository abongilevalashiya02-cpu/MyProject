
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, GripVertical } from 'lucide-react';

interface Excursion {
  id: string;
  title: string;
  location: string;
  image: string;
  duration: string;
  rating: number;
  price: string;
  category: string;
}

const DraggableExcursionsSidebar: React.FC = () => {
  const excursions: Excursion[] = [
    {
      id: 'winelands-tour',
      title: "Winelands Team Tour",
      location: "Stellenbosch, South Africa",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      duration: "8 hours",
      rating: 4.9,
      price: "R850",
      category: "Team Building"
    },
    {
      id: 'cooking-class',
      title: "Cape Malay Cooking Class",
      location: "Bo-Kaap, Cape Town",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      duration: "4 hours",
      rating: 4.8,
      price: "R450",
      category: "Cultural"
    },
    {
      id: 'table-mountain',
      title: "Table Mountain Sunrise Hike",
      location: "Cape Town, South Africa",
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      duration: "6 hours",
      rating: 4.7,
      price: "R320",
      category: "Adventure"
    },
    {
      id: 'robben-island',
      title: "Robben Island Leadership Tour",
      location: "Cape Town Harbor",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      duration: "5 hours",
      rating: 4.9,
      price: "R600",
      category: "Leadership"
    }
  ];

  const handleDragStart = (e: React.DragEvent, excursion: Excursion) => {
    // Set data for FullCalendar to receive
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'copy';
    
    // Store excursion data in the dragged element
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.dataset.event = JSON.stringify(excursion);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Team Building':
        return 'bg-blue-500';
      case 'Cultural':
        return 'bg-bantu-orange';
      case 'Adventure':
        return 'bg-green-500';
      case 'Leadership':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-bantu-orange" />
          Drag Excursions to Calendar
        </CardTitle>
        <p className="text-sm text-gray-500">Drag and drop to plan your itinerary</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {excursions.map((excursion) => (
            <div
              key={excursion.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, excursion)}
              className="border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-move"
              data-event={JSON.stringify(excursion)}
            >
              <div className="relative">
                <img 
                  src={excursion.image} 
                  alt={excursion.title}
                  className="w-full h-24 object-cover"
                />
                <Badge 
                  className={`absolute top-2 right-2 text-xs ${getCategoryColor(excursion.category)}`}
                >
                  {excursion.category}
                </Badge>
                
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1">
                  <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="font-medium text-sm mb-1">{excursion.title}</h4>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{excursion.location}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    <span>{excursion.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-400" />
                    <span>{excursion.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-bantu-orange">{excursion.price}</span>
                  <span className="text-xs text-gray-400">Drag to calendar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableExcursionsSidebar;
