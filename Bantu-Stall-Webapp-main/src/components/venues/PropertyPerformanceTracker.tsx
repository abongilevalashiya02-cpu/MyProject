import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Star, 
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Award,
  Activity
} from 'lucide-react';

interface PropertyPerformance {
  id: string;
  property_name: string;
  location: string;
  status: string;
  created_at: string;
  views: number;
  inquiries: number;
  bookings: number;
  rating: number;
  revenue: number;
  engagement_score: number;
  conversion_rate: number;
  recent_activity: Array<{
    type: string;
    description: string;
    date: string;
  }>;
}

const PropertyPerformanceTracker: React.FC = () => {
  const [properties, setProperties] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyPerformance | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  useEffect(() => {
    fetchPropertyPerformance();
  }, [timeRange]);

  const fetchPropertyPerformance = async () => {
    try {
      setLoading(true);

      // In a real implementation, this would join with analytics tables
      const { data: propertyData, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;

      // Generate mock performance data
      const performanceData: PropertyPerformance[] = (propertyData || []).map(property => {
        const baseViews = Math.floor(Math.random() * 1000) + 100;
        const inquiries = Math.floor(baseViews * (Math.random() * 0.15 + 0.05));
        const bookings = Math.floor(inquiries * (Math.random() * 0.3 + 0.1));
        
        return {
          id: property.id,
          property_name: property.property_name,
          location: property.location,
          status: property.status,
          created_at: property.created_at,
          views: baseViews,
          inquiries,
          bookings,
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          revenue: bookings * (Math.random() * 5000 + 2000),
          engagement_score: Math.floor(Math.random() * 40 + 60),
          conversion_rate: parseFloat(((bookings / inquiries) * 100 || 0).toFixed(1)),
          recent_activity: generateMockActivity()
        };
      });

      setProperties(performanceData);

    } catch (error: any) {
      console.error('Error fetching property performance:', error);
      toast({
        title: "Error loading performance data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivity = () => {
    const activities = [
      { type: 'view', description: 'Property viewed by potential client' },
      { type: 'inquiry', description: 'New inquiry received' },
      { type: 'booking', description: 'Booking confirmed' },
      { type: 'review', description: 'New review added' },
      { type: 'update', description: 'Property details updated' }
    ];

    return Array.from({ length: 5 }, (_, i) => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      return {
        ...activity,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Attention' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const topPerformers = properties
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 5);

  const avgEngagement = properties.reduce((sum, p) => sum + p.engagement_score, 0) / properties.length || 0;
  const totalRevenue = properties.reduce((sum, p) => sum + p.revenue, 0);
  const avgConversion = properties.reduce((sum, p) => sum + p.conversion_rate, 0) / properties.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Performance Tracker</h2>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">{Math.round(avgEngagement)}%</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${Math.round(totalRevenue).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                <p className="text-2xl font-bold">{avgConversion.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Top Performing Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((property, index) => (
              <div 
                key={property.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer transition-all"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{property.property_name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{property.engagement_score}%</p>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                  </div>
                  <Badge {...getPerformanceBadge(property.engagement_score)}>
                    {getPerformanceBadge(property.engagement_score).label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{property.property_name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </p>
                </div>
                <Badge {...getPerformanceBadge(property.engagement_score)}>
                  {getPerformanceBadge(property.engagement_score).label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Engagement Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Engagement Score</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(property.engagement_score)}`}>
                    {property.engagement_score}%
                  </span>
                </div>
                <Progress value={property.engagement_score} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.views}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.inquiries}</p>
                  <p className="text-xs text-muted-foreground">Inquiries</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.bookings}</p>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </div>
              </div>

              {/* Revenue & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <p className="text-sm font-medium">${Math.round(property.revenue).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="text-center">
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-xl font-bold text-primary">{property.conversion_rate}%</p>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedProperty(property)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Detail Modal/Panel would go here */}
      {selectedProperty && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedProperty.property_name} - Detailed Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Trends</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { name: 'Week 1', views: selectedProperty.views * 0.7, bookings: selectedProperty.bookings * 0.6 },
                        { name: 'Week 2', views: selectedProperty.views * 0.8, bookings: selectedProperty.bookings * 0.7 },
                        { name: 'Week 3', views: selectedProperty.views * 0.9, bookings: selectedProperty.bookings * 0.8 },
                        { name: 'Week 4', views: selectedProperty.views, bookings: selectedProperty.bookings }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" />
                        <Line type="monotone" dataKey="bookings" stroke="hsl(var(--secondary))" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Views</span>
                        <span className="font-medium">{selectedProperty.views}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-medium">${Math.round(selectedProperty.revenue).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Rating</span>
                        <span className="font-medium">{selectedProperty.rating}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conversion Rate</span>
                        <span className="font-medium">{selectedProperty.conversion_rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <div className="space-y-3">
                  {selectedProperty.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Performance Insights</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      This property is performing {selectedProperty.engagement_score > avgEngagement ? 'above' : 'below'} average 
                      with a {selectedProperty.engagement_score}% engagement score.
                    </p>
                  </div>
                  
                  {selectedProperty.conversion_rate < 5 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Improvement Opportunity</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Low conversion rate detected. Consider updating photos or descriptions to improve booking rates.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyPerformanceTracker;