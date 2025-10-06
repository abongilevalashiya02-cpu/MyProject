import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Calendar, Users, MapPin, DollarSign, 
  Star, Clock, CheckCircle, AlertCircle, ArrowRight, MoreHorizontal,
  Zap, Target, Globe, Gift, LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    timeframe?: string;
  };
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  className,
  color = 'default'
}) => {
  const colorClasses = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={cn(colorClasses[color], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change.type === 'increase' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(change.value)}%</span>
                  {change.timeframe && (
                    <span className="text-gray-500">vs {change.timeframe}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          {Icon && (
            <div className="p-3 bg-bantu-orange/10 rounded-lg">
              <Icon className="h-6 w-6 text-bantu-orange" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Action Card
interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  color?: string;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  icon: Icon,
  href,
  badge,
  color = 'bg-bantu-orange',
  className
}) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow cursor-pointer", className)}>
      <Link to={href}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-2 rounded-lg", `${color}/10`)}>
                  <Icon className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
                </div>
                {badge && <Badge variant="outline">{badge}</Badge>}
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

// Recent Activity Item
interface ActivityItem {
  id: string;
  type: 'booking' | 'quotation' | 'payment' | 'message' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'cancelled';
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  title?: string;
  className?: string;
  maxItems?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  title = "Recent Activity",
  className,
  maxItems = 5,
  showViewAll = true,
  viewAllHref = "#"
}) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'quotation': return DollarSign;
      case 'payment': return CheckCircle;
      case 'message': return Users;
      case 'review': return Star;
      default: return Clock;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {showViewAll && (
          <Button variant="outline" size="sm" asChild>
            <Link to={viewAllHref}>View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, maxItems).map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <span className="text-xs text-gray-500">
                      {format(activity.timestamp, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  {activity.status && (
                    <Badge 
                      variant="outline" 
                      className={cn("mt-1", getStatusColor(activity.status))}
                    >
                      {activity.status}
                    </Badge>
                  )}
                </div>
                {activity.user && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Progress Card
interface ProgressCardProps {
  title: string;
  description?: string;
  progress: number;
  target?: number;
  unit?: string;
  color?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  progress,
  target,
  unit = '',
  color = 'bg-bantu-orange',
  className,
  showPercentage = true
}) => {
  const percentage = target ? (progress / target) * 100 : progress;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            {showPercentage && (
              <Badge variant="outline">
                {Math.round(percentage)}%
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress}{unit}</span>
              {target && <span>{target}{unit}</span>}
            </div>
            <Progress 
              value={percentage} 
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Chart Card (placeholder for future chart integration)
interface ChartCardProps {
  title: string;
  data?: Record<string, unknown>[];
  type?: 'line' | 'bar' | 'pie' | 'area';
  className?: string;
  height?: number;
  actions?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data = [],
  type = 'line',
  className,
  height = 300,
  actions
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {actions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Configure</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
          style={{ height }}
        >
          <div className="text-center text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chart component placeholder</p>
            <p className="text-xs">Data visualization will be implemented here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Goal Card
interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  icon: LucideIcon;
  deadline?: Date;
  status?: 'on-track' | 'behind' | 'completed';
  className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  progress,
  target,
  unit,
  icon: Icon,
  deadline,
  status = 'on-track',
  className
}) => {
  const percentage = (progress / target) * 100;
  
  const statusColors = {
    'on-track': 'text-green-600',
    'behind': 'text-red-600',
    'completed': 'text-blue-600'
  };

  const statusBadges = {
    'on-track': 'On Track',
    'behind': 'Behind',
    'completed': 'Completed'
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bantu-orange/10 rounded-lg">
              <Icon className="h-5 w-5 text-bantu-orange" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={statusColors[status]}
          >
            {statusBadges[status]}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">
              {progress}<span className="text-lg text-gray-500">/{target}</span>
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
          
          <Progress value={percentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(percentage)}% complete</span>
            {deadline && (
              <span>Due {format(deadline, 'MMM dd, yyyy')}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Notification Card
interface NotificationCardProps {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }>;
  onDismiss?: () => void;
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  type,
  timestamp,
  actions = [],
  onDismiss,
  className
}) => {
  const typeIcons = {
    info: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle
  };

  const typeColors = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    error: 'text-red-600 bg-red-50 border-red-200'
  };

  const Icon = typeIcons[type];

  return (
    <Card className={cn(typeColors[type], className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm mt-1 opacity-90">{message}</p>
            <p className="text-xs mt-2 opacity-75">
              {format(timestamp, 'MMM dd, yyyy HH:mm')}
            </p>
            {actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="p-1 h-auto"
            >
              ×
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
