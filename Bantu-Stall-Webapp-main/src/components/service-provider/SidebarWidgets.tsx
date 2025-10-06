
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  User,
  MapPin,
} from 'lucide-react';

export const SidebarWidgets: React.FC = () => {
  return (
    <>
      {/* Upcoming Bookings Widget */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              Upcoming Bookings
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              name: "Cultural Heritage Tour",
              date: "Tomorrow, 10:00 AM",
              guests: 4,
              location: "City Center"
            },
            {
              name: "Cooking Class: Local Cuisine",
              date: "Apr 5, 2:00 PM",
              guests: 8,
              location: "Your Kitchen Studio"
            },
            {
              name: "Private City Walk",
              date: "Apr 8, 9:00 AM",
              guests: 2,
              location: "Historic District"
            }
          ].map((booking, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <div className="font-medium">{booking.name}</div>
                <Badge variant="outline">{booking.guests} guests</Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {booking.date}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {booking.location}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Earnings Overview Widget */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Earnings Overview
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">This Month</div>
              <div className="text-xl font-bold text-green-600">$2,450</div>
              <div className="text-xs text-green-600">+12% from last month</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Upcoming</div>
              <div className="text-xl font-bold">$850</div>
              <div className="text-xs text-gray-500">From confirmed bookings</div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-md text-center">
            <div className="text-sm font-medium mb-2">Next Payout</div>
            <div className="text-lg font-bold">$1,200</div>
            <div className="text-xs text-gray-600">Scheduled for April 15, 2025</div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Messages Widget */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
              Customer Messages
            </CardTitle>
            <Badge>3 New</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              name: "John Smith",
              message: "Quick question about your food tour next week...",
              time: "10 min ago",
            },
            {
              name: "Emma Wilson",
              message: "Hello! Are you available for a private tour on the 12th?",
              time: "1 hour ago",
            },
            {
              name: "Michael Brown",
              message: "Thanks for the amazing experience yesterday!",
              time: "Yesterday",
            }
          ].map((message, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium truncate">{message.name}</span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{message.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Open Messages</Button>
        </CardFooter>
      </Card>

      {/* Marketing Toolkit & Industry Trends Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-500" />
              Marketing Toolkit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-4">
            <Button variant="outline" size="sm" className="mb-2">Photography Tips</Button>
            <Button variant="outline" size="sm" className="mb-2 mx-2">Listing Optimization</Button>
            <Button variant="outline" size="sm" className="mb-2">Social Templates</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
              Industry Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-2 bg-gray-50 rounded-md">
              🔥 Sustainable tourism searches up 34% this month
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              🌍 Cultural immersion experiences showing high demand
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              📱 85% of bookings now coming through mobile devices
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
