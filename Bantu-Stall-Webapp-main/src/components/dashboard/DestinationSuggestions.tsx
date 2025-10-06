
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Star, Clock, GripVertical } from 'lucide-react';

const DestinationSuggestions = () => {
  const experiences = [
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-bantu-orange" />
          Drag Experiences to Calendar
        </CardTitle>
        <p className="text-sm text-gray-500">Drag and drop to plan your itinerary</p>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="experiences-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''}`}
            >
              {experiences.map((experience, index) => (
                <Draggable
                  key={experience.id}
                  draggableId={`experience-${JSON.stringify(experience)}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        snapshot.isDragging 
                          ? 'shadow-lg rotate-2 bg-white border-bantu-orange' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="relative">
                        <img 
                          src={experience.image} 
                          alt={experience.title}
                          className="w-full h-24 object-cover"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 text-xs ${
                            experience.category === 'Team Building' ? 'bg-blue-500' :
                            experience.category === 'Cultural' ? 'bg-bantu-orange' :
                            experience.category === 'Adventure' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                        >
                          {experience.category}
                        </Badge>
                        
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 bg-white/80 rounded-full p-1 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-1">{experience.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{experience.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-400" />
                            <span>{experience.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-bantu-orange">{experience.price}</span>
                          <Button size="sm" className="bg-bantu-orange hover:bg-bantu-orange/90 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="w-full text-bantu-orange border-bantu-orange hover:bg-bantu-orange/10">
            Explore All Cape Town Experiences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationSuggestions;
