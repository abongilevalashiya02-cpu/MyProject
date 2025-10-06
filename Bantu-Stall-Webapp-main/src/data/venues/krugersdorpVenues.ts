
import { VenueType } from '../../types/venues';

export const krugersdorpVenues: VenueType[] = [
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    name: "Misty Hills Country Hotel, Conference Centre & Spa",
    venueType: 'corporate-hotel',
    summary: "Large venue with 195 rooms and 23 meeting rooms, offering comprehensive conference facilities and spa services.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$44-677 / R800-12,400 per room - Book with us for up to 30% savings",
    activities: ["Spa Services", "Conference Facilities", "Hotel Amenities"],
    location: {
      city: "Krugersdorp",
      area: "Krugersdorp",
      proximityToSandton: "35 minutes from Sandton",
      coordinates: { lat: -26.0856, lng: 27.7756 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Krugersdorp, West Rand"
    },
    capacity: { min: 20, max: 1000 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 85
  },
  {
    id: "d0e1f2a3-b4c5-6789-3456-890123456789",
    name: "Vivari Hotel And Spa",
    venueType: 'boutique-venue',
    summary: "Boutique hotel with 48 rooms and 3 meeting rooms, featuring spa facilities for intimate corporate events.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$85-180 / R1,550-3,300 per room - Book with us for up to 30% savings",
    activities: ["Spa Services", "Intimate Meetings", "Luxury Accommodation"],
    location: {
      city: "Krugersdorp",
      area: "Krugersdorp",
      proximityToSandton: "40 minutes from Sandton",
      coordinates: { lat: -26.0923, lng: 27.7823 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Krugersdorp, West Rand"
    },
    capacity: { min: 8, max: 50 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 72
  },
  {
    id: "e1f2a3b4-c5d6-7890-4567-901234567890",
    name: "Kloofzicht Lodge",
    venueType: 'bush-safari',
    summary: "Lodge with 60 rooms and 5 meeting rooms, offering bushveld retreat experience near Johannesburg.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$90-160 / R1,650-2,900 per room - Book with us for up to 30% savings",
    activities: ["Bushveld Activities", "Nature Walks", "Wildlife Viewing"],
    location: {
      city: "Krugersdorp",
      area: "Krugersdorp",
      proximityToSandton: "45 minutes from Sandton",
      coordinates: { lat: -26.1045, lng: 27.7645 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Krugersdorp, West Rand"
    },
    capacity: { min: 10, max: 70 },
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
