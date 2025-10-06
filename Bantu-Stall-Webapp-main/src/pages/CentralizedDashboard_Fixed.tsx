import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Home, Users, BookOpen, Mountain, Building2, Settings, Bell, Search,
  Plane, Calendar, Star, MapPin, Globe, TrendingUp, Award, Activity,
  MessageSquare, Target, Clock, DollarSign, BarChart3, Coffee, Sparkles,
  Plus, Filter, Eye, Edit, Trash2, User, LogOut, Heart, Bookmark, 
  Camera, Compass, Network, Mail, Menu, X, ChevronRight, ChevronLeft,
  FileText, Package, Briefcase, Info, PlusCircle, Zap, Brain,
  GraduationCap, Maximize2, Minimize2, MoreVertical, Loader2, RefreshCw
} from 'lucide-react';

// TypeScript interfaces
interface UserProfile {
  id: string;
  user_type: string;
  last_active?: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  location?: string;
}

interface NavigationItem {
  id: string;
  title: string;
  icon: any;
  path?: string;
  children?: NavigationItem[];
  badge?: string | number;
  description?: string;
  color?: string;
}

interface DashboardStats {
  totalQuotations: number;
  activeBookings: number;
  totalRevenue: number;
  countriesExplored: number;
  learningProgress: number;
  communityConnections: number;
  properties: number;
  applications: number;
  unreadMessages: number;
  completedCourses: number;
}

interface ActivityItem {
  id: string;
  type: 'quotation' | 'application' | 'property';
  title: string;
  description: string;
  created_at: string;
  status: string;
  amount?: number | null;
  metadata?: any;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  action_url?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface RealTimeData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
  isLoading?: boolean;
  lastUpdated?: Date;
}

