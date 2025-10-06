import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, TrendingUp, Users, DollarSign, Star, 
  Calendar, MessageSquare, BarChart3, Package, Eye
} from 'lucide-react';

const ServiceProviderDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const businessStats = [
    { label: 'Total Bookings', value: '156', trend: '+23', icon: Calendar },
    { label: 'Revenue', value: '$48.7k', trend: '+15%', icon: DollarSign },
    { label: 'Rating', value: '4.8', trend: '+0.2', icon: Star },
    { label: 'Active Listings', value: '12', trend: '+2', icon: Package }
  ];

  const recentBookings = [
    {
      id: 1,
      client: 'TechCorp Ltd',
      service: 'Team Building Safari',
      date: '2024-12-20',
      amount: '$2,500',
      status: 'confirmed'
    },
    {
      id: 2,
      client: 'Global Innovations',
      service: 'Executive Retreat',
      date: '2025-01-15',
      amount: '$4,200',
      status: 'pending'
    }
  ];

  const services = [
    {
      id: 1,
      name: 'Corporate Safari Experience',
      category: 'Adventure',
      bookings: 45,
      revenue: '$15,600',
      rating: 4.9,
      status: 'active'
    },
    {
      id: 2,
      name: 'Cultural Heritage Tours',
      category: 'Cultural',
      bookings: 32,
      revenue: '$9,800',
      rating: 4.7,
      status: 'active'
    },
    {
      id: 3,
      name: 'Executive Retreat Package',
      category: 'Business',
      bookings: 18,
      revenue: '$12,400',
      rating: 4.8,
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Provider Dashboard</h2>
          <p className="text-muted-foreground">Manage your tourism business</p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Business Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {businessStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Booking Rate</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Growth</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{booking.client}</h4>
                      <p className="text-sm text-muted-foreground">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">{booking.amount}</div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-auto p-4 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Respond to Inquiries</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span>Update Services</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Manage Calendar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Bookings</h3>
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentBookings.concat(recentBookings).map((booking, index) => (
              <Card key={`${booking.id}-${index}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{booking.client}</h4>
                      <p className="text-muted-foreground mb-2">{booking.service}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
                        <span>Amount: {booking.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
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

        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Services</h3>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
          
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <Badge variant="outline">{service.category}</Badge>
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bookings:</span>
                          <div className="font-medium">{service.bookings}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <div className="font-medium">{service.revenue}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <div className="font-medium flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {service.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">
                        View
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
                Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed business analytics and insights will be available here
                </p>
                <Button>
                  View Full Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceProviderDashboardContent;
