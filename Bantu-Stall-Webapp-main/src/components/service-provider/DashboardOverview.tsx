
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { ServiceProviderCategories } from './ServiceProviderCategories';
import { SidebarWidgets } from './SidebarWidgets';

export const DashboardOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - 2/3 width on large screens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome Message & Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl">Welcome, Sarah! Your next adventure starts now.</CardTitle>
                <CardDescription>
                  Here's your dashboard overview for Wednesday, April 3, 2025.
                </CardDescription>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Upcoming Bookings Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">7</div>
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                      +2 this week
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue Summary Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">$2,450</div>
                    <TrendingUp className="ml-2 h-4 w-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Reviews Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">4.9</div>
                    <div className="ml-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Custom Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex">
              <AlertCircle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">New booking request for Cultural Heritage Tour</p>
                <p className="text-sm text-gray-600">A family of 4 is interested in your tour on April 10, 2025.</p>
                <Button variant="link" className="px-0 h-auto">Review & Respond</Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Your cooking class is trending!</p>
                <p className="text-sm text-gray-600">Your "Authentic Cuisine Workshop" is getting a lot of attention. Consider adding more slots.</p>
                <Button variant="link" className="px-0 h-auto">Update Availability</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Provider Categories */}
        <ServiceProviderCategories />
      </div>

      {/* Sidebar - 1/3 width on large screens */}
      <div className="lg:col-span-1 space-y-6">
        <SidebarWidgets />
      </div>
    </div>
  );
};
