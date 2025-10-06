import { VenueType } from '../../types/venues';

export const muldersdriftVenues: VenueType[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Valverde Eco Hotel",
    venueType: 'boutique-venue',
    summary: "Eco-friendly CSR-aligned venue with aquaponics farm and sustainability focus, 10 minutes from Lanseria.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "Vr4Rd2tt-O8",
    pricingSnapshot: "$140-280 / R2,550-5,100 per room - Book with us for up to 30% savings",
    activities: ["Potjiekos Challenge", "Aquaponics Tour", "Spa Services", "Team Building"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "45 minutes from Sandton",
      coordinates: { lat: -25.8738, lng: 27.8846 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Muldersdrift, near Lanseria Airport"
    },
    capacity: { min: 5, max: 150 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 85
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Avianto",
    venueType: 'corporate-hotel',
    summary: "Luxury resort-style experience with wellness focus, perfect for creative retreats and corporate celebrations.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "CQtIWpmZ2SU",
    pricingSnapshot: "$200-450 / R3,650-8,250 per room - Book with us for up to 30% savings",
    activities: ["Corporate Massage", "Movie Nights", "Health & Fitness", "Ballroom Events"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "40 minutes from Sandton",
      coordinates: { lat: -25.8856, lng: 27.8901 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Plot 69, R114 Driefontein Road, Muldersdrift, 1747"
    },
    capacity: { min: 2, max: 250 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 95
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Glenburn Lodge",
    venueType: 'bush-safari',
    summary: "Large venue in World Heritage Site, ideal for strategy sessions and product launches with 22 conference venues.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$150-320 / R2,750-5,850 per person per day - Book with us for up to 30% savings",
    activities: ["River Rung Dung Hike", "Cookery Classes", "Amazing Race", "Murder by Numbers"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "30 minutes from Sandton",
      coordinates: { lat: -25.8723, lng: 27.8912 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Cradle of Humankind World Heritage Site"
    },
    capacity: { min: 6, max: 300 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 80
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Cradle Moon",
    venueType: 'bush-safari',
    summary: "Nature-focused venue with transparent pricing and top-tier outdoor team-building in 1600-hectare conservancy.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "pCaB3nsCjZ0",
    pricingSnapshot: "$120-250 / R2,200-4,600 per person per day - Book with us for up to 30% savings",
    activities: ["Mountain Biking", "Game Drives", "Boat Cruises", "Hot Air Ballooning", "Raft Building"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "20 minutes from Sandton",
      coordinates: { lat: -25.8645, lng: 27.8734 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Cradle Moon Conservancy, Muldersdrift"
    },
    capacity: { min: 10, max: 200 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 90
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Misty Hills",
    venueType: 'boutique-venue',
    summary: "Boutique African luxury in botanical gardens, perfect for brand-immersive wellness retreats.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$170-300 / R3,100-5,500 per room - Book with us for up to 30% savings",
    activities: ["Botanical Garden Tours", "Spa Services", "Authentic African Experiences"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "35 minutes from Sandton",
      coordinates: { lat: -25.8789, lng: 27.8823 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Kromdraai Valley, Muldersdrift"
    },
    capacity: { min: 10, max: 100 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 75
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Bush Willow Camp",
    venueType: 'bush-safari',
    summary: "Rustic tented camp for immersive back-to-basics team bonding surrounded by indigenous bush.",
    bantuRating: 3,
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$80-140 / R1,450-2,550 per person per night - Book with us for up to 30% savings",
    activities: ["Bush Walks", "Campfire Sessions", "Survival Challenges", "Star Gazing"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "30 minutes from Sandton",
      coordinates: { lat: -25.8701, lng: 27.8889 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Within Glenburn Lodge grounds"
    },
    capacity: { min: 5, max: 40 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: false,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 65
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    name: "26D South",
    venueType: 'boutique-venue',
    summary: "Designer venue where cosmopolitan meets tranquility, perfect for exclusive high-end brand retreats.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$220-380 / R4,000-6,950 per room - Book with us for up to 30% savings",
    activities: ["Designer Workshops", "Luxury Experiences", "Bespoke Events"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "35 minutes from Sandton",
      coordinates: { lat: -25.8812, lng: 27.8756 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Muldersdrift Designer District"
    },
    capacity: { min: 8, max: 80 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 70
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "LieuDeGrace",
    venueType: 'urban-conference',
    summary: "Industrial chic warehouse for innovative teams and creative workshops with state-of-the-art facilities.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    pricingSnapshot: "$160-280 / R2,900-5,100 per person per day - Book with us for up to 30% savings",
    activities: ["Creative Workshops", "Product Launches", "Innovation Sessions", "Catering"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "32 minutes from Sandton",
      coordinates: { lat: -25.8767, lng: 27.8834 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Industrial District, Muldersdrift"
    },
    capacity: { min: 10, max: 120 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 78
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    name: "Budmarsh Country Lodge",
    venueType: 'mountain-retreat',
    summary: "Charming country lodge in peaceful surroundings, perfect for intimate corporate retreats and team building experiences.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "cmvNyqmGV7E",
    pricingSnapshot: "$180-320 / R3,300-5,850 per room - Book with us for up to 30% savings",
    activities: ["Country Walks", "Team Building", "Corporate Dinners", "Nature Activities"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "38 minutes from Sandton",
      coordinates: { lat: -25.8756, lng: 27.8798 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Country Lodge Estate, Muldersdrift"
    },
    capacity: { min: 8, max: 60 },
    features: {
      ecoFriendly: true,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 73
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "LaMontagne Guest House",
    venueType: 'mountain-retreat',
    summary: "Elegant guest house offering intimate accommodation and meeting facilities in a serene mountain setting.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "AyYMHynPQ4I",
    pricingSnapshot: "$160-290 / R2,900-5,300 per room - Book with us for up to 30% savings",
    activities: ["Mountain Views", "Peaceful Retreats", "Executive Meetings", "Garden Events"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "42 minutes from Sandton",
      coordinates: { lat: -25.8823, lng: 27.8712 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Mountain View Estate, Muldersdrift"
    },
    capacity: { min: 6, max: 45 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 68
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Valley Lodge & Spa",
    venueType: 'boutique-venue',
    summary: "Luxurious spa lodge nestled in the valley, offering premium wellness experiences and corporate retreat facilities.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "3TrAc0tnGPM",
    pricingSnapshot: "$250-450 / R4,550-8,200 per room - Book with us for up to 30% savings",
    activities: ["Spa Treatments", "Wellness Programs", "Corporate Retreats", "Valley Activities"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "36 minutes from Sandton",
      coordinates: { lat: -25.8890, lng: 27.8745 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Valley Estate, Muldersdrift"
    },
    capacity: { min: 10, max: 120 },
    features: {
      ecoFriendly: true,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: true,
    popularity: 88
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    name: "Cradle Boutique Hotel",
    venueType: 'boutique-venue',
    summary: "Boutique hotel experience in the heart of the Cradle of Humankind, offering sophisticated accommodation and conference facilities.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "qGFHb1dkwPc",
    pricingSnapshot: "$200-380 / R3,650-6,950 per room - Book with us for up to 30% savings",
    activities: ["Heritage Tours", "Boutique Experiences", "Corporate Events", "Cultural Activities"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "32 minutes from Sandton",
      coordinates: { lat: -25.8634, lng: 27.8823 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Cradle of Humankind Heritage Site"
    },
    capacity: { min: 12, max: 150 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 84
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    name: "Indaba",
    venueType: 'urban-conference',
    summary: "Contemporary conference and event venue designed for modern corporate gatherings and innovative team sessions.",
    bantuRating: 4,
    coverImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "xczyooLpU3o",
    pricingSnapshot: "$140-260 / R2,550-4,750 per person per day - Book with us for up to 30% savings",
    activities: ["Modern Conferences", "Innovation Sessions", "Team Workshops", "Corporate Events"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "28 minutes from Sandton",
      coordinates: { lat: -25.8712, lng: 27.8856 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Modern Conference District, Muldersdrift"
    },
    capacity: { min: 15, max: 200 },
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: true,
      outdoorFocus: false
    },
    csrAlignment: false,
    popularity: 76
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    name: "The Royal Elephant Hotel",
    venueType: 'corporate-hotel',
    summary: "Premier luxury hospitality venue with royal-inspired design, comprehensive conference facilities, and executive retreat amenities for sophisticated corporate events.",
    bantuRating: 5,
    coverImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    videoId: "0oeZ8w57-es",
    pricingSnapshot: "$280-500 / R5,100-9,150 per room - Book with us for up to 30% savings",
    activities: ["Executive Boardroom Sessions", "Royal Dining Experiences", "Luxury Spa Treatments", "Golf Course Access", "Wine Tastings", "Cultural Heritage Tours"],
    location: {
      city: "Muldersdrift",
      area: "Muldersdrift",
      proximityToSandton: "25 minutes from Sandton",
      coordinates: { lat: -25.8798, lng: 27.8867 }
    },
    contact: {
      phone: "Book with us for up to 30% savings",
      email: "Book with us for up to 30% savings",
      address: "Royal District, Muldersdrift"
    },
    capacity: { min: 15, max: 300 },
    features: {
      ecoFriendly: false,
      luxury: true,
      indoorFocus: true,
      outdoorFocus: true
    },
    csrAlignment: false,
    popularity: 92
  }
];
