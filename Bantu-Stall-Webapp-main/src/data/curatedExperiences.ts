export interface CuratedExperience {
  id: number;
  title: string;
  hook: string;
  description: string;
  location: string;
  duration: string;
  groupSize: string;
  price: string;
  priceNote: string;
  image: string;
  category: 'business' | 'cultural' | 'belonging';
  categoryLabel: string;
}

export const curatedExperiences = {
  business: [
    {
      id: 101,
      title: "Networking on the Nile",
      hook: "Share a river cruise with African founders and investors in Uganda's startup scene.",
      description: "An exclusive 3-day river cruise combining scenic beauty with meaningful business connections. Join Uganda's most innovative entrepreneurs and international investors for intimate conversations and collaborative opportunities.",
      location: "Kampala, Uganda",
      duration: "3 days",
      groupSize: "12-16 professionals",
      price: "From $2,850",
      priceNote: "All-inclusive",
      image: "/lovable-uploads/e16ff384-beff-4a3d-abf0-0f3d82450ac8.png",
      category: "business" as const,
      categoryLabel: "Business Growth"
    },
    {
      id: 102,
      title: "Boardroom to Baobab",
      hook: "Take leadership masterclasses under ancient trees in Madagascar—with speakers from global TEDx stages.",
      description: "Experience transformative leadership development in nature's boardroom. Learn from TEDx speakers and global thought leaders while surrounded by Madagascar's iconic baobab trees and unique biodiversity.",
      location: "Morondava, Madagascar",
      duration: "5 days",
      groupSize: "8-12 executives",
      price: "From $4,200",
      priceNote: "Premium package",
      image: "/lovable-uploads/e7743d33-9cd7-4d2d-9af1-823ae8d66f6b.png",
      category: "business" as const,
      categoryLabel: "Business Growth"
    },
    {
      id: 103,
      title: "G20 Side events tour",
      hook: "Walk where global deals were made and end with a private dinner hosted by African business champions.",
      description: "Exclusive access to G20 summit venues and behind-the-scenes insights from African business leaders who shaped global policy. Includes private dinners with government officials and industry titans.",
      location: "Johannesburg, South Africa",
      duration: "4 days",
      groupSize: "6-10 leaders",
      price: "From $3,500",
      priceNote: "VIP access included",
      image: "/lovable-uploads/affc4d7b-1b85-4866-8d0b-a4b1ff1acfc3.png",
      category: "business" as const,
      categoryLabel: "Business Growth"
    }
  ],
  cultural: [
    {
      id: 201,
      title: "Walk with Lions – Leadership Edition",
      hook: "Learn decision-making in the wild while tracking lions in Zimbabwe.",
      description: "Combine wildlife conservation with leadership development. Learn decision-making, risk assessment, and team dynamics while walking with lions in their natural habitat alongside experienced guides and leadership coaches.",
      location: "Hwange National Park, Zimbabwe",
      duration: "6 days",
      groupSize: "6-8 participants",
      price: "From $3,800",
      priceNote: "Conservation fee included",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "cultural" as const,
      categoryLabel: "Cultural Immersion"
    },
    {
      id: 202,
      title: "Mopane Masterclass: Brave Taste, Bold Culture",
      hook: "Taste, cook, and reflect on resilience through African cuisine.",
      description: "Dive deep into African culinary traditions and their cultural significance. Learn to prepare traditional dishes while exploring themes of resilience, community, and cultural preservation with local chefs and historians.",
      location: "Francistown, Botswana",
      duration: "4 days",
      groupSize: "8-12 food enthusiasts",
      price: "From $1,950",
      priceNote: "Culinary workshops included",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "cultural" as const,
      categoryLabel: "Cultural Immersion"
    },
    {
      id: 203,
      title: "Drum Circle Diplomacy",
      hook: "Join tribal elders in Botswana for an evening of drumming, debate, and storytelling.",
      description: "Experience traditional conflict resolution and community building through music and storytelling. Learn from tribal elders about consensus-building, cultural wisdom, and the power of shared rhythm.",
      location: "Ghanzi, Botswana",
      duration: "3 days",
      groupSize: "10-15 participants",
      price: "From $1,650",
      priceNote: "Cultural immersion package",
      image: "/lovable-uploads/9e21eac0-9059-4509-987f-77aa35d82b82.png",
      category: "cultural" as const,
      categoryLabel: "Cultural Immersion"
    }
  ],
  belonging: [
    {
      id: 301,
      title: "The Ubuntu Village Retreat (Lesotho)",
      hook: "Experience homegrown hospitality where every traveler becomes family.",
      description: "Immerse yourself in the philosophy of Ubuntu through authentic village life. Stay with local families, participate in daily activities, and discover how community values shape personal growth and belonging.",
      location: "Malealea, Lesotho",
      duration: "5 days",
      groupSize: "4-8 travelers",
      price: "From $1,400",
      priceNote: "Community contribution included",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "belonging" as const,
      categoryLabel: "Sense of Belonging"
    },
    {
      id: 302,
      title: "Stories at Sunset – Zanzibar Coast",
      hook: "Dive into Swahili wisdom with changemakers and coastal poets under the stars.",
      description: "Evening gatherings on pristine beaches with local poets, storytellers, and social changemakers. Explore themes of identity, belonging, and cultural heritage through oral traditions and contemporary narratives.",
      location: "Zanzibar, Tanzania",
      duration: "4 days",
      groupSize: "8-12 seekers",
      price: "From $2,200",
      priceNote: "Sunset sessions included",
      image: "/lovable-uploads/087d5ad7-bb62-4295-9c43-89f6310dd99a.png",
      category: "belonging" as const,
      categoryLabel: "Sense of Belonging"
    },
    {
      id: 303,
      title: "Cape Town Soul Walks",
      hook: "A guided inner journey through Robben Island, District Six, and a rooftop dialogue on healing.",
      description: "Reflective walks through Cape Town's most significant historical sites, guided by local historians and healing practitioners. Explore themes of reconciliation, healing, and finding belonging in post-apartheid South Africa.",
      location: "Cape Town, South Africa",
      duration: "3 days",
      groupSize: "6-10 reflective travelers",
      price: "From $1,850",
      priceNote: "Healing sessions included",
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "belonging" as const,
      categoryLabel: "Sense of Belonging"
    }
  ]
};

export type CuratedExperiencesData = typeof curatedExperiences;
