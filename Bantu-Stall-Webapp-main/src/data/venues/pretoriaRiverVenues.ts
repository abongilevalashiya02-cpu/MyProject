import { VenueType } from '../../types/venues';

export const pretoriaRiverVenues: VenueType[] = [
  {
    id: "e9f0a1b2-c3d4-5678-2345-789012345678",
    name: "Mount Amanzi",
    venueType: 'bush-safari',
    summary: "Riverside resort with customizable team building, conference rooms for 10-500 delegates, and diverse activity options.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$120-280 / R2,200-5,100 per person per day - Book with us for up to 30% savings",
    activities: ["River Activities", "Fitness Challenges", "Potjiekos Competitions", "Craft Beer Tasting"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "50 minutes from Sandton",
      coordinates: { lat: -25.7389, lng: 27.8772 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hartbeespoort, Crocodile River Banks"
    },
    capacity: { min: 10, max: 500 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 85
  },
  {
    id: "f0a1b2c3-d4e5-6789-3456-890123456789",
    name: "Bushman's Rock Country Lodge",
    venueType: 'corporate-hotel',
    summary: "4-star luxury lodge with 48 bedrooms, popular for business seminars and corporate conferences with riverside location.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$150-270 / R2,750-4,950 per room - Book with us for up to 30% savings",
    activities: ["Putt-Putt", "Boma River Lapa", "Team Building Activities", "Corporate Fun"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "40 minutes from Sandton",
      coordinates: { lat: -25.7543, lng: 28.2156 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Pretoria, Hartbeesspruit"
    },
    capacity: { min: 10, max: 120 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 78
  },
  {
    id: "a1b2c3d4-e5f6-7890-4567-901234567890",
    name: "Oxbow Country Estate",
    venueType: 'boutique-venue',
    summary: "Countryside venue specializing in intimate groups of 10-40 delegates with lakeside setting and 4-star accommodation.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$110-200 / R2,000-3,650 per room - Book with us for up to 30% savings",
    activities: ["Day Fishing", "Fly Fishing Lessons", "Pedalo Boat Rides", "Walking Paths"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "60 minutes from Sandton",
      coordinates: { lat: -25.9123, lng: 28.7234 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Bronkhorstspruit, 25km from town"
    },
    capacity: { min: 10, max: 40 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 72
  },
  {
    id: "b2c3d4e5-f6a7-8901-5678-012345678901",
    name: "Amanzingwe Lodge",
    venueType: 'bush-safari',
    summary: "4-star rustic country lodge with creative staff for organizing business seminars and special functions.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$130-250 / R2,400-4,600 per room - Book with us for up to 30% savings",
    activities: ["Business Seminars", "Banquets", "Indoor Events", "Outdoor Functions"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "55 minutes from Sandton",
      coordinates: { lat: -25.7389, lng: 27.8723 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hartbeespoort"
    },
    capacity: { min: 20, max: 150 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 68
  }
];
