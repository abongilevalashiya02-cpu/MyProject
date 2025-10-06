
import { VenueType } from '../../types/venues';

export const lanseriaVenues: VenueType[] = [
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "The Cradle",
    venueType: 'cultural-heritage',
    summary: "Four event spaces in the Cradle of Humankind with well-equipped accommodation and AV capabilities.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$130-220 / R2,400-4,000 per person per day - Book with us for up to 30% savings",
    activities: ["Heritage Tours", "Nature Activities", "Corporate Events"],
    location: {
      city: "Lanseria",
      area: "Lanseria",
      proximityToSandton: "45 minutes from Sandton",
      coordinates: { lat: -25.9345, lng: 27.9267 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Kromdraai Road, The Cradle of Humankind"
    },
    capacity: { min: 10, max: 180 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 73
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Shumba Valley Lodge",
    venueType: 'corporate-hotel',
    summary: "6 meeting rooms with 627 total capacity, 70 guest rooms, and health spa near Lanseria Airport.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$160-280 / R2,900-5,100 per room - Book with us for up to 30% savings",
    activities: ["Health Spa", "Golf Course Access", "Outdoor Pool"],
    location: {
      city: "Lanseria",
      area: "Lanseria",
      proximityToSandton: "50 minutes from Sandton",
      coordinates: { lat: -25.9456, lng: 27.9123 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Pelindaba Road, Lanseria"
    },
    capacity: { min: 15, max: 627 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 76
  }
];
