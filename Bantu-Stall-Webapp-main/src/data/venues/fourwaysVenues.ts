
import { VenueType } from '../../types/venues';

export const fourwaysVenues: VenueType[] = [
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    name: "Indaba Hotel",
    venueType: 'corporate-hotel',
    summary: "Versatile venues in lush gardens for small meetings to large corporate events with customizable catering.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$110-190 / R2,000-3,500 per person per day - Book with us for up to 30% savings",
    activities: ["Adventurous Challenges", "Tailored Workshops", "Banquets"],
    location: {
      city: "Fourways",
      area: "Fourways",
      proximityToSandton: "15 minutes from Sandton",
      coordinates: { lat: -26.0123, lng: 28.0234 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Cnr Winnie Mandela Drive & Peter Wenning Road, Fourways"
    },
    capacity: { min: 8, max: 200 },
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
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    name: "Hoopoe Haven Lodge",
    venueType: 'boutique-venue',
    summary: "Open thatch conference center overlooking landscaped gardens with group accommodation for up to 40.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$80-140 / R1,450-2,550 per person per day - Book with us for up to 30% savings",
    activities: ["Brainstorming Sessions", "Strategy Meetings", "Mobile Spa Services"],
    location: {
      city: "Fourways",
      area: "Fourways",
      proximityToSandton: "20 minutes from Sandton",
      coordinates: { lat: -26.0234, lng: 28.0345 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Chartwell, Fourways"
    },
    capacity: { min: 5, max: 40 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 65
  }
];
