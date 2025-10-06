
import { VenueType } from '../../types/venues';

export const centurionVenues: VenueType[] = [
  {
    id: "c1d2e3f4-a5b6-7890-4567-901234567890",
    name: "42 on King Guesthouse",
    venueType: 'boutique-venue',
    summary: "Eco-friendly 4-star guesthouse in Irene Centurion offering a country escape within the city.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$90-160 / R1,650-2,900 per room - Book with us for up to 30% savings",
    activities: ["Small Meetings", "Eco Tours", "Country Retreat Experience"],
    location: {
      city: "Centurion",
      area: "Centurion",
      proximityToSandton: "35 minutes from Sandton",
      coordinates: { lat: -25.8632, lng: 28.1891 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Irene, Centurion"
    },
    capacity: { min: 2, max: 10 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 68
  },
  {
    id: "d2e3f4a5-b6c7-8901-5678-012345678901",
    name: "23 on Riverside",
    venueType: 'bush-safari',
    summary: "25-hectare wildlife estate with 4-star accommodation and tranquility of the Crocodile River.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$130-250 / R2,400-4,600 per room - Book with us for up to 30% savings",
    activities: ["Raft Building", "Wildlife Viewing", "River Activities"],
    location: {
      city: "Centurion",
      area: "Centurion",
      proximityToSandton: "40 minutes from Sandton",
      coordinates: { lat: -25.8543, lng: 28.2105 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Crocodile River, Centurion"
    },
    capacity: { min: 10, max: 80 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 75
  },
  {
    id: "e3f4a5b6-c7d8-9012-6789-123456789012",
    name: "The Royal Elephant Hotel",
    venueType: 'corporate-hotel',
    summary: "North African elegance on the banks of Hennops River with specialized team building activities.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$180-320 / R3,300-5,850 per room - Book with us for up to 30% savings",
    activities: ["Resilience Training", "Corporate Fun", "River Activities"],
    location: {
      city: "Centurion",
      area: "Centurion",
      proximityToSandton: "38 minutes from Sandton",
      coordinates: { lat: -25.8721, lng: 28.2234 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hennops River, Centurion"
    },
    capacity: { min: 15, max: 150 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 85
  },
  {
    id: "f4a5b6c7-d8e9-0123-7890-234567890123",
    name: "ANEW Hotel Centurion",
    venueType: 'corporate-hotel',
    summary: "7 unique conference venues seating up to 220 delegates in modern facilities.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$150-280 / R2,750-5,100 per room - Book with us for up to 30% savings",
    activities: ["Large Conferences", "Corporate Events", "Multi-room Meetings"],
    location: {
      city: "Centurion",
      area: "Centurion",
      proximityToSandton: "30 minutes from Sandton",
      coordinates: { lat: -25.8567, lng: 28.1823 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Central Centurion"
    },
    capacity: { min: 20, max: 220 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 82
  }
];
