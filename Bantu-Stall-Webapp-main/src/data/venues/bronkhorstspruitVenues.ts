
import { VenueType } from '../../types/venues';

export const bronkhorstspruitVenues: VenueType[] = [
  {
    id: "c5d6e7f8-a9b0-1234-8901-345678901234",
    name: "Sable House Country Retreat",
    venueType: 'mountain-retreat',
    summary: "Intimate country retreat with 12 rooms and dedicated meeting facilities for small corporate groups.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$70-120 / R1,280-2,200 per room - Book with us for up to 30% savings",
    activities: ["Country Retreat Activities", "Small Group Meetings", "Nature Activities"],
    location: {
      city: "Bronkhorstspruit",
      area: "Bronkhorstspruit",
      proximityToSandton: "75 minutes from Sandton",
      coordinates: { lat: -25.8234, lng: 28.7345 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Bronkhorstspruit Area, Gauteng"
    },
    capacity: { min: 5, max: 25 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 65
  },
  {
    id: "d6e7f8a9-b0c1-2345-9012-456789012345",
    name: "Zebra Country Lodge",
    venueType: 'bush-safari',
    summary: "Large country lodge with 71 rooms and comprehensive meeting facilities for medium to large corporate groups.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$95-170 / R1,750-3,100 per room - Book with us for up to 30% savings",
    activities: ["Country Lodge Activities", "Large Group Events", "Nature Activities"],
    location: {
      city: "Bronkhorstspruit",
      area: "Bronkhorstspruit",
      proximityToSandton: "80 minutes from Sandton",
      coordinates: { lat: -25.8456, lng: 28.7567 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Bronkhorstspruit Area, Gauteng"
    },
    capacity: { min: 20, max: 150 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 70
  },
  {
    id: "e7f8a9b0-c1d2-3456-0123-567890123456",
    name: "Meulstroom Lodge",
    venueType: 'bush-safari',
    summary: "Lodge with 54 rooms and meeting facility accommodating up to 50 standing delegates in tranquil setting.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$80-140 / R1,450-2,550 per room - Book with us for up to 30% savings",
    activities: ["Lodge Activities", "Medium Group Events", "Tranquil Retreat"],
    location: {
      city: "Bronkhorstspruit",
      area: "Bronkhorstspruit",
      proximityToSandton: "85 minutes from Sandton",
      coordinates: { lat: -25.8567, lng: 28.7789 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Bronkhorstspruit Area, Gauteng"
    },
    capacity: { min: 15, max: 50 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 68
  }
];