const CentralizedDashboard = () => {
  // All hooks at the top level
  const { user } = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['travel', 'business']);
  const [searchQuery, setSearchQuery] = useState('');
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    stats: {
      totalQuotations: 0,
      activeBookings: 0,
      totalRevenue: 0,
      countriesExplored: 0,
      learningProgress: 0,
      communityConnections: 0,
      properties: 0,
      applications: 0,
      unreadMessages: 0,
      completedCourses: 0
    },
    recentActivity: [],
    notifications: [],
    isLoading: true,
    lastUpdated: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);

  // All callbacks defined at top level
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleNavigation = useCallback((item: NavigationItem) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveSection(item.id);
      navigate(`/dashboard?section=${item.id}`);
    }
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, []);

  // Real-time data fetching function
  const fetchDashboardData = useCallback(async (showRefreshIndicator = false) => {
    if (!user?.id) return;

    try {
      if (showRefreshIndicator) setRefreshing(true);

      // Get user metadata first
      const { data: userMetadata } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const profileData: UserProfile = {
        id: user.id,
        user_type: (userMetadata as any)?.user_type || 'traveler',
        last_active: (userMetadata as any)?.last_active,
        full_name: (userMetadata as any)?.full_name,
        avatar_url: (userMetadata as any)?.avatar_url,
        company: (userMetadata as any)?.company,
        location: (userMetadata as any)?.location
      };
      setUserProfile(profileData);

      // Parallel data fetching for real-time stats
      const [
        quotationsResponse,
        propertyListingsResponse,
        horoApplicationsResponse,
        clientsResponse
      ] = await Promise.allSettled([
        supabase
          .from('quotation_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('property_listings')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('horo_applications')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
      ]);

      // Process data with safe access
      const quotations = quotationsResponse.status === 'fulfilled' ? quotationsResponse.value.data || [] : [];
      const properties = propertyListingsResponse.status === 'fulfilled' ? propertyListingsResponse.value.data || [] : [];
      const applications = horoApplicationsResponse.status === 'fulfilled' ? horoApplicationsResponse.value.data || [] : [];
      const clients = clientsResponse.status === 'fulfilled' ? clientsResponse.value.data || [] : [];

      // Calculate dynamic stats with safe field access
      const stats: DashboardStats = {
        totalQuotations: quotations.length,
        activeBookings: quotations.filter(q => q.status === 'approved' || q.status === 'confirmed').length,
        totalRevenue: quotations
          .filter(q => q.status === 'approved' || q.status === 'confirmed')
          .reduce((sum, q) => sum + (parseFloat(q.budget_range?.split('-')[1] || '0') || 0), 0),
        countriesExplored: new Set(quotations.map(q => q.company_name || 'Unknown').filter(Boolean)).size,
        learningProgress: Math.min(100, quotations.length * 5),
        communityConnections: clients.length,
        properties: properties.length,
        applications: applications.length,
        unreadMessages: quotations.filter(q => q.status === 'pending').length,
        completedCourses: Math.floor(quotations.length / 2)
      };

      // Build recent activity with safe field access
      const recentActivity: ActivityItem[] = [
        ...quotations.slice(0, 5).map(q => ({
          id: q.id,
          type: 'quotation' as const,
          title: `Quotation Request #${q.id.slice(-6)}`,
          description: `${(q as any).service_requested || 'Service'} request`,
          created_at: q.created_at,
          status: q.status,
          amount: parseFloat(q.budget_range?.split('-')[1] || '0') || 0,
          metadata: { service: (q as any).service_requested }
        })),
        ...applications.slice(0, 3).map(app => ({
          id: app.id,
          type: 'application' as const,
          title: 'Service Provider Application',
          description: `Application for ${app.company_name || 'Business'}`,
          created_at: app.created_at,
          status: app.status || 'pending',
          metadata: { business_name: app.company_name, business_type: app.job_title }
        })),
        ...properties.slice(0, 3).map(prop => ({
          id: prop.id,
          type: 'property' as const,
          title: `Property: ${prop.property_type || 'Listing'}`,
          description: `${prop.property_type} in ${prop.location}`,
          created_at: prop.created_at,
          status: prop.status || 'active',
          metadata: { location: prop.location, type: prop.property_type }
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

      // Generate dynamic notifications
      const notifications: NotificationItem[] = [
        ...quotations.filter(q => q.status === 'pending').map(q => ({
          id: `quote-${q.id}`,
          title: 'Quotation Pending',
          message: `Your quotation request is being reviewed`,
          type: 'info' as const,
          created_at: q.created_at,
          read: false,
          action_url: `/quotations`
        })),
        ...quotations.filter(q => q.status === 'approved').slice(0, 3).map(q => ({
          id: `approved-${q.id}`,
          title: 'Quotation Approved!',
          message: `Your quotation has been approved`,
          type: 'success' as const,
          created_at: q.updated_at || q.created_at,
          read: false,
          action_url: `/quotations`
        }))
      ].slice(0, 10);

      // Update state with real data
      setRealTimeData({
        stats,
        recentActivity,
        notifications,
        isLoading: false,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setRealTimeData(prev => ({ ...prev, isLoading: false }));
    } finally {
      if (showRefreshIndicator) setRefreshing(false);
    }
  }, [user?.id]);

  // Navigation items with dynamic data
  const navigationItems = useMemo((): NavigationItem[] => {
    if (!realTimeData) return [];
    
    const { stats, notifications } = realTimeData;
    
    return [
      {
        id: 'overview',
        title: 'Overview',
        icon: Home,
        description: 'Dashboard overview and analytics'
      },
      {
        id: 'travel',
        title: 'Travel & Explore',
        icon: Plane,
        children: [
          {
            id: 'explorer',
            title: 'Travel Explorer',
            icon: Compass,
            badge: stats.countriesExplored > 0 ? `${stats.countriesExplored}` : undefined,
            description: 'Discover African destinations and experiences'
          },
          {
            id: 'bookings',
            title: 'My Bookings',
            icon: Calendar,
            badge: stats.activeBookings > 0 ? `${stats.activeBookings}` : undefined,
            description: 'Track your bookings and itineraries'
          },
          {
            id: 'countries',
            title: 'Countries',
            icon: Globe,
            path: '/countries',
            description: 'Explore all African countries'
          }
        ]
      },
      {
        id: 'learning',
        title: 'Learning Hub',
        icon: BookOpen,
        children: [
          {
            id: 'courses',
            title: 'My Courses',
            icon: GraduationCap,
            badge: stats.completedCourses > 0 ? `${stats.completedCourses}` : undefined,
            description: 'Educational content and skill development'
          },
          {
            id: 'progress',
            title: 'Progress Tracking',
            icon: Target,
            badge: `${stats.learningProgress}%`,
            description: 'Monitor your learning achievements'
          }
        ]
      },
      {
        id: 'community',
        title: 'Community',
        icon: Users,
        children: [
          {
            id: 'members',
            title: 'Member Directory',
            icon: Users,
            badge: stats.communityConnections > 0 ? `${stats.communityConnections}` : undefined,
            description: 'Connect with fellow travelers and professionals'
          },
          {
            id: 'messages',
            title: 'Messages',
            icon: MessageSquare,
            badge: notifications.filter(n => !n.read).length.toString(),
            description: 'Community discussions and private messages'
          }
        ]
      },
      {
        id: 'tools',
        title: 'Tools & Services',
        icon: Zap,
        children: [
          {
            id: 'quotations',
            title: 'Quotations',
            icon: FileText,
            path: '/quotations',
            badge: stats.totalQuotations > 0 ? `${stats.totalQuotations}` : undefined,
            description: 'Request and manage service quotations'
          },
          {
            id: 'properties',
            title: 'Properties',
            icon: Building2,
            path: '/properties',
            badge: stats.properties > 0 ? `${stats.properties}` : undefined,
            description: 'Browse and manage property listings'
          }
        ]
      }
    ];
  }, [realTimeData]);

  const renderNavigationItem = useCallback((item: NavigationItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start transition-all duration-200 ${
                  depth > 0 ? 'ml-6 py-2' : 'py-3'
                } ${isActive 
                  ? 'bg-bantu-orange text-white shadow-lg' 
                  : 'hover:bg-bantu-orange/10 hover:text-bantu-orange'
                }`}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.id);
                  } else {
                    handleNavigation(item);
                  }
                }}
              >
                <item.icon className={`h-4 w-4 mr-3 ${
                  isActive ? 'text-white' : 'text-bantu-orange'
                }`} />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-bantu-orange/10 text-bantu-orange'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight 
                    className={`h-4 w-4 ml-2 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    } ${isActive ? 'text-white' : 'text-bantu-orange'}`}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-bantu-orange/20">
              <p>{item.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {item.children?.map(child => renderNavigationItem(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  }, [expandedItems, activeSection, toggleExpanded, handleNavigation]);

  const renderDashboardContent = () => {
    if (!realTimeData) return <div>Loading...</div>;
    
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewContent 
            userProfile={userProfile} 
            realTimeData={realTimeData}
            onRefresh={handleRefresh}
          />
        );
      default:
        return <DefaultSectionContent section={activeSection} />;
    }
  };

  // Effects
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get('section');
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [location.search, activeSection]);

  // Loading state with Bantu Stall branding
  if (realTimeData.isLoading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bantu-orange/5 via-white to-bantu-yellow/5">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-bantu-orange mx-auto" />
            <h2 className="text-2xl font-bold text-bantu-orange">Loading your dashboard...</h2>
            <p className="text-gray-600">Fetching real-time data from Bantu Stall</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bantu-orange/5 via-white to-bantu-yellow/5">
      <Navbar />
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-bantu-orange/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-bantu-orange">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-bantu-orange"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-full pb-20">
                <div className="p-4 space-y-2">
                  {navigationItems.map(item => renderNavigationItem(item))}
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 320 }}
          className="hidden lg:block bg-white border-r border-bantu-orange/20 shadow-xl relative z-20"
        >
          <div className="p-6 border-b border-bantu-orange/20">
            <div className="flex items-center justify-between">
              <motion.div
                initial={false}
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-bantu-orange to-bantu-yellow rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h1 className="text-xl font-bold text-bantu-orange">Dashboard</h1>
                    <p className="text-sm text-gray-600">Bantu Stall</p>
                  </div>
                )}
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-bantu-orange hover:bg-bantu-orange/10"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-full pb-20">
            <div className="p-4 space-y-2">
              {!sidebarCollapsed && (
                <>
                  <div className="px-3 py-2">
                    <Input
                      placeholder="Search dashboard..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-bantu-orange/20 focus:border-bantu-orange"
                    />
                  </div>
                  <Separator className="my-4 bg-bantu-orange/20" />
                </>
              )}
              {navigationItems
                .filter(item => 
                  searchQuery === '' || 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.children?.some(child => 
                    child.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map(item => renderNavigationItem(item))
              }
            </div>
          </ScrollArea>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 lg:p-8 max-w-full">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="border-bantu-orange text-bantu-orange"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-bantu-orange">Dashboard</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-bantu-orange text-bantu-orange"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Page Content */}
            <div className="space-y-8">
              {renderDashboardContent()}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

// Enhanced Overview Content Component with Bantu Stall colors and real-time data
const OverviewContent: React.FC<{ 
  userProfile: UserProfile | null; 
  realTimeData: RealTimeData;
  onRefresh: () => void;
}> = ({
  userProfile,
  realTimeData,
  onRefresh
}) => {
  const navigate = useNavigate();
  const { stats, recentActivity, notifications } = realTimeData;

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const userName = userProfile?.full_name?.split(' ')[0] || 'Explorer';
    return `${timeGreeting}, ${userName}!`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to explore Africa today? 🌍",
      "Your next adventure is just a click away! ✈️",
      "Discover the magic of Africa with Bantu Stall! 🦁",
      "Let's make today productive and inspiring! 🚀",
      "Connect, explore, and grow with our community! 🤝"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-bantu-yellow';
    if (value >= 40) return 'bg-bantu-orange';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Header with Bantu Stall gradient */}
      <motion.div 
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-bantu-orange/20 via-bantu-yellow/10 to-white p-8 border-2 border-bantu-orange/20 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-bantu-orange">
                {getPersonalizedGreeting()}
              </h1>
              <p className="text-xl text-gray-700 font-medium">
                {getMotivationalMessage()}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Welcome back to your Bantu Stall dashboard
              </p>
            </div>
            <div className="text-right space-y-2 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-bantu-orange/20">
              <div className="text-lg font-bold text-bantu-orange">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-bantu-orange/10" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-bantu-yellow/10" />
      </motion.div>

      {/* Real-time Stats Grid with dynamic data */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Quotations",
            value: stats.totalQuotations,
            change: `${stats.activeBookings} active`,
            icon: FileText,
            color: "text-bantu-orange",
            bgColor: "bg-bantu-orange/10",
            progress: Math.min(100, stats.totalQuotations * 5),
            trending: stats.totalQuotations > 0
          },
          {
            title: "Active Bookings",
            value: stats.activeBookings,
            change: `$${(stats.totalRevenue / 1000).toFixed(1)}k value`,
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-50",
            progress: Math.min(100, stats.activeBookings * 10),
            trending: stats.activeBookings > 0
          },
          {
            title: "Countries Explored",
            value: stats.countriesExplored,
            change: `${stats.learningProgress}% learning`,
            icon: Globe,
            color: "text-bantu-yellow",
            bgColor: "bg-bantu-yellow/10",
            progress: Math.min(100, stats.countriesExplored * 2),
            trending: stats.countriesExplored > 0
          },
          {
            title: "Community Network",
            value: stats.communityConnections,
            change: `${stats.unreadMessages} new messages`,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            progress: Math.min(100, stats.communityConnections),
            trending: stats.communityConnections > 0
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-bantu-orange/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform shadow-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  {stat.trending && (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">{stat.change}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(stat.progress)}`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-bantu-orange/20">
          <CardHeader className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10">
            <CardTitle className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-bantu-orange" />
              <span className="text-bantu-orange">Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Request Quote",
                  description: "Get custom service quotes",
                  icon: Plus,
                  onClick: () => navigate('/quotations'),
                  color: "bg-bantu-orange hover:bg-bantu-orange/90 text-white",
                  count: stats.totalQuotations
                },
                {
                  title: "Explore Countries",
                  description: "Discover African destinations",
                  icon: Globe,
                  onClick: () => navigate('/countries'),
                  color: "bg-green-600 hover:bg-green-700 text-white",
                  count: stats.countriesExplored
                },
                {
                  title: "Update Profile",
                  description: "Manage your account",
                  icon: User,
                  onClick: () => navigate('/profile'),
                  color: "bg-blue-600 hover:bg-blue-700 text-white",
                  count: null
                },
                {
                  title: "Join Community",
                  description: "Connect with travelers",
                  icon: Users,
                  onClick: () => navigate('/abantu'),
                  color: "bg-purple-600 hover:bg-purple-700 text-white",
                  count: stats.communityConnections
                }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Button 
                    className={`h-auto p-6 flex flex-col gap-3 w-full ${action.color} shadow-lg hover:shadow-xl transition-all`}
                    onClick={action.onClick}
                  >
                    <action.icon className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-bold text-lg">{action.title}</div>
                      <div className="text-xs opacity-90 mt-1">{action.description}</div>
                    </div>
                    {action.count !== null && action.count > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-bantu-yellow text-bantu-orange">
                        {action.count}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Default section content for unmatched sections
const DefaultSectionContent: React.FC<{ section: string }> = ({ section }) => {
  return (
    <div className="text-center py-20">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-bantu-orange/10 rounded-full flex items-center justify-center">
          <Building2 className="w-10 h-10 text-bantu-orange" />
        </div>
        <h2 className="text-2xl font-bold text-bantu-orange">Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The {section.replace('-', ' ')} section is currently under development. 
          We're working hard to bring you amazing features!
        </p>
        <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
          Notify Me When Ready
        </Button>
      </div>
    </div>
  );
};

export default CentralizedDashboard;
