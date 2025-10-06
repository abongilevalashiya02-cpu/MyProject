
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, PlaneTakeoff, Sun, Camera, Mountain, Anchor } from "lucide-react";

interface TouristDestinationsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const TouristDestinations: React.FC<TouristDestinationsProps> = ({ onNext, onPrevious }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          2. Key Tourist Destinations Across Africa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p>
            Africa is home to some of the world's most breathtaking and diverse tourist destinations, 
            each offering unique experiences and attractions.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-4">Regional Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-bantu-orange" />
                <h4 className="font-bold">North Africa</h4>
              </div>
              <ul className="text-sm space-y-2 list-none pl-0">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pyramids of Giza, Egypt</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Marrakech Medina, Morocco</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Carthage Ruins, Tunisia</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="h-5 w-5 text-green-600" />
                <h4 className="font-bold">East Africa</h4>
              </div>
              <ul className="text-sm space-y-2 list-none pl-0">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Serengeti National Park, Tanzania</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Maasai Mara, Kenya</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bwindi Impenetrable Forest, Uganda</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-purple-600" />
                <h4 className="font-bold">Southern Africa</h4>
              </div>
              <ul className="text-sm space-y-2 list-none pl-0">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Victoria Falls, Zimbabwe/Zambia</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cape Town, South Africa</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Okavango Delta, Botswana</span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Featured Destinations</h3>
          <div className="space-y-4 my-6">
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-gray-200 h-40 md:h-auto">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80')] bg-cover bg-center"></div>
                </div>
                <div className="p-4 col-span-2">
                  <h4 className="font-bold text-lg mb-2">Serengeti National Park, Tanzania</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <PlaneTakeoff className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Best Time to Visit: June-September (Great Migration)</span>
                  </div>
                  <p className="text-sm mb-3">
                    Home to the spectacular Great Migration, the Serengeti offers unparalleled wildlife viewing and 
                    stunning landscapes. Visitors can witness millions of wildebeest, zebra, and gazelle moving in search of water and fresh grass.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Wildlife Safari</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Photography</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Hot Air Balloon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-gray-200 h-40 md:h-auto">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1489493585363-d69421e0edd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                </div>
                <div className="p-4 col-span-2">
                  <h4 className="font-bold text-lg mb-2">Marrakech, Morocco</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <PlaneTakeoff className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Best Time to Visit: March-May or September-November</span>
                  </div>
                  <p className="text-sm mb-3">
                    A vibrant city with a labyrinthine medina, bustling souks, and magnificent architecture. Visitors can 
                    explore historic palaces, taste delicious Moroccan cuisine, and experience the unique blend of Arab, Berber, and French influences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Cultural Heritage</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Culinary Tourism</span>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">Architecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg my-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Tourism Type Match</h3>
            <p className="mb-4">Match these destinations with the type of tourism they primarily support:</p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                <span className="font-medium mb-1 sm:mb-0">Victoria Falls</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full self-start sm:self-auto">Adventure Tourism</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                <span className="font-medium mb-1 sm:mb-0">Zanzibar Beaches</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full self-start sm:self-auto">Leisure Tourism</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                <span className="font-medium mb-1 sm:mb-0">Robben Island</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full self-start sm:self-auto">Historical Tourism</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium mb-1 sm:mb-0">Mount Kilimanjaro</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full self-start sm:self-auto">Adventure Tourism</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Industry Overview
        </Button>
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Next: Regional Differences
        </Button>
      </div>
    </Card>
  );
};

export default TouristDestinations;
