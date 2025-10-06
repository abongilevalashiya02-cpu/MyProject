
import { VenueType } from '../../types/venues';

export const midrandVenues: VenueType[] = [
  {
    id: "f6a7b8c9-d0e1-2345-f012-456789012345",
    name: "Accolades Boutique Venue",
    venueType: 'boutique-venue',
    summary: "Centrally located between Johannesburg and Pretoria with 3,615 sq. ft. of meeting space for corporate events.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$120-200 / R2,200-3,650 per person per day - Book with us for up to 30% savings",
    activities: ["Team Building", "Corporate Events", "Year-end Functions"],
    location: {
      city: "Midrand",
      area: "Midrand",
      proximityToSandton: "25 minutes from Sandton",
      coordinates: { lat: -25.9891, lng: 28.1305 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Central Midrand"
    },
    capacity: { min: 10, max: 120 },
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
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    name: "Gum Tree Manor",
    venueType: 'boutique-venue',
    summary: "Serene backdrop in Glen Austin with 8 guest rooms and customizable packages for corporate retreats.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$85-150 / R1,550-2,750 per person per day - Book with us for up to 30% savings",
    activities: ["Business Seminars", "Corporate Retreats", "Customizable Activities"],
    location: {
      city: "Midrand",
      area: "Midrand",
      proximityToSandton: "20 minutes from Sandton",
      coordinates: { lat: -25.9743, lng: 28.1239 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Glen Austin, Midrand"
    },
    capacity: { min: 5, max: 25 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 60
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    name: "City Lodge Hotel Waterfall City",
    venueType: 'corporate-hotel',
    summary: "Modern hotel with 149 rooms in the heart of Waterfall City commercial district.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$140-220 / R2,550-4,000 per room - Book with us for up to 30% savings",
    activities: ["Corporate Meetings", "Business Events", "Conference Facilities"],
    location: {
      city: "Midrand",
      area: "Midrand",
      proximityToSandton: "15 minutes from Sandton",
      coordinates: { lat: -25.9456, lng: 28.0891 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Waterfall City, Midrand"
    },
    capacity: { min: 10, max: 200 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 80
  }
];
