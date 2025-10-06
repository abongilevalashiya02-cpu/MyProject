import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SmartBreadcrumbs from '@/components/navigation/SmartBreadcrumbs';
import { 
  Home,
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Calendar,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    { 
      name: 'My Quotations', 
      href: '/dashboard?section=quotations', 
      icon: FileText,
      current: location.pathname.startsWith('/quotations') || location.search.includes('section=quotations'),
      badge: 'Active'
    },
    { 
      name: 'My Account', 
      href: '/profile', 
      icon: Users,
      current: location.pathname === '/profile',
      disabled: false
    }
  ];

  const settingsNavigation = [
    { 
      name: 'Preferences', 
      href: '/quotation-settings', 
      icon: Settings,
      current: location.pathname === '/quotation-settings'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold text-primary">
              Bantu Stall
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              
              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <IconComponent className="mr-3 h-4 w-4" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.current 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <IconComponent className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge 
                      variant={item.current ? "secondary" : "outline"} 
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t">
            {settingsNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.current 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Breadcrumb Navigation */}
          <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-3">
              <SmartBreadcrumbs />
            </div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;