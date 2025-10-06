
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  Search,
  Filter,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const BookingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar View
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 pt-4">
          {[
            {
              id: "B-1234",
              experience: "Cultural Heritage Walking Tour",
              date: "Apr 5, 2025",
              time: "10:00 AM - 12:00 PM",
              client: "John & Emily Wilson",
              guests: 4,
              price: "$180.00",
              location: "City Center - Meeting Point A",
              status: "Confirmed"
            },
            {
              id: "B-1235",
              experience: "Cooking Class: Local Cuisine",
              date: "Apr 8, 2025",
              time: "2:00 PM - 5:00 PM",
              client: "Michael Johnson",
              guests: 8,
              price: "$320.00",
              location: "Your Kitchen Studio",
              status: "Confirmed"
            },
            {
              id: "B-1236",
              experience: "Private City Tour",
              date: "Apr 10, 2025",
              time: "9:00 AM - 12:00 PM",
              client: "David & Sarah Brown",
              guests: 2,
              price: "$120.00",
              location: "Hotel Pickup",
              status: "Confirmed"
            }
          ].map((booking, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{booking.id}</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                        {booking.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg">{booking.experience}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-2" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-2" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-2" />
                      {booking.location}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500">CLIENT INFORMATION</h4>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{booking.client}</div>
                        <div className="text-sm text-gray-500">First-time customer</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-3 w-3 mr-2" />
                      {booking.guests} guests
                    </div>
                    <div className="font-medium">{booking.price}</div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center md:items-end space-y-3">
                    <Button variant="default" className="w-full md:w-auto">
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      Contact Guest
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto text-red-600 hover:text-red-600 hover:bg-red-50">
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Pending Bookings</h3>
                <p className="text-gray-500 mb-4">
                  You'll see booking requests that need your confirmation here.
                </p>
                <Button variant="outline">View All Bookings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Recent Completed Bookings</h3>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="180">Last 6 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Mar {15 + i}, 2025</div>
                      <div className="font-medium">Cultural Tour</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Customer</div>
                      <div className="font-medium">Alex Thompson</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-medium">${85 + (i * 20)}</div>
                    </div>
                    <div className="md:text-right">
                      <Button variant="ghost" size="sm">View Receipt</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">Load More Bookings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="canceled" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Canceled Bookings</h3>
                <p className="text-gray-500 mb-4">
                  You have no canceled bookings in the past 90 days.
                </p>
                <Button variant="outline">View All Bookings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
