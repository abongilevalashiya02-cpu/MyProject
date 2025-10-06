import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, Plane, BookOpen, Users, Mountain, Building2, User, Settings,
  Calendar, Star, MapPin, Globe, TrendingUp, Award, Activity,
  MessageSquare, Target, Clock, DollarSign, BarChart3, Coffee, Sparkles,
  ChevronDown, ChevronRight, Menu, X, Bell, Search, Filter, Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  children?: NavigationItem[];
}

export const UnifiedSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeModule,
  onModuleChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboards']);

  const navigationItems: NavigationItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'dashboards',
      title: 'Dashboards',
      icon: BarChart3,
      path: '#',
      children: [
        {
          id: 'traveler',
          title: 'Travel Explorer',
          icon: Plane,
          path: '/dashboard/traveler',
          badge: '3'
        },
        {
          id: 'mafunzo',
          title: 'Learning Hub',
          icon: BookOpen,
          path: '/mafunzo/dashboard',
          badge: '8'
        },
        {
          id: 'abantu',
          title: 'Community',
          icon: Users,
          path: '/abantu/dashboard',
          badge: '127'
        },
        {
          id: 'retreat',
          title: 'Retreat Center',
          icon: Mountain,
          path: '/retreat-dashboard',
          badge: '5'
        },
        {
          id: 'service-provider',
          title: 'Service Provider',
          icon: Building2,
          path: '/service-provider/dashboard',
          badge: '12'
        }
      ]
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: Globe,
      path: '/countries'
    },
    {
      id: 'bookings',
      title: 'My Bookings',
      icon: Calendar,
      path: '/quotations/legacy',
      badge: '3'
    },
    {
      id: 'favorites',
      title: 'Favorites',
      icon: Star,
      path: '/profile'
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageSquare,
      path: '/abantu/dashboard',
      badge: '5'
    }
  ];

  const quickStats = [
    { label: 'Bookings', value: '23', trend: '+12%', color: 'text-blue-600' },
    { label: 'Countries', value: '8', trend: '+2', color: 'text-green-600' },
    { label: 'Learning', value: '156h', trend: '+24h', color: 'text-purple-600' },
    { label: 'Network', value: '127', trend: '+15', color: 'text-orange-600' }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      navigate(item.path);
      onModuleChange(item.id);
      if (window.innerWidth < 1024) {
        onToggle(); // Close sidebar on mobile
      }
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-50 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-bantu-orange/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-bantu-orange text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.user_metadata?.full_name || 'Explorer'}
                  </p>
                  <p className="text-sm text-gray-500">Cultural Ambassador</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => (
                <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className="text-xs text-green-600">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.id);
                const isItemActive = isActive(item.path);

                return (
                  <div key={item.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isItemActive
                          ? 'bg-bantu-orange text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              isItemActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {hasChildren && (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </motion.button>

                    {/* Children */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-8 mt-2 space-y-1"
                        >
                          {item.children?.map((child) => {
                            const ChildIconComponent = child.icon;
                            const isChildActive = isActive(child.path);

                            return (
                              <motion.button
                                key={child.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleNavigation(child)}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                                  isChildActive
                                    ? 'bg-bantu-orange text-white shadow-md'
                                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <ChildIconComponent className="h-4 w-4" />
                                  <span className="text-sm font-medium">{child.title}</span>
                                </div>
                                {child.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      isChildActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}
                                  >
                                    {child.badge}
                                  </Badge>
                                )}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50">
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile')}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UnifiedSidebar;