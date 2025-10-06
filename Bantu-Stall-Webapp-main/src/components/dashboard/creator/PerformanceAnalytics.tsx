
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Star, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PerformanceAnalytics = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Performance Analytics</h3>
      
      {/* Revenue Dashboard */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-bantu-orange" /> 
            Revenue Dashboard
          </h4>
          
          <Tabs defaultValue="monthly" className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs px-2">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-2">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-2">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Total Earnings</div>
            <div className="text-xl font-bold">$24,560</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Up 12% from last month
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Pending Payouts</div>
            <div className="text-xl font-bold">$3,450</div>
            <div className="text-xs text-gray-500 mt-1">Next payout: July 15</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Commission Earned</div>
            <div className="text-xl font-bold">$4,210</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Up 8% from last month
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Monthly Target: $30,000</span>
            <span>$24,560 (82%)</span>
          </div>
          <Progress value={82} className="h-2" />
        </div>
      </Card>
      
      {/* Booking & Engagement Metrics */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-1 text-bantu-orange" />
            Booking & Engagement Metrics
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Total Bookings</div>
            <div className="text-xl font-bold">184</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Up 24 from last month
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-xl font-bold">18.5%</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Up 2.3% from last month
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Avg. Group Size</div>
            <div className="text-xl font-bold">4.2</div>
            <div className="text-xs text-gray-500 mt-1">People per booking</div>
          </div>
        </div>
      </Card>
      
      {/* Top Selling Experiences */}
      <Card className="p-4">
        <h4 className="font-medium flex items-center mb-4">
          <Star className="h-5 w-5 mr-1 text-bantu-orange" />
          Top-Selling Experiences
        </h4>
        
        <div className="space-y-3">
          {[
            { name: "Serengeti Wildlife Safari", bookings: 42, revenue: "$50,400" },
            { name: "Cape Town Food Tour", bookings: 38, revenue: "$17,100" },
            { name: "Atlas Mountains Trek", bookings: 27, revenue: "$16,200" }
          ].map((exp, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div>
                <div className="font-medium">{exp.name}</div>
                <div className="text-xs text-gray-500">{exp.bookings} bookings</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{exp.revenue}</div>
                <div className="text-xs text-gray-500">Total revenue</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Customer Insights */}
      <Card className="p-4">
        <h4 className="font-medium flex items-center mb-4">
          <Users className="h-5 w-5 mr-1 text-bantu-orange" />
          Customer Insights & Feedback
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-500">4.8</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">94%</div>
            <div className="text-sm text-gray-500">Would Recommend</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">132</div>
            <div className="text-sm text-gray-500">Total Reviews</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">86%</div>
            <div className="text-sm text-gray-500">Return Interest</div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium mb-2">Most Mentioned Keywords in Reviews</div>
          <div className="flex flex-wrap gap-2">
            {["authentic", "knowledgeable", "friendly", "amazing", "cultural", "unique", "memorable", "worth it"].map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
