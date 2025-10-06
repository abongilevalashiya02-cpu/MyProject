
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  content: React.ReactNode;
}

export const categoryData: CategoryData[] = [
  {
    id: "tourGuides",
    name: "Tour Guides & Experience Creators",
    description: "Cultural historians, adventure specialists, immersive experience designers, translators",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🗺️</span> Manage Tour Packages
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">👥</span> Offer Private/Group Experiences
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📅</span> Update Availability
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Popular in your category:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Cultural History</Badge>
            <Badge variant="secondary">Adventure Tours</Badge>
            <Badge variant="secondary">City Walks</Badge>
            <Badge variant="secondary">Food Exploration</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "eventPlanners",
    name: "Event Planners & Hospitality Experts",
    description: "Wedding coordinators, retreat organizers, bespoke travel concierges",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🎉</span> Create Event Listings
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📋</span> Track Inquiries & Bookings
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🤝</span> Collaborate with Vendors
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Event Types:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Weddings</Badge>
            <Badge variant="secondary">Retreats</Badge>
            <Badge variant="secondary">Corporate Events</Badge>
            <Badge variant="secondary">Cultural Celebrations</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "photographers",
    name: "Photographers & Content Creators",
    description: "Travel documentarians, social media strategists, drone operators",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📸</span> Offer Photography Services
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🖼️</span> Upload Portfolio
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📝</span> Manage Content Licensing
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Portfolio Showcase:</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: "culinaryExperts",
    name: "Culinary Experts",
    description: "Private chefs, food tour guides, mixologists",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🍳</span> Private Dining Experiences
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🥘</span> Food Tours & Tastings
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🍽️</span> Restaurant Collaborations
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Culinary Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Traditional Cuisine</Badge>
            <Badge variant="secondary">Street Food Tours</Badge>
            <Badge variant="secondary">Cooking Classes</Badge>
            <Badge variant="secondary">Wine Tasting</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "wellness",
    name: "Wellness & Lifestyle Professionals",
    description: "Yoga instructors, massage therapists, personal trainers",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🧘</span> List Wellness Experiences
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🏋️</span> Set Up Training Sessions
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📅</span> Manage Schedule
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Popular Services:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Yoga Classes</Badge>
            <Badge variant="secondary">Wellness Retreats</Badge>
            <Badge variant="secondary">Meditation</Badge>
            <Badge variant="secondary">Spa Services</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "transport",
    name: "Transport & Logistics Providers",
    description: "Private drivers, local fixers, unique transport service providers",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🚗</span> List Transport Services
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🚕</span> Track Ride Requests
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🧳</span> Offer Concierge Transport
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Vehicle Types:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Standard Vehicles</Badge>
            <Badge variant="secondary">Luxury Cars</Badge>
            <Badge variant="secondary">Off-road Vehicles</Badge>
            <Badge variant="secondary">Unique Transportation</Badge>
          </div>
        </div>
      </div>
    )
  },
];
