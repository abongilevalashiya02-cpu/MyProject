import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, Backpack, BookOpen, Map, CheckCircle, Badge, FileText, Video, BarChart, Headphones } from "lucide-react";
import { ResourceCard } from '../components/ResourceCard';

interface IndustryOverviewProps {
  onNext: () => void;
  onPrevious: () => void;
}

const IndustryOverview: React.FC<IndustryOverviewProps> = ({ onNext, onPrevious }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          1. Overview of the African Tourism Industry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-bantu-orange/10 p-6 rounded-lg mb-6">
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8 text-bantu-orange mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Meet Fatou: Cultural Storytelling Success</h3>
              <p className="text-gray-700">
                Meet Fatou, a community builder from Senegal who used cultural storytelling tours to drive $100,000 in revenue last year. 
                Her innovative approach to combining authentic experiences with leadership development made her offerings particularly 
                attractive to global HR teams and wellness travelers.
              </p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <p>The African tourism industry represents one of the continent's most promising economic sectors, with tremendous potential for growth and development.</p>
                
          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Quick Check: Infrastructure Planning</h4>
            <p>You're building a retreat in Zambia and want to showcase natural attractions. What's a key infrastructure concern to check first?</p>
            
            <div className="space-y-3 mt-4">
              {['Road quality', 'Airport accessibility', 'Eco-regulations', 'All of the above'].map((option, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-2 border-bantu-orange flex items-center justify-center">
                    {index === 3 && <CheckCircle className="w-4 h-4 text-bantu-orange" />}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
          
          <h3>The economic impact of tourism on the continent</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Backpack className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold">Travel Agents</h4>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Align packages with authentic experiences</li>
                <li>• Tap into digital-savvy eco-niche travelers</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-600" />
                <h4 className="font-bold">HR & Team Builders</h4>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Use travel for leadership development</li>
                <li>• Design offsites supporting local economies</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h4 className="font-bold">L&D Heads</h4>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Integrate travel into cultural learning</li>
                <li>• Partner with cultural educators</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border my-6">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-6 w-6 text-bantu-orange" />
              <h3 className="font-bold text-lg">Tourism Opportunity Map</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Key Tourism Segments</h4>
                <div className="flex flex-wrap gap-2">
                  {['Adventure', 'Eco-tourism', 'Heritage', 'Wellness', 'Cultural'].map((segment) => (
                    <Badge key={segment} className="bg-gray-100 text-gray-800 hover:bg-gray-200">{segment}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Partnership Examples</h4>
                <ul className="text-sm space-y-2">
                  <li>• AfCFTA Tourism Initiatives</li>
                  <li>• Village-led Excursions</li>
                  <li>• Cross-border Tour Packages</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h3 className="font-bold text-lg mb-4">Reflect & Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Which opportunity resonates most with your organization?</label>
                <textarea 
                  className="w-full p-3 border rounded-md" 
                  rows={3}
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              <div>
                <label className="block font-medium mb-2">What's your biggest challenge in delivering authentic travel experiences?</label>
                <textarea 
                  className="w-full p-3 border rounded-md" 
                  rows={3}
                  placeholder="Describe your challenges..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="font-medium text-lg">Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            icon={<FileText className="h-5 w-5 text-bantu-orange" />}
            title="UNWTO Report on African Tourism"
            type="Reading"
            description="Comprehensive analysis of the current state of tourism in Africa"
          />
          <ResourceCard
            icon={<Video className="h-5 w-5 text-bantu-orange" />}
            title="Introduction to African Tourism Industry"
            type="Video Lecture"
            description="30-minute overview of the African tourism landscape"
          />
          <ResourceCard
            icon={<BarChart className="h-5 w-5 text-bantu-orange" />}
            title="Economic Impact of Tourism in Africa"
            type="Infographic"
            description="Visual representation of tourism's economic contribution"
          />
          <ResourceCard
            icon={<BookOpen className="h-5 w-5 text-bantu-orange" />}
            title="The Role of South Africa's Tourism Sector"
            type="Case Study"
            description="Analysis of tourism's impact on South Africa's economy"
          />
        </div>
      </CardContent>

      <div className="flex justify-between p-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Overview
        </Button>
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Next: Key Tourist Destinations
        </Button>
      </div>
    </Card>
  );
};

export default IndustryOverview;
