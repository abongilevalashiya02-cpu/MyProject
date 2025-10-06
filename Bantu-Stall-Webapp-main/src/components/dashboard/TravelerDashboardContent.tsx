import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Calendar, Camera, Star, Compass, Heart, Clock, 
  Globe, TrendingUp, Award, Users, Plane, Mountain, Waves, Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TravelerDashboardContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('destinations');

  const destinations = [
    {
      id: 1,
      name: 'Cape Town, South Africa',
      image: '/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png',
      rating: 4.8,
      reviews: 234,
      type: 'Adventure',
      featured: true,
      saved: true
    },
    {
      id: 2,
      name: 'Victoria Falls, Zambia',
      image: '/lovable-uploads/413f808f-8f03-4a44-bb12-735b1c766c4e.png',
      rating: 4.9,
      reviews: 156,
      type: 'Nature',
      featured: true,
      saved: false
    },
    {
      id: 3,
      name: 'Serengeti, Tanzania',
      image: '/lovable-uploads/440979ba-a8b9-4724-9e35-795b7d747bdd.png',
      rating: 4.7,
      reviews: 189,
      type: 'Wildlife',
      featured: false,
      saved: true
    }
  ];

  const upcomingBookings = [
    {
      id: 1,
      destination: 'Cape Town Adventure',
      date: '2024-12-15',
      duration: '7 days',
      status: 'confirmed',
      amount: '$1,250'
    },
    {
      id: 2,
      destination: 'Victoria Falls Experience',
      date: '2025-01-20',
      duration: '4 days',
      status: 'pending',
      amount: '$890'
    }
  ];

  const travelStats = [
    { label: 'Countries Visited', value: '8', trend: '+2', icon: Globe },
    { label: 'Total Distance', value: '12,540km', trend: '+2,100km', icon: Plane },
    { label: 'Experiences', value: '23', trend: '+5', icon: Star },
    { label: 'Photos Taken', value: '1,247', trend: '+156', icon: Camera }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Travel Explorer</h2>
          <p className="text-muted-foreground">Discover amazing African destinations</p>
        </div>
        <Button onClick={() => navigate('/countries')}>
          <Globe className="mr-2 h-4 w-4" />
          Explore All Countries
        </Button>
      </div>

      {/* Travel Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {travelStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="destinations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Featured Destinations</h3>
            <div className="flex gap-2">
              <Input placeholder="Search destinations..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  {destination.featured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 ${
                      destination.saved ? 'text-red-500' : 'text-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${destination.saved ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{destination.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{destination.rating}</span>
                      <span className="text-sm text-muted-foreground">({destination.reviews})</span>
                    </div>
                    <Badge variant="outline">{destination.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => navigate('/quotations/new')}>
                      Book Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Bookings</h3>
            <Button onClick={() => navigate('/quotations/new')}>
              New Booking
            </Button>
          </div>
          
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{booking.destination}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.duration}
                        </div>
                        <div className="font-medium text-foreground">{booking.amount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-20">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Saved Destinations</h3>
            <p className="text-muted-foreground mb-4">
              Save destinations you're interested in to view them here
            </p>
            <Button onClick={() => setActiveTab('destinations')}>
              Browse Destinations
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="text-center py-20">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Travel Gallery</h3>
            <p className="text-muted-foreground mb-4">
              Your travel photos will appear here once you start exploring
            </p>
            <Button onClick={() => navigate('/countries')}>
              Start Exploring
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelerDashboardContent;
