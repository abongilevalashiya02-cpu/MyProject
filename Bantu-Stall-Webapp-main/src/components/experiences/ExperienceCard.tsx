
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin } from 'lucide-react';
import ExperienceRating from './ExperienceRating';
import { ExperienceType } from '@/types/marketplace';

interface ExperienceCardProps {
  experience: ExperienceType;
  onBookNow?: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onBookNow }) => {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-all duration-300">
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img
            src={experience.image}
            alt={experience.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="absolute top-2 right-2">
          <Badge className="bg-bantu-orange border-0 text-xs">
            {experience.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-medium line-clamp-1 mb-1">{experience.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-5 w-5 mr-1" />
          <span>{experience.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {experience.description}
        </p>
        
        {/* Display ratings with all types */}
        <ExperienceRating experience={experience} className="mb-3" />
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-sm">
            <CalendarDays className="h-5 w-5 mr-1 text-gray-500" />
            <span>{experience.duration}</span>
          </div>
          <div className="font-bold text-bantu-orange">
            ${experience.price}
          </div>
        </div>
        
        <Button 
          className="w-full mt-3 bg-bantu-orange hover:bg-bantu-orange/90 text-white"
          onClick={onBookNow}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
