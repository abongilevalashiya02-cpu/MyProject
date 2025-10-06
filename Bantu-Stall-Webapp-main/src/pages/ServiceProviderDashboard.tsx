import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProviderDashboardLayout } from '@/components/service-provider/ProviderDashboardLayout';
import { DashboardOverview } from '@/components/service-provider/DashboardOverview';
import { ApplicationsTab } from '@/components/service-provider/ApplicationsTab';
import { BookingsTab } from '@/components/service-provider/BookingsTab';
import { EarningsTab } from '@/components/service-provider/EarningsTab';
import { ProfileTab } from '@/components/service-provider/ProfileTab';
import { LocationWeatherWidget } from '@/components/widgets/LocationWeatherWidget';
import { NewsEventsWidget } from '@/components/widgets/NewsEventsWidget';
import QuotationManagement from '@/components/quotations/QuotationManagement';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import EnhancedQuotationSystem from '@/components/quotation/EnhancedQuotationSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, Users, DollarSign, Calendar, Star, MapPin,
  Building2, Award, MessageSquare, Clock, BarChart3, Target,
  Zap, Shield, Bell, Search, Filter, PlusCircle, Eye,
  Activity, Globe, Briefcase, CheckCircle, AlertCircle,
  ArrowUp, ArrowDown, Phone, Mail, Settings, FileText,
  Camera, Edit3, Share2, Download, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/use-toast';

interface ServiceProviderDashboardProps {
  activeTab?: string;
}

