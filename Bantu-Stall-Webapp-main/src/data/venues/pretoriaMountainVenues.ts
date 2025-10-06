
import { VenueType } from '../../types/venues';

export const pretoriaMountainVenues: VenueType[] = [
  {
    id: "f8a9b0c1-d2e3-4567-1234-678901234567",
    name: "Leopard Lodge",
    venueType: 'mountain-retreat',
    summary: "Mountain retreat in Magaliesberg with 248-hectare property featuring diverse wildlife and Cape Griffon Vulture colony.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$170-290 / R3,100-5,300 per room - Book with us for up to 30% savings",
    activities: ["Wildlife Viewing", "Bird Watching", "Boma Fire Evenings", "Mountain Walks"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "55 minutes from Sandton",
      coordinates: { lat: -25.7308, lng: 27.8661 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magaliesberg Mountains, Hartbeespoort"
    },
    capacity: { min: 10, max: 100 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 82
  },
  {
    id: "a9b0c1d2-e3f4-5678-2345-789012345678",
    name: "Pecan Manor",
    venueType: 'mountain-retreat',
    summary: "Tranquil venue nestled in Pecan Nut Forest in Magaliesberg foothills with diverse wildlife including Giraffe and Sable.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$140-240 / R2,550-4,400 per room - Book with us for up to 30% savings",
    activities: ["Wildlife Viewing", "Bird Watching", "Nature Walks", "Conference Facilities"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "45 minutes from Sandton",
      coordinates: { lat: -25.7456, lng: 27.8834 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hartbeespoort, Magaliesberg Mountains"
    },
    capacity: { min: 15, max: 80 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 70
  },
  {
    id: "b0c1d2e3-f4a5-6789-3456-890123456789",
    name: "Magalies Park",
    venueType: 'mountain-retreat',
    summary: "Peaceful retreat alongside Magalies River in 120 hectares of scenic parklands with self-catering accommodation.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$85-160 / R1,550-2,900 per room - Book with us for up to 30% savings",
    activities: ["Nature Activities", "River Activities", "Leisure Activities", "Self-Catering"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "70 minutes from Sandton",
      coordinates: { lat: -25.7512, lng: 27.8345 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magalies River, North West Province"
    },
    capacity: { min: 10, max: 60 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 62
  }
];
