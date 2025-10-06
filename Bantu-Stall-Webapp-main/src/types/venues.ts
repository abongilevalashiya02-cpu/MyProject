
export type VenueTypeCategory = 
  | 'urban-conference'
  | 'bush-safari'
  | 'beach-resort'
  | 'mountain-retreat'
  | 'wine-estate'
  | 'corporate-hotel'
  | 'boutique-venue'
  | 'cultural-heritage';

export interface VenueType {
  id: string;
  name: string;
  summary: string;
  bantuRating: number;
  coverImage: string;
  videoId?: string; // Optional YouTube video ID
  pricingSnapshot: string;
  activities: string[];
  venueType?: VenueTypeCategory; // NEW: Category for filtering
  location: {
    city: string;
    area: string;
    proximityToSandton: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  capacity: {
    min: number;
    max: number;
  };
  features: {
    ecoFriendly: boolean;
    luxury: boolean;
    indoorFocus: boolean;
    outdoorFocus: boolean;
  };
  csrAlignment: boolean;
  popularity: number;
}

export interface QuotationFormData {
  retreatGoal: string;
  customGoal?: string;
  attendeeCount: string;
  bookingType: string;
  addOnServices: string[];
  preferredDates: string;
  contactName: string;
  contactEmail: string;
  specialRequests?: string;
  budgetRange?: string;
  description?: string;
}

export interface VenueFilters {
  budgetRange: [number, number];
  groupSize: string;
  focus: string;
  ecoFriendly: boolean;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  company_size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  linkedin_profile_url?: string;
  created_at: string;
  updated_at: string;
}

export type SortOption = 'popular' | 'proximity' | 'rating' | 'csr' | 'nature' | 'luxury';
