import { VenueType } from '../../types/venues';

export const vaalVenues: VenueType[] = [
  {
    id: "a5b6c7d8-e9f0-1234-8901-345678901234",
    name: "Riviera On Vaal Hotel & Country Club",
    venueType: 'corporate-hotel',
    summary: "Luxurious resort catering to both business and leisure travelers, featuring 79 guest rooms and 3 meeting rooms.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$120-180 / R2,200-3,300 per room - Book with us for up to 30% savings",
    activities: ["Weddings & Functions", "Spa Services", "Resort Activities"],
    location: {
      city: "Vaal River",
      area: "Vaal River",
      proximityToSandton: "45 minutes from Johannesburg",
      coordinates: { lat: -26.6612, lng: 27.9467 }
    },
    contact: {
      phone: "016 100 5027",
      email: "info@rovresort.co.za",
      address: "1930 Mario Milani Dr, Vereeniging, 1939"
    },
    capacity: { min: 10, max: 172 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 75
  },
  {
    id: "b6c7d8e9-f0a1-2345-9012-456789012345",
    name: "Klip River Country Estate",
    venueType: 'urban-conference',
    summary: "Conference facilities ideal for small to medium conferences with various halls accommodating 12-350 delegates.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$80-150 / R1,450-2,750 per person per day - Book with us for up to 30% savings",
    activities: ["Corporate Functions", "Training Sessions", "Conferencing"],
    location: {
      city: "Vaal Triangle",
      area: "Vaal Triangle",
      proximityToSandton: "50 minutes from Sandton",
      coordinates: { lat: -26.7089, lng: 27.8634 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Vaal Triangle, Gauteng"
    },
    capacity: { min: 12, max: 350 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 68
  },
  {
    id: "c7d8e9f0-a1b2-3456-0123-567890123456",
    name: "Riverside Sun",
    venueType: 'corporate-hotel',
    summary: "Vaal River venue with 11 flexible conference venues accommodating 10-500 guests, including wine cellar for tastings.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$95-220 / R1,750-4,000 per person per day - Book with us for up to 30% savings",
    activities: ["Team Building", "Wine Tastings", "Whisky Tastings", "Beer Tastings"],
    location: {
      city: "Vaal River",
      area: "Vaal River",
      proximityToSandton: "60 minutes from Johannesburg",
      coordinates: { lat: -26.7123, lng: 27.8456 }
    },
    contact: {
      phone: "+27 16 982 7300",
      email: "Book with us for up to 30% savings",
      address: "Corner of Wenning and Emfuleni Drive, Vanderbijlpark"
    },
    capacity: { min: 10, max: 500 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 82
  },
  {
    id: "d8e9f0a1-b2c3-4567-1234-678901234567",
    name: "Emerald Resort & Casino",
    venueType: 'corporate-hotel',
    summary: "Large resort capable of hosting conferences for up to 3000 delegates with flexible meeting rooms and entertainment.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$110-280 / R2,000-5,100 per person per day - Book with us for up to 30% savings",
    activities: ["Team Building", "Resort Entertainment", "Casino Activities"],
    location: {
      city: "Vaal",
      area: "Vaal",
      proximityToSandton: "45 minutes from Johannesburg",
      coordinates: { lat: -26.6534, lng: 27.9123 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Vaal Area, Gauteng"
    },
    capacity: { min: 50, max: 3000 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 88
  }
];
