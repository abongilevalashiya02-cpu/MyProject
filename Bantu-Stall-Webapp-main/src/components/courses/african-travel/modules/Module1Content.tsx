
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Earth, Flag, Video, ChevronDown, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const Module1Content = () => {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Earth className="mr-2 h-5 w-5 text-blue-600" />
          Africa's Scale and Diversity
        </h3>
        <p>
          Africa is the world's second-largest continent, covering 20% of the Earth's land mass. 
          With 54 recognized countries, it's home to over 1.3 billion people speaking more than 
          2,000 distinct languages.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="font-bold text-3xl text-blue-700 mb-1">54</div>
              <div className="text-sm text-blue-700">Countries</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4 text-center">
              <div className="font-bold text-3xl text-amber-700 mb-1">2,000+</div>
              <div className="text-sm text-amber-700">Languages</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4 text-center">
              <div className="font-bold text-3xl text-green-700 mb-1">1.3B+</div>
              <div className="text-sm text-green-700">People</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Flag className="mr-2 h-5 w-5 text-red-600" />
          Beyond the Safari: Cultural Diversity
        </h3>
        
        <p>
          Africa's cultural landscape is as diverse as its geography, with thousands of distinct 
          ethnic groups maintaining unique traditions, art forms, cuisines, and social structures. 
          From ancient civilizations to modern innovation hubs, Africa offers experiences far beyond 
          the safari stereotypes.
        </p>
        
        <Tabs defaultValue="heritage" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="heritage">Heritage</TabsTrigger>
            <TabsTrigger value="innovation">Innovation</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>
          <TabsContent value="heritage" className="p-4 bg-gray-50 rounded-md mt-2">
            <h4 className="font-medium mb-2">Rich Heritage</h4>
            <p className="text-sm">
              Africa is home to some of the world's oldest civilizations and most remarkable historical sites. 
              From the pyramids of Egypt to the rock-hewn churches of Ethiopia and the ancient city of Great 
              Zimbabwe, the continent's heritage spans thousands of years of human achievement.
            </p>
          </TabsContent>
          <TabsContent value="innovation" className="p-4 bg-gray-50 rounded-md mt-2">
            <h4 className="font-medium mb-2">Modern Innovation</h4>
            <p className="text-sm">
              Africa is at the forefront of leapfrog technologies, with innovation hubs across the continent 
              developing solutions for local and global challenges. From mobile payment systems to renewable 
              energy solutions, Africa's tech scene is vibrant and rapidly growing.
            </p>
          </TabsContent>
          <TabsContent value="culture" className="p-4 bg-gray-50 rounded-md mt-2">
            <h4 className="font-medium mb-2">Cultural Expressions</h4>
            <p className="text-sm">
              African art, music, dance, and cuisine reflect centuries of tradition while constantly evolving. 
              From the colorful textiles of West Africa to the rhythmic music of Central Africa and the distinctive 
              flavors of North African cuisine, cultural expression is a vibrant part of daily life.
            </p>
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">How Bantu Stall Helps You Travel Deeper</h3>
        
        <p>
          Bantu Stall connects you with authentic local experiences and guides who help you go beyond 
          surface-level tourism. Our approach emphasizes respectful cultural exchange, meaningful 
          connections with locals, and supporting community-based initiatives.
        </p>
        
        <Collapsible className="border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium">
            Our Community-First Approach
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t bg-gray-50">
            <p className="text-sm">
              Bantu Stall prioritizes experiences created and led by local communities. This ensures that 
              tourism benefits flow directly to the people who share their culture, knowledge, and hospitality 
              with you. By connecting you directly with local hosts, we remove barriers and create opportunities 
              for authentic exchange.
            </p>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible className="border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium">
            Cultural Context and Preparation
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t bg-gray-50">
            <p className="text-sm">
              We believe that informed travelers have more meaningful experiences. That's why we provide 
              cultural context, language resources, and etiquette guidance specific to each destination. 
              This preparation helps you engage respectfully and appreciate the nuances of the cultures 
              you encounter.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Video className="mr-2 h-5 w-5 text-blue-600" />
          Interactive Learning
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 flex items-center">
              <Map className="mr-2 h-4 w-4 text-blue-600" />
              Map Quiz
            </h4>
            <p className="text-sm mb-4">
              Test your knowledge of African geography with our interactive map quiz. 
              Can you identify all 54 countries?
            </p>
            <Button>Start Map Quiz</Button>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 flex items-center">
              <Video className="mr-2 h-4 w-4 text-blue-600" />
              Welcome from Local Host
            </h4>
            <p className="text-sm mb-4">
              Watch a 1-minute welcome video from one of our local hosts who will share 
              insights about their region.
            </p>
            <Button>Watch Video</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module1Content;
