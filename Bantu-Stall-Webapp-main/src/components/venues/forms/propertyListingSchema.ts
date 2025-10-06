
import * as z from 'zod';

export const propertyListingSchema = z.object({
  propertyName: z.string().min(2, 'Property name must be at least 2 characters'),
  propertyType: z.string().min(1, 'Please select a property type'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  area: z.string().min(1, 'Please select an area'),
  proximityToLandmark: z.string().min(1, 'Please provide proximity to a major landmark, airport, or key site'),
  description: z.string().min(50, 'Description must be at least 50 characters and should cover unique features, accessibility, and edge-case scenarios'),
  minCapacity: z.number().min(1, 'Minimum capacity must be at least 1'),
  maxCapacity: z.number().min(1, 'Maximum capacity must be at least 1'),
  totalRooms: z.number().min(1, 'Total rooms must be at least 1'),
  meetingRooms: z.number().min(1, 'Meeting rooms must be at least 1'),
  priceRangeUSD: z.string().min(1, 'Please provide USD price range'),
  priceRangeZAR: z.string().min(1, 'Please provide ZAR price range'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  websiteUrl: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  activities: z.string().min(10, 'Please describe all on-site and nearby activities/experiences, including edge cases and accessibility'),
  amenities: z.array(z.string()).min(1, 'Please select at least one amenity or special facility'),
  accessibility: z.array(z.string()).optional(),
  uniqueSellingPoints: z.string().min(10, 'Please describe what makes your property special, including for unique guest profiles and edge cases').optional(),
  bookingFlexibility: z.string().min(5, 'Please describe your booking/cancellation/payment flexibility, including for special cases (e.g., last-minute, long stays, emergencies)').optional(),
  preferredGuestTypes: z.array(z.string()).min(1, 'Please select at least one preferred guest type').optional(),
  languagesSpoken: z.array(z.string()).min(1, 'Please select at least one language').optional(),
  marketingSource: z.string().min(2, 'Please let us know how you heard about us').optional(),
  ecoFriendly: z.boolean(),
  luxury: z.boolean(),
  indoorFocus: z.boolean(),
  outdoorFocus: z.boolean(),
  csrAlignment: z.boolean(),
  specialRequests: z.string().optional(),
});


export type PropertyListingFormData = z.infer<typeof propertyListingSchema>;
export const accessibilityOptions = [
  'Wheelchair Accessible',
  'Accessible Parking',
  'Elevator',
  'Braille Signage',
  'Hearing Assistance',
  'Service Animal Friendly',
  'Other',
];

export const guestTypes = [
  'Corporate',
  'Family',
  'Events',
  'Retreats',
  'Weddings',
  'Solo Travelers',
  'Groups',
  'Other',
];

export const languageOptions = [
  'English',
  'Afrikaans',
  'Zulu',
  'Xhosa',
  'French',
  'Portuguese',
  'Other',
];

export const marketingSources = [
  'Google Search',
  'Social Media',
  'Referral',
  'Event/Expo',
  'Email Newsletter',
  'Other',
];

export const amenitiesList = [
  'Conference Facilities',
  'WiFi',
  'Catering Services',
  'Parking',
  'Spa Services',
  'Swimming Pool',
  'Gym/Fitness Center',
  'Restaurant',
  'Bar/Lounge',
  'Room Service',
  'Laundry Service',
  'Airport Shuttle',
  'Business Center',
  'Outdoor Activities',
  'Team Building Facilities',
];

export const areas = [
  'Johannesburg CBD',
  'Sandton',
  'Rosebank',
  'Midrand',
  'Fourways',
  'Lanseria',
  'Muldersdrift',
  'Magaliesburg',
  'Pretoria',
  'Centurion',
  'Krugersdorp',
  'Vaal',
  'Bronkhorstspruit',
  'Other',
];

export const propertyTypes = [
  'Hotel',
  'Lodge',
  'Resort',
  'Country Estate',
  'Conference Center',
  'Guest House',
  'Boutique Hotel',
  'Spa Resort',
  'Game Lodge',
  'Other',
];
