
import React from 'react';
import { Star } from 'lucide-react';
import { ExperienceType } from '@/types/marketplace';
import { getAllRatings, formatRatingsString } from '@/utils/experienceRatingUtils';

interface ExperienceRatingProps {
  experience: ExperienceType;
  className?: string;
  showDetailed?: boolean;
}

const ExperienceRating: React.FC<ExperienceRatingProps> = ({ 
  experience, 
  className = '',
  showDetailed = false 
}) => {
  // Get all the rating types for this experience
  const allRatings = getAllRatings(experience);
  
  // Format the ratings as a string with the highest factor
  const { ratingsString, highestFactor } = formatRatingsString(allRatings);
  
  return (
    <div className={`${className}`}>
      {/* Traditional star rating */}
      <div className="flex items-center mb-1">
        <div className="flex items-center mr-2">
          <Star className="h-4 w-4 fill-bantu-orange text-bantu-orange mr-1" />
          <span className="font-medium">{experience.rating}</span>
        </div>
        <span className="text-gray-500 text-sm">
          ({experience.reviewCount || 0} reviews)
        </span>
      </div>
      
      {/* Display all rating types with their symbols */}
      <div className="text-xs text-gray-600">
        <span className="font-medium">{ratingsString}</span>
      </div>
      
      {/* Show which factor is highest */}
      {showDetailed && (
        <div className="text-xs text-bantu-orange mt-1">
          <span>Highest: {highestFactor}</span>
        </div>
      )}
    </div>
  );
};

export default ExperienceRating;
