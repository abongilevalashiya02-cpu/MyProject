import React from 'react';
import { Book, Video, Download, Map, Users, Star, Award, Flag, Globe, Handshake, Leaf } from "lucide-react";

export interface CourseResource {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  keyTopics?: string[];
  resources?: CourseResource[];
}

export const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Welcome to the Continent",
    description: "An introduction to Africa's scale, diversity, and cultural richness",
    keyTopics: [
      "Understand Africa's scale and diversity (54 countries, 2,000+ languages)",
      "Why Africa is more than a safari: heritage, innovation, culture",
      "How Bantu Stall helps you travel deeper"
    ],
    resources: [
      {
        title: "Interactive Map Quiz",
        url: "/resources/map-quiz",
        icon: <Map className="h-4 w-4" />
      },
      {
        title: "Welcome Video",
        url: "/resources/welcome-video",
        icon: <Video className="h-4 w-4" />
      }
    ]
  },
  {
    id: 2,
    title: "Know Before You Go",
    description: "Essential preparation for a smooth and enjoyable journey",
    keyTopics: [
      "Country-specific essentials (visa, currency, plug types)",
      "Vaccinations, insurance, and what to pack",
      "Common travel mistakes first-timers make"
    ],
    resources: [
      {
        title: "Country Essentials Checklist",
        url: "/resources/country-checklist",
        icon: <Download className="h-4 w-4" />
      },
      {
        title: "Regional Packing Lists",
        url: "/resources/packing-lists",
        icon: <Download className="h-4 w-4" />
      }
    ]
  },
  {
    id: 3,
    title: "Cultural Etiquette & Ubuntu",
    description: "Understanding the philosophy of Ubuntu and cultural protocols",
    keyTopics: [
      "What is Ubuntu and why it matters on your journey",
      "Greetings, tipping, photo etiquette, dos and don'ts",
      "Respecting elders, ceremonies, dress codes"
    ],
    resources: [
      {
        title: "Cultural Response Quiz",
        url: "/resources/cultural-quiz",
        icon: <Users className="h-4 w-4" />
      },
      {
        title: "Ubuntu Philosophy Guide",
        url: "/resources/ubuntu-guide",
        icon: <Download className="h-4 w-4" />
      }
    ]
  },
  {
    id: 4,
    title: "Staying Safe and Healthy",
    description: "Practical advice for health, safety, and navigating with confidence",
    keyTopics: [
      "Malaria, sun exposure, clean water, food safety tips",
      "Getting around: transport options and apps to download",
      "Emergency numbers by region"
    ],
    resources: [
      {
        title: "Emergency Contacts by Country",
        url: "/resources/emergency-contacts",
        icon: <Download className="h-4 w-4" />
      },
      {
        title: "Local SIM Cards Map",
        url: "/resources/sim-cards-map",
        icon: <Map className="h-4 w-4" />
      }
    ]
  },
  {
    id: 5,
    title: "Connecting with Locals",
    description: "Building authentic relationships and meaningful interactions",
    keyTopics: [
      "How to engage authentically without being extractive",
      "Social media ethics when photographing people",
      "Language tips: 5 phrases to learn in Swahili, French, Zulu, or Portuguese"
    ],
    resources: [
      {
        title: "Printable Phrase Flashcards",
        url: "/resources/phrase-cards",
        icon: <Download className="h-4 w-4" />
      },
      {
        title: "Ethical Photography Guide",
        url: "/resources/ethical-photos",
        icon: <Download className="h-4 w-4" />
      }
    ]
  },
  {
    id: 6,
    title: "Traveling Sustainably",
    description: "Making positive impact through thoughtful travel choices",
    keyTopics: [
      "Supporting local businesses and female/youth-owned experiences",
      "Using Culture Tokens to reward ethical travel",
      "Choosing eco-accommodation and reducing your footprint"
    ],
    resources: [
      {
        title: "Sustainability Pledge Template",
        url: "/resources/sustainability-pledge",
        icon: <Star className="h-4 w-4" />
      },
      {
        title: "Eco-Journey Options",
        url: "/resources/eco-journeys",
        icon: <Leaf className="h-4 w-4" />
      }
    ]
  },
  {
    id: 7,
    title: "Your Cultural Travel Checklist",
    description: "Final preparation and certification for your journey",
    keyTopics: [
      "Custom checklist generator based on the region you're visiting",
      "Quick survey to reflect on what Ubuntu means to you",
      "Certificate: Earn a \"Culture Confident Traveler\" badge"
    ],
    resources: [
      {
        title: "Custom Travel Checklist",
        url: "/resources/custom-checklist",
        icon: <Download className="h-4 w-4" />
      },
      {
        title: "Culture Confident Certificate",
        url: "/resources/certificate",
        icon: <Award className="h-4 w-4" />
      }
    ]
  }
];
