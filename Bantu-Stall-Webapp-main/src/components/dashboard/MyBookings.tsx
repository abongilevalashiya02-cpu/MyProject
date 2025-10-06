
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Clock, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type UserType = 'traveler' | 'host' | 'abantu';

interface MyBookingsProps {
  userType: UserType;
}

const MyBookings: React.FC<MyBookingsProps> = ({ userType }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          {userType === 'traveler' ? 'Book New Experience' : 'View All Bookings'}
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userType === 'traveler' ? renderTravelerBookings() : renderHostBookings()}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: "Traditional Tea Ceremony",
                date: "May 15, 2023",
                location: "Kyoto, Japan",
                image: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80",
                status: "completed",
                rating: 5
              },
              {
                title: "Masai Village Tour",
                date: "January 10, 2023",
                location: "Amboseli, Kenya",
                image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80",
                status: "completed",
                rating: 4
              }
            ].map((booking, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={booking.image} 
                    alt={booking.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {booking.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gray-100">
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {booking.date}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-sm font-medium">Your Rating:</div>
                    <div className="ml-2 flex">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill={i < booking.rating ? "currentColor" : "none"} 
                          stroke={i < booking.rating ? "none" : "currentColor"} 
                          className={`h-4 w-4 ${i < booking.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button variant="ghost">Book Again</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: "Berber Cooking Class",
                location: "Marrakech, Morocco",
                date: "Available year-round",
                image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
              },
              {
                title: "Zulu Dance Workshop",
                location: "Durban, South Africa",
                date: "Available from Jun - Sep",
                image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1829&q=80",
              }
            ].map((experience, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{experience.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    {experience.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {experience.date}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderTravelerBookings = () => {
  return [
    {
      title: "Traditional Batik Workshop",
      date: "August 15, 2023 • 10:00 AM",
      location: "Yogyakarta, Indonesia",
      host: "Adi Susanto",
      image: "https://images.unsplash.com/photo-1606324756752-48c18a3e3fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      status: "confirmed"
    },
    {
      title: "Desert Astronomy Night",
      date: "September 3, 2023 • 8:30 PM",
      location: "Sahara Desert, Morocco",
      host: "Hassan El Mekki",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80",
      status: "confirmed"
    },
    {
      title: "Kente Cloth Weaving",
      date: "October 12, 2023 • 2:00 PM",
      location: "Kumasi, Ghana",
      host: "Ama Mensah",
      image: "https://images.unsplash.com/photo-1579525108311-0c5730b5799d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      status: "pending"
    }
  ].map((booking, i) => (
    <Card key={i} className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={booking.image} 
          alt={booking.title} 
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
              {booking.location}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={
              booking.status === "confirmed" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }
          >
            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {booking.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2" />
            Hosted by {booking.host}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">View Details</Button>
        {booking.status === "confirmed" ? (
          <Button>
            Get Directions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Cancel Request
          </Button>
        )}
      </CardFooter>
    </Card>
  ));
};

const renderHostBookings = () => {
  return [
    {
      title: "Cultural Heritage Tour",
      date: "August 18, 2023 • 9:00 AM",
      guests: 4,
      guestName: "Maria Rodriguez",
      image: "https://images.unsplash.com/photo-1605649461939-17e82b7f6f37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      status: "upcoming"
    },
    {
      title: "Traditional Cuisine Workshop",
      date: "August 20, 2023 • 11:00 AM",
      guests: 8,
      guestName: "Chen Wei",
      image: "https://images.unsplash.com/photo-1551218371-03a19d7b7aef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      status: "upcoming"
    },
    {
      title: "Cultural Heritage Tour",
      date: "August 25, 2023 • 9:00 AM",
      guests: 2,
      guestName: "Sam Johnson",
      image: "https://images.unsplash.com/photo-1605649461939-17e82b7f6f37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      status: "upcoming"
    }
  ].map((booking, i) => (
    <Card key={i} className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={booking.image} 
          alt={booking.title} 
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.title}</CardTitle>
            <Badge className="mt-2">
              {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {booking.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2" />
            Primary guest: {booking.guestName}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Contact Guest</Button>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  ));
};

export default MyBookings;
