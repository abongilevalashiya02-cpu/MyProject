
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { CuratedExperience } from '@/data/curatedExperiences';

interface CuratedExperienceCardProps {
  experience: CuratedExperience;
  onBuildItinerary: () => void;
}

const CuratedExperienceCard: React.FC<CuratedExperienceCardProps> = ({
  experience,
  onBuildItinerary
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'bg-blue-600';
      case 'cultural':
        return 'bg-amber-600';
      case 'belonging':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={experience.image} 
          alt={experience.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(experience.category)} text-white`}>
            {experience.categoryLabel}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
          <p className="text-white/90 text-sm italic">{experience.hook}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-bantu-orange" />
            <span>{experience.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-bantu-orange" />
            <span>{experience.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Users className="h-4 w-4 text-bantu-orange" />
          <span>{experience.groupSize}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {experience.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-bantu-orange">{experience.price}</p>
            <p className="text-xs text-gray-500">{experience.priceNote}</p>
          </div>
          
          <Button 
            className="bg-bantu-orange hover:bg-bantu-orange/90 text-white text-sm px-4"
            onClick={onBuildItinerary}
          >
            Build My Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CuratedExperienceCard;
