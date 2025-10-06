
import React from 'react';
import { Star } from 'lucide-react';

interface PackageRatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  className?: string;
  useCustomSymbols?: boolean;
}

const PackageRating: React.FC<PackageRatingProps> = ({ 
  rating, 
  reviewCount, 
  showCount = true,
  className = "",
  useCustomSymbols = false
}) => {
  // If we're using custom symbols, we'll just show the rating number
  if (useCustomSymbols) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="text-sm font-medium text-gray-700">
          {rating}⭐
          {showCount && reviewCount && reviewCount > 0 && (
            <span className="text-gray-500 ml-1">({reviewCount})</span>
          )}
        </span>
      </div>
    );
  }

  // Regular star rating display
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Create an array of 5 stars
  const stars = Array(5).fill(0);
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex mr-1">
        {stars.map((_, index) => {
          const starValue = index + 1;
          
          // For full stars
          if (roundedRating >= starValue) {
            return (
              <Star 
                key={index} 
                className="w-4 h-4 fill-yellow-400 text-yellow-400" 
              />
            );
          }
          
          // For half stars
          if (roundedRating + 0.5 === starValue) {
            return (
              <div key={index} className="relative">
                <Star className="w-4 h-4 text-yellow-400" />
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            );
          }
          
          // For empty stars
          return <Star key={index} className="w-4 h-4 text-gray-300" />;
        })}
      </div>
      
      <span className="text-sm font-medium text-gray-700">
        {rating}
        {showCount && reviewCount && reviewCount > 0 && (
          <span className="text-gray-500 ml-1">({reviewCount})</span>
        )}
      </span>
    </div>
  );
};

export default PackageRating;
