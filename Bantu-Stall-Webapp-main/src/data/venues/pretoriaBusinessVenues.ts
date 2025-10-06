
import { VenueType } from '../../types/venues';

export const pretoriaBusinessVenues: VenueType[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Galagos Country Estate",
    venueType: 'corporate-hotel',
    summary: "Four distinct conference venues with state-of-the-art equipment, accommodating from intimate groups to 240 delegates.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$120-250 / R2,200-4,600 per person per day - Book with us for up to 30% savings",
    activities: ["Workshops", "Brainstorming Sessions", "Team Building", "Custom Menus"],
    location: {
      city: "Pretoria",
      area: "Pretoria",
      proximityToSandton: "50 minutes from Sandton",
      coordinates: { lat: -25.7234, lng: 28.3445 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Pretoria East, Gauteng"
    },
    capacity: { min: 8, max: 240 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 75
  }
];
