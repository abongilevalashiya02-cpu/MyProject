
// Utility functions for experience ratings

// Helper function to render rating symbols
export const renderRatingSymbols = (rating: number, type: string) => {
  const symbols = {
    'Luxury': '⭐',
    'Budget-Friendly': '💰',
    'Eco-Friendly': '🍃',
    'Cultural Depth': '🛡️',
    'Comfort': '🛋️'
  };
  
  const symbol = symbols[type as keyof typeof symbols] || '⭐';
  const count = Math.ceil(rating);
  
  return `${count}${symbol}`;
};

// Seeded random function for consistent results per venue
const seededRandom = (seed: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const normalized = Math.abs(hash) / 2147483647;
  return Math.floor(normalized * (max - min + 1)) + min;
};

// Function to determine all rating types for an experience
export const getAllRatings = (experience: any) => {
  // Use venue ID or name as seed for consistent ratings
  const seed = experience.id || experience.name || 'default';
  
  // Calculate ratings based on venue characteristics
  const ratings = {
    'Luxury': experience.luxury || 
      (experience.features?.luxury ? 5 : 
       experience.features?.highEnd ? 4 : 
       seededRandom(seed + 'luxury', 3, 5)),
    
    'Budget-Friendly': experience.budget || 
      (experience.features?.luxury ? 2 : 
       experience.features?.budgetFriendly ? 5 : 
       seededRandom(seed + 'budget', 2, 4)),
    
    'Eco-Friendly': experience.eco || 
      (experience.features?.ecoFriendly ? 5 : 
       experience.features?.sustainable ? 4 : 
       seededRandom(seed + 'eco', 2, 4)),
    
    'Cultural Depth': experience.cultural || 
      (experience.features?.cultural ? 5 : 
       (typeof experience.location === 'string' && experience.location.includes('Heritage')) ? 4 : 
       seededRandom(seed + 'cultural', 3, 5)),
    
    'Comfort': experience.comfort || 
      (experience.features?.luxury ? 5 : 
       experience.features?.comfortable ? 4 : 
       seededRandom(seed + 'comfort', 3, 5)),
  };
  
  return ratings;
};

// Find the highest rated factor
export const getHighestRatedFactor = (ratings: Record<string, number>) => {
  let highestFactor = '';
  let highestValue = 0;
  
  Object.entries(ratings).forEach(([factor, value]) => {
    if (value > highestValue) {
      highestValue = value;
      highestFactor = factor;
    }
  });
  
  return { factor: highestFactor, value: highestValue };
};

// Format the ratings string with all types
export const formatRatingsString = (ratings: Record<string, number>) => {
  const highest = getHighestRatedFactor(ratings);
  
  // Create array of rating strings
  const ratingStrings = Object.entries(ratings).map(([factor, value]) => {
    const ratingText = renderRatingSymbols(value, factor);
    return ratingText;
  });
  
  // Join with separator
  const ratingsString = ratingStrings.join(' | ');
  
  return {
    ratingsString,
    highestFactor: highest.factor
  };
};
