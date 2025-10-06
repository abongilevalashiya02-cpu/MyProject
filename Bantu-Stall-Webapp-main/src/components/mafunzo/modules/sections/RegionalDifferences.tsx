
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Compass, Users, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RegionalDifferencesProps {
  onNext: () => void;
  onPrevious: () => void;
}

const RegionalDifferences: React.FC<RegionalDifferencesProps> = ({ onNext, onPrevious }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          3. Understanding Regional Differences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p>
            Africa's vast size and diversity mean there are significant regional differences in tourism 
            infrastructure, attractions, and cultural practices. Understanding these differences is crucial 
            for tourism professionals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-5 w-5 text-bantu-orange" />
                <h3 className="font-bold">Geographic Diversity</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full mt-0.5">West Africa</span>
                  <span>Tropical rainforests, coastal beaches, and savanna plains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full mt-0.5">North Africa</span>
                  <span>Mediterranean coastlines, Sahara Desert, and ancient historical sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mt-0.5">East Africa</span>
                  <span>Great Rift Valley, savannas, mountains, and lakes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full mt-0.5">Southern Africa</span>
                  <span>Deserts, mountains, coastal areas, and unique flora</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-bantu-orange" />
                <h3 className="font-bold">Cultural Distinctions</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p>Africa has over 3,000 distinct ethnic groups and over 2,000 languages.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">North Africa</h4>
                    <p>Strong Arab and Islamic influences</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">West Africa</h4>
                    <p>Rich oral traditions and musical heritage</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">East Africa</h4>
                    <p>Blend of Bantu, Nilotic, and Arab cultures</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Southern Africa</h4>
                    <p>Diverse indigenous and colonial influences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h3 className="font-bold text-lg mb-4">Infrastructure Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Region</th>
                    <th className="text-left py-2 font-medium">Tourism Infrastructure</th>
                    <th className="text-left py-2 font-medium">Accessibility</th>
                    <th className="text-left py-2 font-medium">Key Challenges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">North Africa</td>
                    <td className="py-2">Well-developed</td>
                    <td className="py-2">Good international connections</td>
                    <td className="py-2">Political instability in some areas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">East Africa</td>
                    <td className="py-2">Moderately developed</td>
                    <td className="py-2">Improving air connectivity</td>
                    <td className="py-2">Varying quality of road networks</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">West Africa</td>
                    <td className="py-2">Developing</td>
                    <td className="py-2">Limited regional connections</td>
                    <td className="py-2">Visa restrictions and transport challenges</td>
                  </tr>
                  <tr>
                    <td className="py-2">Southern Africa</td>
                    <td className="py-2">Well-developed in certain countries</td>
                    <td className="py-2">Good regional connectivity</td>
                    <td className="py-2">Economic disparities between countries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h3 className="font-bold text-lg mb-3">Regional Business Practices</h3>
            <p className="mb-4">Understanding regional business practices is essential for tourism professionals:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Time Perception Differences</h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="bg-blue-100 p-2 rounded-md flex-1">
                    <p className="font-medium">North & Southern Africa</p>
                    <p>More time-sensitive, punctuality valued</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-md flex-1">
                    <p className="font-medium">West & Central Africa</p>
                    <p>More relationship-focused, flexible timing</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Negotiation Styles</h4>
                <p className="text-sm mb-2">
                  Negotiation approaches vary across regions, with differences in directness, 
                  relationship building, and decision-making processes.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="font-bold">Key Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-bantu-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Regional Tourism Reports</h4>
                  <p className="text-sm text-gray-600">Comprehensive data and analysis of tourism trends by region</p>
                </div>
              </div>
              <div className="border rounded-md p-4 flex items-start gap-3">
                <Globe className="h-5 w-5 text-bantu-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Cultural Etiquette Guides</h4>
                  <p className="text-sm text-gray-600">Region-specific guides to cultural norms and business practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Tourist Destinations
        </Button>
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Next: Tourism Statistics
        </Button>
      </div>
    </Card>
  );
};

export default RegionalDifferences;
