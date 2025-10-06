import { VenueType } from '../../types/venues';

export const magaliesbergVenues: VenueType[] = [
  {
    id: "c3d4e5f6-a7b8-9012-6789-123456789012",
    name: "Melody Hill Retreat",
    venueType: 'mountain-retreat',
    summary: "Wellness-focused country estate in pecan-nut orchard on Magalies River banks with self-catering options.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "R1050-R2100 / $58-115 per person per night",
    activities: ["Wellness Activities", "Nature Walks", "Yoga", "Fishing", "Games"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "60 minutes from Johannesburg",
      coordinates: { lat: -25.9834, lng: 27.5167 }
    },
    contact: {
      phone: "083 501-8406",
      email: "bookings@melodyhillretreat.co.za",
      address: "16 Seekoeihoek Road, Magaliesburg, 1791"
    },
    capacity: { min: 2, max: 22 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 85
  },
  {
    id: "d4e5f6a7-b8c9-0123-7890-234567890123",
    name: "Askari Game Lodge & Spa",
    venueType: 'bush-safari',
    summary: "Big 5 wildlife experience in malaria-free environment with 30 rooms, 5 conference rooms, and spa facilities.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$215-298 / R3,900-5,450 per room per night",
    activities: ["Game Drives", "Hiking", "Elephant Experiences", "Historical Tours", "Spa Treatments"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "70 minutes from Johannesburg",
      coordinates: { lat: -25.9123, lng: 27.5234 }
    },
    contact: {
      phone: "082 416 1340",
      email: "reservations@africanhillslodge.co.za",
      address: "R560, Doornspruit Road, Magaliesburg"
    },
    capacity: { min: 20, max: 96 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 90
  },
  {
    id: "e5f6a7b8-c9d0-1234-8901-345678901234",
    name: "Budmarsh Country Lodge",
    venueType: 'mountain-retreat',
    summary: "Five-star accommodation, dining, and conference facilities in charming country setting in Magaliesberg mountains.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$180-320 / R3,300-5,850 per room - Book with us for up to 30% savings",
    activities: ["Country Activities", "Mountain Views", "Luxury Dining"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "70 minutes from Johannesburg",
      coordinates: { lat: -25.8934, lng: 27.5345 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magaliesberg Mountains, Gauteng"
    },
    capacity: { min: 10, max: 80 },
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
    id: "f6a7b8c9-d0e1-2345-9012-456789012345",
    name: "Magalies Manor",
    venueType: 'mountain-retreat',
    summary: "Exclusive country establishment with 32 luxury rooms and 5+ dedicated conference rooms on Magalies River.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$200-380 / R3,650-6,950 per room - Book with us for up to 30% savings",
    activities: ["Bird Watching", "River Activities", "Nature Activities"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "60 minutes from Johannesburg",
      coordinates: { lat: -25.9045, lng: 27.5456 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magalies River, Magaliesburg"
    },
    capacity: { min: 15, max: 120 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 83
  },
  {
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    name: "Mokoya Lodge",
    venueType: 'bush-safari',
    summary: "Authentic African Country style setting on Magalies River banks between Hartbeespoort and Magaliesburg.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$90-170 / R1,650-3,100 per room - Book with us for up to 30% savings",
    activities: ["African Cultural Activities", "River Activities", "Nature Activities"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "65 minutes from Johannesburg",
      coordinates: { lat: -25.8756, lng: 27.5623 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Hekpoort, Magaliesburg"
    },
    capacity: { min: 10, max: 60 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 72
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    name: "Valley Lodge & Spa",
    venueType: 'boutique-venue',
    summary: "Award-winning accommodation and spa in nature reserve on Magalies River banks with extensive team building grounds.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$220-420 / R4,000-7,700 per room - Book with us for up to 30% savings",
    activities: ["Outdoor Team Building", "Spa Services", "Nature Activities"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "60 minutes from Johannesburg",
      coordinates: { lat: -25.9234, lng: 27.5389 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magalies River Nature Reserve, Magaliesburg"
    },
    capacity: { min: 20, max: 150 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 87
  },
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    name: "De Hoek Country Hotel",
    venueType: 'mountain-retreat',
    summary: "Four elegant conference rooms and luxury suites with extensive team building activities including hot air ballooning.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "R3850-R5000 / $210-275 per room (bed & breakfast)",
    activities: ["Hot Air Ballooning", "Competitive Cooking", "Murder Mystery Dinners", "Drumming"],
    location: {
      city: "Magaliesburg",
      area: "Magaliesburg",
      proximityToSandton: "65 minutes from Johannesburg",
      coordinates: { lat: -25.8967, lng: 27.5567 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Magaliesburg, Gauteng"
    },
    capacity: { min: 15, max: 100 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 80
  }
];
