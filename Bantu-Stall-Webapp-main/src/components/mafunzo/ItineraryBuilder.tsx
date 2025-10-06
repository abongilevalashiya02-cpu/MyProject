
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Map, Plus, Trash2, Clock, MapPin, DollarSign, Info } from 'lucide-react';

type Experience = {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  categoryColor: string;
  description: string;
};

type ItineraryDay = {
  id: number;
  date: string;
  experiences: Experience[];
};

// Sample data for marketplace experiences
const availableExperiences: Experience[] = [
  {
    id: 1,
    title: "Maasai Village Cultural Tour",
    location: "Arusha, Tanzania",
    duration: "Half Day",
    price: 85,
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "Cultural",
    categoryColor: "bg-indigo-100 text-indigo-800",
    description: "Immerse yourself in Maasai culture with a guided village tour led by local community members."
  },
  {
    id: 2,
    title: "Traditional Cooking Workshop",
    location: "Zanzibar, Tanzania",
    duration: "3 Hours",
    price: 65,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "Culinary",
    categoryColor: "bg-rose-100 text-rose-800",
    description: "Learn to prepare authentic Swahili dishes using traditional techniques and local ingredients."
  },
  {
    id: 3,
    title: "Safari Photography Workshop",
    location: "Serengeti, Tanzania",
    duration: "Full Day",
    price: 150,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80",
    category: "Workshop",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Enhance your wildlife photography skills with professional guidance in the stunning Serengeti."
  },
  {
    id: 4,
    title: "Community Development Project",
    location: "Nairobi, Kenya",
    duration: "2 Days",
    price: 120,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "Volunteer",
    categoryColor: "bg-emerald-100 text-emerald-800",
    description: "Participate in a meaningful community project focused on sustainable development initiatives."
  }
];

// Sample data for itinerary
const initialItinerary: ItineraryDay[] = [
  {
    id: 1,
    date: "June 10, 2023",
    experiences: []
  },
  {
    id: 2,
    date: "June 11, 2023",
    experiences: []
  },
  {
    id: 3,
    date: "June 12, 2023",
    experiences: []
  }
];

const ItineraryBuilder = () => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialItinerary);
  const [draggingExperience, setDraggingExperience] = useState<Experience | null>(null);
  
  const handleDragStart = (experience: Experience) => {
    setDraggingExperience(experience);
  };
  
  const handleDrop = (dayId: number) => {
    if (draggingExperience) {
      setItinerary(prev => 
        prev.map(day => 
          day.id === dayId 
            ? { ...day, experiences: [...day.experiences, draggingExperience] }
            : day
        )
      );
      setDraggingExperience(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const removeExperience = (dayId: number, experienceId: number) => {
    setItinerary(prev => 
      prev.map(day => 
        day.id === dayId 
          ? { ...day, experiences: day.experiences.filter(exp => exp.id !== experienceId) }
          : day
      )
    );
  };
  
  const calculateTotalCost = () => {
    return itinerary.reduce((total, day) => 
      total + day.experiences.reduce((dayTotal, exp) => dayTotal + exp.price, 0), 0
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Itinerary Builder</h2>
        <div className="flex gap-3">
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            Add Day
          </Button>
          <Button>
            <Map className="mr-2 h-4 w-4" />
            View Complete Itinerary
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Experiences */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Experiences</CardTitle>
              <CardDescription>
                Drag and drop experiences onto your itinerary days
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
              <div className="space-y-4">
                {availableExperiences.map(experience => (
                  <div 
                    key={experience.id}
                    className="bg-white border rounded-lg overflow-hidden cursor-move shadow-sm hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(experience)}
                  >
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={experience.image} 
                          alt={experience.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm line-clamp-1">{experience.title}</h4>
                          <Badge className={`${experience.categoryColor} border-none text-xs`}>
                            {experience.category}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{experience.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>${experience.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Itinerary Days */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {itinerary.map(day => (
              <Card 
                key={day.id}
                onDrop={() => handleDrop(day.id)}
                onDragOver={handleDragOver}
                className={`border-2 ${draggingExperience ? 'border-dashed border-bantu-orange/50' : 'border-transparent'}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle>Day {day.id}: {day.date}</CardTitle>
                  <CardDescription>
                    {day.experiences.length === 0 
                      ? "Drop experiences here to build your day" 
                      : `${day.experiences.length} experience${day.experiences.length > 1 ? 's' : ''} planned`
                    }
                  </CardDescription>
                </CardHeader>
                
                <Separator />
                
                <CardContent className="p-4">
                  {day.experiences.length > 0 ? (
                    <div className="space-y-4">
                      {day.experiences.map((exp, index) => (
                        <div key={`${day.id}-${exp.id}-${index}`} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                          <div className="flex">
                            <div className="w-1/4">
                              <img 
                                src={exp.image} 
                                alt={exp.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-3/4 p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{exp.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-500"
                                  onClick={() => removeExperience(day.id, exp.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{exp.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{exp.duration}</span>
                                  </div>
                                </div>
                                <Badge className={`${exp.categoryColor} border-none text-xs`}>
                                  {exp.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                      <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Drag experiences here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Estimated Cost</p>
                  <p className="text-2xl font-bold text-bantu-orange">${calculateTotalCost()}</p>
                </div>
                <Button>Save Itinerary</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
