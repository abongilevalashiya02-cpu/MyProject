
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users } from 'lucide-react';
import { ExperienceType } from '../../types/marketplace';

interface ExperienceCardProps {
  experience: ExperienceType;
}

// Helper function to render rating symbols
const renderRatingSymbols = (rating: number, type: string) => {
  const symbols = {
    'Luxury': '⭐',
    'Budget-Friendly': '💰',
    'Eco-Friendly': '🍃',
    'Cultural Depth': '🛡️',
    'Comfort': '🛋️'
  };
  
  const symbol = symbols[type as keyof typeof symbols] || '⭐';
  const count = Math.ceil(rating);
  
  return symbol.repeat(count);
};

// Function to determine which rating type to display based on experience category
const getRatingType = (category: string, rating: number) => {
  // Map categories to rating types
  switch (category) {
    case 'Luxury':
    case 'Premium':
      return { type: 'Luxury', value: rating };
    case 'Budget':
    case 'Affordable':
      return { type: 'Budget-Friendly', value: Math.min(rating, 3) };
    case 'Cultural':
    case 'Historical':
      return { type: 'Cultural Depth', value: rating };
    case 'Eco':
    case 'Adventure':
    case 'Nature':
      return { type: 'Eco-Friendly', value: rating };
    default:
      return { type: 'Comfort', value: rating };
  }
};

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const ratingInfo = getRatingType(experience.category, experience.rating);
  
  return (
    <Card className="overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img 
          src={experience.image} 
          alt={experience.title} 
          className="w-full h-48 object-cover"
        />
        
        {experience.isLimitedEdition && (
          <Badge className="absolute top-3 left-3 bg-bantu-yellow text-black font-medium">
            Limited Edition
          </Badge>
        )}
        
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-full px-3 py-1 text-sm font-medium flex items-center">
          <Users size={14} className="mr-1" />
          {experience.spotsLeft} spots left
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold line-clamp-1">{experience.title}</h3>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1 text-bantu-orange" />
          <span className="text-sm">{experience.location}</span>
        </div>
        
        <div className="mb-3 text-sm">
          <span className="font-medium">{ratingInfo.type}:</span>{' '}
          <span className="ml-1">{renderRatingSymbols(ratingInfo.value, ratingInfo.type)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">${experience.price}</span>
            <span className="text-gray-500 text-sm"> / person</span>
          </div>
          <Badge variant="outline" className="bg-gray-100">
            {experience.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperienceCard;
