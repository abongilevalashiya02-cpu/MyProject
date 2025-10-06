import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface SmartBreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({ 
  customItems, 
  showHome = true, 
  className = '' 
}) => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({ label: 'Home', href: '/', icon: Home });
    }

    // Enhanced path mapping with better labels
    const pathLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'quotations': 'Quotations',
      'retreat-dashboard': 'Retreat Planning',
      'service-provider': 'Service Provider',
      'profile': 'Profile',
      'settings': 'Settings',
      'clients': 'Client Management',
      'products': 'Product Management',
      'reports': 'Reports & Analytics',
      
      'about': 'About Us',
      'countries': 'Destinations',
      'events': 'Events',
      'vault': 'Indaba',
      'musika': 'Musika',
      'mafunzo': 'Mafunzo Learning',
      'abantu': 'Abantu Community',
      'admin': 'Administration',
      'traveler': 'Travel Dashboard',
      'unified': 'Unified Dashboard'
    };

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip UUIDs and other non-meaningful segments
      if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return;
      }

      const label = pathLabels[segment] || segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const IconComponent = item.icon;

        return (
          <React.Fragment key={item.href}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              {isLast ? (
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {item.label}
                </Link>
              )}
            </motion.div>
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SmartBreadcrumbs;
