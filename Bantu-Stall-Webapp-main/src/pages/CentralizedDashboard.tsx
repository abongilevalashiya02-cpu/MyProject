import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useUnifiedQuotationStats } from '@/hooks/useUnifiedQuotations';
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
import DashboardErrorBoundary from '@/components/dashboard/ErrorBoundary';
import { DashboardOverviewSkeleton, QuotationsSectionSkeleton } from '@/components/dashboard/SkeletonLoader';
import { usePerformanceMonitor, useUserInteractionTracking } from '@/hooks/usePerformanceMonitor';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
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
  icon: React.ComponentType<{ className?: string }>;
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
  learningProgress: number;
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
  metadata?: Record<string, string | number>;
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
  
  // Performance monitoring
  const { measureStart, recordMetrics } = usePerformanceMonitor('CentralizedDashboard');
  const { trackPageView, trackClick } = useUserInteractionTracking('CentralizedDashboard');
  const { offlineState } = useOfflineSupport();
  
  // Get unified quotation stats
  const { stats: unifiedQuotationStats, isLoading: quotationStatsLoading } = useUnifiedQuotationStats();
  
  // Track page view
  useEffect(() => {
    trackPageView('dashboard');
  }, [trackPageView]);
  
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
      learningProgress: 0,
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
        .single();

      const profileData: UserProfile = {
        id: user.id,
        user_type: userMetadata?.first_name || 'traveler',
        last_active: userMetadata?.updated_at,
        full_name: `${userMetadata?.first_name || ''} ${userMetadata?.last_name || ''}`.trim(),
        avatar_url: '',
        company: userMetadata?.email || '',
        location: 'Africa'
      };
      setUserProfile(profileData);

      // Parallel data fetching for other stats (excluding quotations as they're handled by the unified hook)
      const [
        propertyListingsResponse,
        horoApplicationsResponse,
        clientsResponse
      ] = await Promise.allSettled([
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
      const properties = propertyListingsResponse.status === 'fulfilled' ? propertyListingsResponse.value.data || [] : [];
      const applications = horoApplicationsResponse.status === 'fulfilled' ? horoApplicationsResponse.value.data || [] : [];
      const clients = clientsResponse.status === 'fulfilled' ? clientsResponse.value.data || [] : [];

      // Calculate dynamic stats using unified quotation stats
      const stats: DashboardStats = {
        totalQuotations: unifiedQuotationStats.totalQuotations,
        activeBookings: unifiedQuotationStats.activeBookings,
        totalRevenue: unifiedQuotationStats.totalRevenue,
        learningProgress: Math.min(100, unifiedQuotationStats.totalQuotations * 5),
        properties: properties.length,
        applications: applications.length,
        unreadMessages: unifiedQuotationStats.pendingQuotations,
        completedCourses: Math.floor(unifiedQuotationStats.totalQuotations / 2)
      };

      // Build recent activity using unified quotation activity
      const recentActivity: ActivityItem[] = [
        ...unifiedQuotationStats.recentActivity.slice(0, 5),
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
          title: `Property: ${prop.property_name}`,
          description: `${prop.property_type} in ${prop.location}`,
          created_at: prop.created_at,
          status: prop.status || 'active',
          metadata: { location: prop.location, type: prop.property_type }
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

      // Generate dynamic notifications using unified quotation data
      const notifications: NotificationItem[] = [
        ...unifiedQuotationStats.recentActivity.filter(q => q.status === 'pending').slice(0, 3).map(q => ({
          id: `quote-${q.id}`,
          title: 'Quotation Pending',
          message: `Your quotation request is being reviewed`,
          type: 'info' as const,
          created_at: q.created_at,
          read: false,
          action_url: `/quotations`
        })),
        ...unifiedQuotationStats.recentActivity.filter(q => q.status === 'approved').slice(0, 3).map(q => ({
          id: `approved-${q.id}`,
          title: 'Quotation Approved!',
          message: `Your quotation has been approved`,
          type: 'success' as const,
          created_at: q.created_at,
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

      recordMetrics();

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Set fallback data on error
      setRealTimeData(prev => ({
        ...prev,
        stats: {
          totalQuotations: unifiedQuotationStats.totalQuotations,
          activeBookings: unifiedQuotationStats.activeBookings,
          totalRevenue: unifiedQuotationStats.totalRevenue,
          learningProgress: 0,
          properties: 0,
          applications: 0,
          unreadMessages: 0,
          completedCourses: 0
        },
        recentActivity: unifiedQuotationStats.recentActivity,
        notifications: [],
        isLoading: false,
        lastUpdated: new Date()
      }));
    } finally {
      if (showRefreshIndicator) setRefreshing(false);
    }
  }, [user?.id, unifiedQuotationStats, recordMetrics]);

  // Initial data load and dependency on unified quotation stats
  useEffect(() => {
    if (user?.id && !quotationStatsLoading) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user?.id, quotationStatsLoading]);

  // Handle refresh with user feedback
  const handleRefresh = useCallback(async () => {
    trackClick('refresh', 'dashboard');
    fetchDashboardData(true);
  }, [fetchDashboardData, trackClick]);

  // Get active section from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [location.search]);

  // Navigation configuration with proper structure and badges
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      id: 'overview',
      title: 'Overview',
      icon: Home,
      description: 'Dashboard overview and quick stats',
      badge: realTimeData.notifications.filter(n => !n.read).length || undefined
    },
    {
      id: 'travel',
      title: 'Travel & Experiences',
      icon: Plane,
      children: [
        {
          id: 'quotations',
          title: 'My Quotations',
          icon: FileText,
          description: 'Request and manage quotations',
          badge: realTimeData.stats.totalQuotations || undefined,
          path: '/quotations/legacy'
        },
        {
          id: 'retreats',
          title: 'Corporate Retreats',
          icon: Mountain,
          description: 'Plan team retreats and offsites',
          path: '/retreats'
        },
        {
          id: 'bookings',
          title: 'My Bookings',
          icon: Calendar,
          description: 'Manage your travel bookings',
          badge: realTimeData.stats.activeBookings || undefined
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Services',
      icon: Briefcase,
      children: [
        {
          id: 'venues',
          title: 'Venue Listings',
          icon: Building2,
          description: 'List your properties',
          badge: realTimeData.stats.properties || undefined,
          path: '/venues'
        },
        {
          id: 'applications',
          title: 'Service Applications',
          icon: Users,
          description: 'Apply to become a service provider',
          badge: realTimeData.stats.applications || undefined
        }
      ]
    },
    {
      id: 'learning',
      title: 'Learning Hub',
      icon: GraduationCap,
      children: [
        {
          id: 'courses',
          title: 'My Courses', 
          icon: BookOpen,
          description: 'Access your learning materials',
          badge: realTimeData.stats.completedCourses || undefined
        },
        {
          id: 'resources',
          title: 'Resources',
          icon: Brain,
          description: 'Guides and educational content'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      description: 'Account and preferences'
    }
  ], [realTimeData]);

  // Filter navigation items based on search
  const filteredNavigationItems = useMemo(() => {
    if (!searchQuery) return navigationItems;
    
    return navigationItems.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingChildren = item.children?.some(child => 
        child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesTitle || hasMatchingChildren;
    });
  }, [navigationItems, searchQuery]);

  // Render navigation item with proper styling and interaction
  const renderNavigationItem = useCallback((item: NavigationItem, level = 0) => {
    const isActive = activeSection === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-auto p-3 ${
                  isActive 
                    ? 'bg-bantu-orange text-white shadow-md' 
                    : 'hover:bg-bantu-orange/10 hover:text-bantu-orange'
                } ${sidebarCollapsed ? 'px-2' : ''}`}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.id);
                  } else {
                    handleNavigation(item);
                    trackClick('nav', item.id);
                  }
                }}
              >
                <item.icon className={`${sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.title}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="h-5 px-2 text-xs bg-bantu-yellow text-bantu-orange"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {hasChildren && (
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </div>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="max-w-xs">
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-sm opacity-90 mt-1">{item.description}</div>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {hasChildren && isExpanded && !sidebarCollapsed && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1"
            >
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }, [activeSection, expandedItems, sidebarCollapsed, handleNavigation, trackClick, toggleExpanded]);

  // Main dashboard content renderer
  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent realTimeData={realTimeData} userProfile={userProfile} />;
      case 'quotations':
        return <QuotationsSectionContent realTimeData={realTimeData} />;
      default:
        return <DefaultSectionContent section={activeSection} />;
    }
  };

  // Loading states
  if (realTimeData.isLoading && Object.keys(realTimeData.stats).every(key => realTimeData.stats[key as keyof DashboardStats] === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {activeSection === 'quotations' ? <QuotationsSectionSkeleton /> : <DashboardOverviewSkeleton />}
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="flex">
          {/* Desktop Sidebar */}
          <div className={`hidden lg:flex flex-col border-r bg-white/80 backdrop-blur-sm transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-80'
          }`}>
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-bantu-orange rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-bantu-orange">Bantu Stall</h1>
                      <p className="text-xs text-gray-500">Your African Business Hub</p>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="flex-shrink-0"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* User Profile Section */}
            {userProfile && (
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userProfile.avatar_url} />
                    <AvatarFallback className="bg-bantu-orange text-white">
                      {userProfile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {userProfile.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {userProfile.company}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Search */}
            {!sidebarCollapsed && (
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                {filteredNavigationItems.map(item => renderNavigationItem(item))}
              </nav>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="border-t p-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`${sidebarCollapsed ? 'px-2' : 'w-full justify-start'}`}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} ${sidebarCollapsed ? '' : 'mr-2'}`} />
                  {!sidebarCollapsed && 'Refresh'}
                </Button>
                {!sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate('/');
                      trackClick('nav', 'logout');
                    }}
                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-xl"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-bantu-orange rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h1 className="font-bold text-bantu-orange">Bantu Stall</h1>
                            <p className="text-xs text-gray-500">Your African Business Hub</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 px-4 py-6">
                      <nav className="space-y-2">
                        {filteredNavigationItems.map(item => renderNavigationItem(item))}
                      </nav>
                    </ScrollArea>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Header - Mobile */}
            <div className="lg:hidden border-b bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-bantu-orange rounded flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-bantu-orange">Dashboard</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 lg:p-8">
                <Suspense fallback={<div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-bantu-orange" />
                </div>}>
                  {renderDashboardContent()}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

// Overview Content Component
const OverviewContent: React.FC<{ realTimeData: RealTimeData; userProfile: UserProfile | null }> = ({ 
  realTimeData, 
  userProfile 
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Request Quote',
      description: 'Get pricing for services',
      icon: FileText,
      onClick: () => navigate('/quotations/new'),
      color: 'bg-gradient-to-r from-bantu-orange to-yellow-500 text-white',
      count: null
    },
    {
      title: 'Plan Retreat',
      description: 'Organize team events',
      icon: Mountain,
      onClick: () => navigate('/retreats'),
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      count: null
    },
    {
      title: 'List Property',
      description: 'Add venue to marketplace',
      icon: Building2,
      onClick: () => navigate('/venues/new'),
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      count: realTimeData.stats.properties
    },
    {
      title: 'My Bookings',
      description: 'View confirmed services',
      icon: Calendar,
      onClick: () => navigate('/bookings'),
      color: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
      count: realTimeData.stats.activeBookings
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center lg:text-left"
      >
        <div className="bg-gradient-to-r from-bantu-orange to-yellow-500 text-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Explorer'}! 🌍
          </h1>
          <p className="text-lg opacity-90">
            Ready to unlock Africa's potential? Your journey to authentic business experiences starts here.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Quotations',
            value: realTimeData.stats.totalQuotations,
            icon: FileText,
            color: 'text-bantu-orange',
            bgColor: 'bg-orange-50',
            change: '+12%'
          },
          {
            title: 'Active Bookings',
            value: realTimeData.stats.activeBookings,
            icon: Calendar,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '+8%'
          },
          {
            title: 'Properties Listed',
            value: realTimeData.stats.properties,
            icon: Building2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+5%'
          },
          {
            title: 'Total Value',
            value: `$${(realTimeData.stats.totalRevenue / 1000).toFixed(1)}k`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            change: '+15%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-bantu-orange" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
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

// Quotations Section Content
const QuotationsSectionContent: React.FC<{ realTimeData: RealTimeData }> = ({ realTimeData }) => {
  const navigate = useNavigate();
  const { stats: unifiedStats } = useUnifiedQuotationStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-bantu-orange">My Quotations</h1>
          <p className="text-gray-600 mt-1">Request and manage service quotations</p>
        </div>
        <Button 
          onClick={() => navigate('/quotations/new')}
          className="bg-bantu-orange hover:bg-bantu-orange/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Quote
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-2 border-bantu-orange/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-bantu-orange">{unifiedStats.totalQuotations}</div>
            <p className="text-sm text-gray-500 mt-1">
              {unifiedStats.legacyQuotations} Enterprise + {unifiedStats.modernQuotations} Fast Quotes
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{unifiedStats.activeBookings}</div>
            <p className="text-sm text-gray-500 mt-1">Confirmed services</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${(unifiedStats.totalRevenue / 1000).toFixed(1)}k</div>
            <p className="text-sm text-gray-500 mt-1">Estimated value</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{unifiedStats.pendingQuotations}</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-bantu-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-bantu-orange" />
            Recent Quotation Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unifiedStats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {unifiedStats.recentActivity.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <Badge 
                        variant={item.metadata?.quotationType === 'legacy' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.metadata?.quotationType === 'legacy' ? 'Enterprise' : 'Fast Quote'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`${
                        item.status === 'approved' || item.status === 'accepted' || item.status === 'sent'
                          ? 'bg-green-500 text-white' 
                          : item.status === 'pending' || item.status === 'draft' || item.status === 'submitted'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {item.status}
                    </Badge>
                    {item.amount > 0 && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        ${item.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations yet</h3>
              <p className="text-gray-600 mb-4">Start by requesting your first quotation</p>
              <Button 
                onClick={() => navigate('/quotations/new')}
                className="bg-bantu-orange hover:bg-bantu-orange/90"
              >
                Request Quote
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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