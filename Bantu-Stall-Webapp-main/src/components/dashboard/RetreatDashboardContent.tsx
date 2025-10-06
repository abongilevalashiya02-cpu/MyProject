import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Mountain, Calendar, MapPin, Users, DollarSign, 
  Building2, Star, Plus, BarChart3, Clock, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RetreatDashboardContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const retreats = [
    {
      id: 1,
      title: 'Team Building Safari',
      location: 'Serengeti, Tanzania',
      date: '2024-12-15',
      duration: '5 days',
      participants: 25,
      budget: '$15,000',
      status: 'confirmed',
      type: 'Adventure'
    },
    {
      id: 2,
      title: 'Executive Leadership Retreat',
      location: 'Cape Town, South Africa',
      date: '2025-01-20',
      duration: '3 days',
      participants: 12,
      budget: '$8,500',
      status: 'planning',
      type: 'Executive'
    }
  ];

  const venues = [
    {
      id: 1,
      name: 'Ubuntu Safari Lodge',
      location: 'Kruger National Park, SA',
      capacity: '50 guests',
      rating: 4.8,
      price: '$180/night',
      amenities: ['Conference Hall', 'Team Activities', 'Spa', 'Safari Tours']
    },
    {
      id: 2,
      name: 'Serengeti Executive Camp',
      location: 'Serengeti, Tanzania',
      capacity: '30 guests',
      rating: 4.9,
      price: '$250/night',
      amenities: ['Meeting Rooms', 'Cultural Tours', 'Fine Dining', 'Wildlife Experience']
    }
  ];

  const retreatStats = [
    { label: 'Total Retreats', value: '5', trend: '+2', icon: Mountain },
    { label: 'Team Members', value: '89', trend: '+15', icon: Users },
    { label: 'Total Investment', value: '$45k', trend: '+$12k', icon: DollarSign },
    { label: 'Success Rate', value: '96%', trend: '+4%', icon: Star }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Corporate Retreats</h2>
          <p className="text-muted-foreground">Plan and manage team retreats in Africa</p>
        </div>
        <Button onClick={() => navigate('/quotations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Plan New Retreat
        </Button>
      </div>

      {/* Retreat Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {retreatStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} this quarter</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retreats">My Retreats</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => navigate('/quotations/new')}>
                  <Plus className="h-6 w-6" />
                  <span>Plan Retreat</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" onClick={() => navigate('/venues')}>
                  <Building2 className="h-6 w-6" />
                  <span>Browse Venues</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Team Builder</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Retreats */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Retreats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retreats.slice(0, 2).map((retreat) => (
                  <div key={retreat.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{retreat.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {retreat.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(retreat.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {retreat.participants} participants
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={retreat.status === 'confirmed' ? 'default' : 'secondary'}>
                        {retreat.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retreats" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Retreats</h3>
            <div className="flex gap-2">
              <Input placeholder="Search retreats..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {retreats.map((retreat) => (
              <Card key={retreat.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{retreat.title}</h4>
                        <Badge variant="outline">{retreat.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {retreat.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(retreat.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {retreat.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {retreat.budget}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={retreat.status === 'confirmed' ? 'default' : 'secondary'}>
                        {retreat.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recommended Venues</h3>
            <Button onClick={() => navigate('/venues')}>
              View All Venues
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">{venue.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {venue.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {venue.rating}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <div className="font-medium">{venue.capacity}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <div className="font-medium">{venue.price}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground mb-2 block">Amenities:</span>
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {venue.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{venue.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => navigate('/quotations/new')}>
                        Request Quote
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Retreat Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed analytics for your retreat performance and ROI will be available here
                </p>
                <Button>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetreatDashboardContent;
