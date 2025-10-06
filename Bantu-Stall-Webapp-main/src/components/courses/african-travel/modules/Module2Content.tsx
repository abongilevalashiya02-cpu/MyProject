
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Download, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Module2Content = () => {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-semibold mb-4">Country-specific Essentials</h3>
        <p className="mb-4">
          Before traveling to any African country, it's important to understand the specific requirements
          and practical information that will make your journey smoother.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Flag className="h-5 w-5 mr-2 text-blue-500" />
                <h4 className="font-medium">Visa Requirements</h4>
              </div>
              <p className="text-sm">
                Visa policies vary significantly across African countries. Some offer visa-on-arrival
                or e-visas, while others require advance application.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Flag className="h-5 w-5 mr-2 text-green-500" />
                <h4 className="font-medium">Currency & Payments</h4>
              </div>
              <p className="text-sm">
                Each country has its own currency. While major cities often accept cards,
                rural areas may be cash-only. ATM availability varies widely.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Flag className="h-5 w-5 mr-2 text-amber-500" />
                <h4 className="font-medium">Plug Types & Electricity</h4>
              </div>
              <p className="text-sm">
                Electrical outlets vary across the continent, with Types C, D, G, and M 
                being common. Voltage is typically 220-240V.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Health Preparation</h3>
        <p className="mb-4">
          Proper health preparation is essential for a safe and enjoyable trip to Africa.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Essential Health Preparations:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
              <span>Vaccinations: Yellow fever, Typhoid, Hepatitis A & B, Meningitis, and region-specific requirements</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
              <span>Malaria prophylaxis for most sub-Saharan regions</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
              <span>Comprehensive travel insurance with medical evacuation coverage</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
              <span>Personal medical kit with essentials</span>
            </li>
          </ul>
        </div>
        
        <Button className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download Comprehensive Health Checklist
        </Button>
      </section>
      
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Common Travel Mistakes</h3>
        <p className="mb-4">
          First-time travelers to Africa often make these common mistakes. Being aware of them
          will help you have a smoother, more enjoyable experience.
        </p>
        
        <div className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h4 className="font-medium">Overpacking</h4>
            <p className="text-sm">
              Many travelers bring too much clothing and gear. Most items can be purchased locally,
              and laundry services are widely available.
            </p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h4 className="font-medium">Tight Scheduling</h4>
            <p className="text-sm">
              Allow buffer time in your itinerary. Transportation delays are common, and you'll want
              flexibility to extend stays in places you love.
            </p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h4 className="font-medium">Cultural Assumptions</h4>
            <p className="text-sm">
              Avoid generalizing across countries. Each nation, region, and community has distinct
              cultures, customs, and expectations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Module2Content;
