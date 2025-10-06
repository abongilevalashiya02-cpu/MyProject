
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, TrendingUp, Lightbulb } from "lucide-react";

interface TourismStatisticsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const TourismStatistics: React.FC<TourismStatisticsProps> = ({ onNext, onPrevious }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          4. Tourism Statistics and Growth Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p>
            Understanding the statistical data related to tourism in Africa is crucial for industry professionals. 
            This section explores key metrics, trends, and future projections for the African tourism sector.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <BarChart className="h-5 w-5 text-blue-600" />
              Key Tourism Statistics (Pre-Pandemic)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Visitor Numbers</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 67 million international tourist arrivals (2019)</li>
                  <li>• 5% of global tourism market share</li>
                  <li>• Average growth rate of 5% annually (2015-2019)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Economic Impact</h4>
                <ul className="space-y-2 text-sm">
                  <li>• $169 billion contribution to African GDP (2019)</li>
                  <li>• 24.6 million jobs supported (direct and indirect)</li>
                  <li>• 8.5% of total exports from Africa</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Top Performing Countries</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Morocco: 12.9 million visitors</li>
                  <li>• Egypt: 11.3 million visitors</li>
                  <li>• South Africa: 10.2 million visitors</li>
                  <li>• Tunisia: 8.3 million visitors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tourism Investment</h4>
                <ul className="space-y-2 text-sm">
                  <li>• $28.5 billion capital investment (2019)</li>
                  <li>• 5.6% average annual growth in investment</li>
                  <li>• Significant increase in intra-African investment</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-bantu-orange" />
            Growth Trends and Recovery Patterns
          </h3>
          
          <div className="space-y-4 my-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-3">Post-Pandemic Recovery</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>North Africa</span>
                  <div className="w-1/2 bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>East Africa</span>
                  <div className="w-1/2 bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-blue-600 font-medium">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Southern Africa</span>
                  <div className="w-1/2 bg-gray-200 h-2 rounded-full">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-purple-600 font-medium">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>West Africa</span>
                  <div className="w-1/2 bg-gray-200 h-2 rounded-full">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-amber-600 font-medium">65%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recovery percentage compared to 2019 visitor numbers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-bantu-orange" />
                  Market Segment Growth
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Eco-tourism</span>
                    <span className="text-green-600">+14.2% CAGR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cultural tourism</span>
                    <span className="text-purple-600">+9.7% CAGR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adventure tourism</span>
                    <span className="text-blue-600">+12.3% CAGR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wellness tourism</span>
                    <span className="text-amber-600">+8.5% CAGR</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Compound Annual Growth Rate (projected 2023-2028)</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Emerging Tourism Destinations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Rwanda</span>
                    <span className="text-green-600">+21.5% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ghana</span>
                    <span className="text-green-600">+18.3% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Uganda</span>
                    <span className="text-green-600">+15.7% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Namibia</span>
                    <span className="text-green-600">+14.2% growth</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">Annual visitor growth rate (2022-2023)</p>
              </div>
            </div>
          </div>

          <div className="bg-bantu-orange/10 p-6 rounded-lg my-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-8 w-8 text-bantu-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Data-Driven Insights</h3>
                <p className="text-gray-700 mb-4">
                  The statistics reveal key insights that tourism professionals should consider when planning strategies:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-white text-bantu-orange text-xs px-2 py-0.5 rounded-full mt-0.5">Insight 1</span>
                    <span>Domestic and intra-regional tourism is growing faster than international tourism from outside Africa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-white text-bantu-orange text-xs px-2 py-0.5 rounded-full mt-0.5">Insight 2</span>
                    <span>Digital transformation is accelerating with 72% of bookings now made online compared to 45% in 2019.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-white text-bantu-orange text-xs px-2 py-0.5 rounded-full mt-0.5">Insight 3</span>
                    <span>Sustainable and responsible tourism offerings are seeing 2-3x faster growth than traditional tourism products.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h3 className="font-bold text-lg mb-4">Knowledge Check</h3>
            <p className="mb-4">Select the correct statement about African tourism statistics:</p>
            <div className="space-y-3">
              {[
                'Africa has a 15% share of the global tourism market',
                'Tourism contributes approximately $169 billion to African GDP',
                'International arrivals exceeded 100 million in 2019',
                'Tourism investment is declining across the continent'
              ].map((option, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-2 border-bantu-orange flex items-center justify-center">
                    {index === 1 && <div className="w-3 h-3 rounded-full bg-bantu-orange"></div>}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Regional Differences
        </Button>
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Next: Interactive Activities
        </Button>
      </div>
    </Card>
  );
};

export default TourismStatistics;
