// Venue type to property type mapping for database queries
export const VENUE_TYPE_MAPPING: Record<string, string[]> = {
  'urban-conference': ['Conference Center', 'Hotel', 'Guest House', 'Business Hotel'],
  'bush-safari': ['Lodge', 'Safari Lodge', 'Game Reserve'],
  'beach-resort': ['Beach Resort', 'Coastal Hotel'],
  'mountain-retreat': ['Mountain Lodge', 'Mountain Resort'],
  'wine-estate': ['Wine Estate', 'Wine Farm'],
  'corporate-hotel': ['Hotel', 'Business Hotel', 'Conference Center'],
  'boutique-venue': ['Boutique Hotel', 'Guest House', 'Spa Resort'],
  'cultural-heritage': ['Heritage Site', 'Cultural Center']
};

// Venue type display labels
export const VENUE_TYPE_LABELS: Record<string, string> = {
  'urban-conference': 'Urban Conference Center',
  'bush-safari': 'Bush Lodge / Safari',
  'beach-resort': 'Beach Resort',
  'mountain-retreat': 'Mountain Retreat',
  'wine-estate': 'Wine Estate',
  'corporate-hotel': 'Corporate Hotel',
  'boutique-venue': 'Boutique Venue',
  'cultural-heritage': 'Cultural Heritage Site'
};

// Default room rates by venue type (fallback if venue doesn't specify)
export const DEFAULT_ROOM_RATES: Record<string, { standard: number; executive: number; presidential: number }> = {
  'bush-safari': { standard: 1200, executive: 2000, presidential: 4000 },
  'beach-resort': { standard: 1500, executive: 2500, presidential: 5000 },
  'mountain-retreat': { standard: 1000, executive: 1800, presidential: 3500 },
  'wine-estate': { standard: 1300, executive: 2200, presidential: 4200 },
  'corporate-hotel': { standard: 900, executive: 1600, presidential: 3500 },
  'urban-conference': { standard: 850, executive: 1500, presidential: 3200 },
  'boutique-venue': { standard: 1100, executive: 1900, presidential: 3800 },
  'cultural-heritage': { standard: 950, executive: 1700, presidential: 3400 }
};

export interface ParsedVenuePricing {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  currency: 'ZAR' | 'USD';
}

/**
 * Parse venue pricing from pricingSnapshot string
 * Examples:
 * - "$140-280 / R2,550-5,100 per room"
 * - "R1050-R2100 / $58-115 per person per night"
 * - "$120-200 / R2,200-3,650 per person per day"
 */
export function parseVenuePricing(pricingSnapshot: string): ParsedVenuePricing {
  // Default fallback
  const defaultPricing: ParsedVenuePricing = {
    minPrice: 2000,
    maxPrice: 4000,
    avgPrice: 3000,
    unit: 'per person per day',
    currency: 'ZAR'
  };

  if (!pricingSnapshot) return defaultPricing;

  try {
    // Extract ZAR pricing (prioritize ZAR over USD)
    const zarMatch = pricingSnapshot.match(/R\s*([\d,]+)(?:\s*-\s*R?\s*([\d,]+))?/);
    
    if (zarMatch) {
      const minPrice = parseInt(zarMatch[1].replace(/,/g, ''));
      const maxPrice = zarMatch[2] ? parseInt(zarMatch[2].replace(/,/g, '')) : minPrice;
      const avgPrice = Math.round((minPrice + maxPrice) / 2);
      
      // Extract unit (per room, per person, per day, etc.)
      const unitMatch = pricingSnapshot.match(/per\s+(room|person|day|night|person per day|person per night|room per night)/gi);
      const unit = unitMatch ? unitMatch[0].toLowerCase() : 'per person per day';
      
      return {
        minPrice,
        maxPrice,
        avgPrice,
        unit,
        currency: 'ZAR'
      };
    }
    
    // Fallback to USD if no ZAR found
    const usdMatch = pricingSnapshot.match(/\$\s*([\d,]+)(?:\s*-\s*\$?\s*([\d,]+))?/);
    if (usdMatch) {
      const minPriceUSD = parseInt(usdMatch[1].replace(/,/g, ''));
      const maxPriceUSD = usdMatch[2] ? parseInt(usdMatch[2].replace(/,/g, '')) : minPriceUSD;
      
      // Convert to ZAR (approximate rate: 1 USD = 18.3 ZAR)
      const minPrice = Math.round(minPriceUSD * 18.3);
      const maxPrice = Math.round(maxPriceUSD * 18.3);
      const avgPrice = Math.round((minPrice + maxPrice) / 2);
      
      const unitMatch = pricingSnapshot.match(/per\s+(room|person|day|night|person per day|person per night|room per night)/gi);
      const unit = unitMatch ? unitMatch[0].toLowerCase() : 'per person per day';
      
      return {
        minPrice,
        maxPrice,
        avgPrice,
        unit,
        currency: 'ZAR'
      };
    }
    
    return defaultPricing;
  } catch (error) {
    console.error('Error parsing venue pricing:', error);
    return defaultPricing;
  }
}

/**
 * Calculate venue-only cost based on parsed pricing and unit
 */
export function calculateVenueCost(
  pricing: ParsedVenuePricing,
  attendeeCount: number,
  eventDuration: number
): number {
  const { avgPrice, unit } = pricing;
  
  // Normalize to per person per day
  if (unit.includes('per room')) {
    // If per room, estimate rooms needed (assume 2 people per room)
    const estimatedRooms = Math.ceil(attendeeCount / 2);
    if (unit.includes('per night') || unit.includes('per day')) {
      return Math.round(avgPrice * estimatedRooms * eventDuration);
    }
    return Math.round(avgPrice * estimatedRooms);
  }
  
  if (unit.includes('per person')) {
    if (unit.includes('per day')) {
      return Math.round(avgPrice * attendeeCount * eventDuration);
    }
    if (unit.includes('per night')) {
      return Math.round(avgPrice * attendeeCount * (eventDuration - 1)); // nights = days - 1
    }
    // Just "per person" without time unit
    return Math.round(avgPrice * attendeeCount);
  }
  
  // Default: assume per person per day
  return Math.round(avgPrice * attendeeCount * eventDuration);
}

/**
 * Calculate accommodation cost based on room counts and venue type
 */
export function calculateAccommodationCost(
  venueType: string,
  standardRooms: number,
  executiveRooms: number,
  presidentialRooms: number,
  eventDuration: number
): number {
  const rates = DEFAULT_ROOM_RATES[venueType] || DEFAULT_ROOM_RATES['corporate-hotel'];
  
  // Calculate nights (typically days - 1, but for simplicity use days)
  const nights = eventDuration;
  
  const standardCost = standardRooms * rates.standard * nights;
  const executiveCost = executiveRooms * rates.executive * nights;
  const presidentialCost = presidentialRooms * rates.presidential * nights;
  
  return Math.round(standardCost + executiveCost + presidentialCost);
}

/**
 * Format currency in ZAR
 */
export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