const ServiceProviderDashboard: React.FC<ServiceProviderDashboardProps> = ({ activeTab: propActiveTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToHistory } = useAppState();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>(propActiveTab || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('30days');
  const [showEnhancedBooking, setShowEnhancedBooking] = useState(false);
  const [showEnhancedQuotation, setShowEnhancedQuotation] = useState(false);
  
  const [stats, setStats] = useState({
    totalBookings: 156,
    totalRevenue: 48750,
    averageRating: 4.8,
    activeListings: 12,
    pendingQuotations: 8,
    monthlyGrowth: 23.5,
    responseTime: 2.5,
    completionRate: 98.2,
    conversionRate: 67.3,
    repeatCustomers: 89,
    totalViews: 23567,
    profileCompleteness: 85
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'booking',
      message: 'New booking request for Serengeti Safari Package',
      time: '10 minutes ago',
      status: 'pending',
      amount: '$2,450'
    },
    {
      id: 2,
      type: 'review',
      message: 'New 5-star review from Maria Santos',
      time: '1 hour ago',
      status: 'completed',
      rating: 5
    },
    {
      id: 3,
      type: 'quotation',
      message: 'Quotation request for custom cultural tour',
      time: '3 hours ago',
      status: 'pending',
      amount: '$1,800'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Payment received for Mount Kenya Trek',
      time: '5 hours ago',
      status: 'completed',
      amount: '$3,200'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    bookingsTrend: [
      { period: 'Jan', bookings: 12, revenue: 18400 },
      { period: 'Feb', bookings: 19, revenue: 29200 },
      { period: 'Mar', bookings: 15, revenue: 23100 },
      { period: 'Apr', bookings: 25, revenue: 38500 },
      { period: 'May', bookings: 22, revenue: 33900 },
      { period: 'Jun', bookings: 28, revenue: 43200 }
    ],
    topServices: [
      { name: 'Serengeti Safari', bookings: 45, revenue: 22500, growth: 15 },
      { name: 'Cultural Village Tour', bookings: 38, revenue: 11400, growth: 8 },
      { name: 'Mount Kenya Trek', bookings: 32, revenue: 19200, growth: 22 },
      { name: 'Zanzibar Beach Retreat', bookings: 28, revenue: 16800, growth: -5 }
    ]
  });

  const fetchProviderStats = useCallback(async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use the mock data already set in state
      
      toast({
        title: "Dashboard Updated",
        description: "Latest data has been loaded successfully.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error fetching provider stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    addToHistory('/service-provider/dashboard');
    fetchProviderStats();
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [user, addToHistory, fetchProviderStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProviderStats();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/service-provider/dashboard${tab === 'dashboard' ? '' : '/' + tab}`);
  };

  // Enhanced booking and quotation handlers
  const handleEnhancedBookingSubmit = async (data: unknown) => {
    try {
      // Process service booking data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowEnhancedBooking(false);
      toast({
        title: "Booking Created",
        description: "Service booking has been created successfully.",
      });
    } catch (error) {
      console.error('Booking submission failed:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnhancedQuotationSubmit = async (data: unknown) => {
    try {
      // Process service quotation data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowEnhancedQuotation(false);
      toast({
        title: "Quotation Generated",
        description: "Service quotation has been generated successfully.",
      });
    } catch (error) {
      console.error('Quotation submission failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate quotation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'quotation': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" className="text-red-600 border-red-600">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bantu-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your service provider dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProviderDashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="space-y-8">
        {activeTab === 'dashboard' && (
          <>
            {/* Enhanced Header with Actions */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-bantu-orange via-amber-500 to-yellow-500 rounded-xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Service Provider Hub</h1>
                    <p className="text-white/90 mb-4">
                      Manage your services and grow your African tourism business
                    </p>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        Profile {stats.profileCompleteness}% Complete
                      </Badge>
                      <Badge className="bg-green-500/20 text-white border-green-400/30">
                        {stats.averageRating}★ Rated Provider
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Stats Grid with Animations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-blue-700">{stats.totalBookings}</p>
                      <p className="text-xs text-blue-500 mt-1 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +{stats.monthlyGrowth}% this month
                      </p>
                    </div>
                    <Calendar className="h-12 w-12 text-blue-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-700">${stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-500 mt-1 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +18% vs last month
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-green-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Average Rating</p>
                      <p className="text-3xl font-bold text-yellow-700">{stats.averageRating}</p>
                      <p className="text-xs text-yellow-500 mt-1">Based on 127 reviews</p>
                    </div>
                    <Star className="h-12 w-12 text-yellow-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Active Listings</p>
                      <p className="text-3xl font-bold text-purple-700">{stats.activeListings}</p>
                      <p className="text-xs text-purple-500 mt-1">{stats.totalViews.toLocaleString()} total views</p>
                    </div>
                    <Building2 className="h-12 w-12 text-purple-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending Quotes</p>
                      <p className="text-3xl font-bold text-orange-700">{stats.pendingQuotations}</p>
                      <p className="text-xs text-orange-500 mt-1">Requires attention</p>
                    </div>
                    <MessageSquare className="h-12 w-12 text-orange-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-teal-600">Response Time</p>
                      <p className="text-3xl font-bold text-teal-700">{stats.responseTime}h</p>
                      <p className="text-xs text-teal-500 mt-1">Average response</p>
                    </div>
                    <Clock className="h-12 w-12 text-teal-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Conversion Rate</p>
                      <p className="text-3xl font-bold text-indigo-700">{stats.conversionRate}%</p>
                      <p className="text-xs text-indigo-500 mt-1">Views to bookings</p>
                    </div>
                    <Target className="h-12 w-12 text-indigo-600/70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-pink-700">{stats.completionRate}%</p>
                      <p className="text-xs text-pink-500 mt-1">Quality assurance</p>
                    </div>
                    <Award className="h-12 w-12 text-pink-600/70" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Recent Activity & Performance */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-bantu-orange" />
                        Recent Activity
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {getActivityIcon(activity.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activity.amount && (
                              <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                            )}
                            {getStatusBadge(activity.status)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analytics */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-bantu-orange" />
                      Top Performing Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceMetrics.topServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">${service.revenue.toLocaleString()}</span>
                                <div className={`flex items-center text-xs ${
                                  service.growth > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {service.growth > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                  {Math.abs(service.growth)}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{service.bookings} bookings</span>
                              <Progress value={(service.bookings / 50) * 100} className="w-24 h-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-bantu-orange" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start h-auto py-3"
                        onClick={() => setShowEnhancedBooking(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Create Service Booking</p>
                          <p className="text-xs text-gray-500">New service booking</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start h-auto py-3"
                        onClick={() => setShowEnhancedQuotation(true)}
                      >
                        <MessageSquare className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Generate Quote</p>
                          <p className="text-xs text-gray-500">Create detailed quotation</p>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="justify-start h-auto py-3">
                        <BarChart3 className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">View Analytics</p>
                          <p className="text-xs text-gray-500">Track performance</p>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="justify-start h-auto py-3">
                        <Calendar className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Manage Calendar</p>
                          <p className="text-xs text-gray-500">Update availability</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Widgets */}
                <LocationWeatherWidget />
                <NewsEventsWidget maxItems={3} />
              </div>
            </div>

            {/* Enhanced Dashboard Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Business Overview</TabsTrigger>
                <TabsTrigger value="quotations">Quotations</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <DashboardOverview />
              </TabsContent>
              
              <TabsContent value="quotations" className="space-y-6">
                <QuotationManagement />
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-bantu-orange" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-700 mb-2">Booking Trends</h4>
                          <p className="text-2xl font-bold text-blue-800">↗ 34%</p>
                          <p className="text-sm text-blue-600">vs last month</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-green-700 mb-2">Revenue Growth</h4>
                          <p className="text-2xl font-bold text-green-800">↗ 28%</p>
                          <p className="text-sm text-green-600">vs last month</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-purple-700 mb-2">Customer Satisfaction</h4>
                          <p className="text-2xl font-bold text-purple-800">4.8/5</p>
                          <p className="text-sm text-purple-600">Average rating</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Other tabs render their original content */}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'earnings' && <EarningsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Enhanced Booking Form Modal */}
      <EnhancedBookingForm
        isOpen={showEnhancedBooking}
        onClose={() => setShowEnhancedBooking(false)}
        onSubmit={handleEnhancedBookingSubmit}
      />

      {/* Enhanced Quotation System Modal */}
      <EnhancedQuotationSystem
        isOpen={showEnhancedQuotation}
        onClose={() => setShowEnhancedQuotation(false)}
        mode="create"
        onSave={handleEnhancedQuotationSubmit}
      />
    </ProviderDashboardLayout>
  );
};

export default ServiceProviderDashboard;
