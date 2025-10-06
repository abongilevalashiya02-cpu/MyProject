
import { VenueType } from '../../types/venues';

export const pretoriaWinelandsVenues: VenueType[] = [
  {
    id: "f2a3b4c5-d6e7-8901-5678-012345678901",
    name: "Kievits Kroon Gauteng Wine Estate",
    venueType: 'wine-estate',
    summary: "The Winelands in Gauteng with Cape Dutch architecture, 142 rooms, wellness spa, and 22 conference venues.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$180-350 / R3,300-6,400 per room - Book with us for up to 30% savings",
    activities: ["Spa Services", "Gourmet Dining", "Wine Tasting", "Team Building"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "45 minutes from Sandton",
      coordinates: { lat: -25.7461, lng: 28.2292 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Pretoria, Gauteng"
    },
    capacity: { min: 10, max: 300 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 88
  },
  {
    id: "a3b4c5d6-e7f8-9012-6789-123456789012",
    name: "La Montagne Guest House",
    venueType: 'mountain-retreat',
    summary: "Luxury guest house on Witwatersand Mountains overlooking Hartbeespoort Dam valley with impeccable service.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$200-320 / R3,650-5,850 per room - Book with us for up to 30% savings",
    activities: ["Golf Course Access", "Shopping", "Dining", "Scenic Views"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "55 minutes from Sandton",
      coordinates: { lat: -25.7278, lng: 27.8789 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Witwatersand Mountains, Hartbeespoort"
    },
    capacity: { min: 8, max: 40 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 73
  },
  {
    id: "b4c5d6e7-f8a9-0123-7890-234567890123",
    name: "La Dolce Vita Guest House",
    venueType: 'boutique-venue',
    summary: "Boutique hotel on Hartbeespoort Dam edge with luxury rooms and Magaliesberg Mountain backdrop.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$150-280 / R2,750-5,100 per room - Book with us for up to 30% savings",
    activities: ["Relaxation", "Scenic Views", "Al Fresco Dining", "Mountain Views"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "60 minutes from Sandton",
      coordinates: { lat: -25.7345, lng: 27.8656 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hartbeespoort Dam, Magaliesberg"
    },
    capacity: { min: 5, max: 30 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 65
  }
];
