import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Bell, X, TrendingUp, Users, MapPin, Clock } from 'lucide-react';

interface ActivityUpdate {
  id: string;
  type: 'venue_interest' | 'quotation_update' | 'new_venue' | 'market_trend';
  title: string;
  description: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface RealTimeActivityFeedProps {
  onActivityClick?: (activity: ActivityUpdate) => void;
}

const RealTimeActivityFeed: React.FC<RealTimeActivityFeedProps> = ({ onActivityClick }) => {
  const [activities, setActivities] = useState<ActivityUpdate[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Setup real-time subscription for venue quotation requests
    const quotationChannel = supabase
      .channel('quotation_activity')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'quotations'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newActivity: ActivityUpdate = {
              id: `quotation-${payload.new.id}`,
              type: 'quotation_update',
              title: 'New Quotation Request',
              description: `Someone requested a quote for ${payload.new.venue_name}`,
              timestamp: new Date().toISOString(),
              data: payload.new
            };
            addActivity(newActivity);
          }
        }
      )
      .subscribe();

    // Simulate market trend updates
    const trendInterval = setInterval(() => {
      const trends = [
        {
          title: 'High Demand Alert',
          description: 'Team building venues are 40% more popular this month',
          venue: 'Magaliesburg area'
        },
        {
          title: 'New Venue Added',
          description: 'A luxury spa venue just joined our network',
          venue: 'Pretoria Winelands'
        },
        {
          title: 'Price Update',
          description: 'Special corporate rates now available',
          venue: 'Muldersdrift venues'
        }
      ];

      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      const newActivity: ActivityUpdate = {
        id: `trend-${Date.now()}`,
        type: 'market_trend',
        title: randomTrend.title,
        description: `${randomTrend.description} in ${randomTrend.venue}`,
        timestamp: new Date().toISOString()
      };
      
      addActivity(newActivity);
    }, 30000); // Every 30 seconds

    // Cleanup
    return () => {
      supabase.removeChannel(quotationChannel);
      clearInterval(trendInterval);
    };
  }, [user]);

  const addActivity = (activity: ActivityUpdate) => {
    setActivities(prev => {
      const updated = [activity, ...prev].slice(0, 5); // Keep only last 5 activities
      return updated;
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      setActivities(prev => prev.filter(a => a.id !== activity.id));
    }, 10000);
  };

  const getActivityIcon = (type: ActivityUpdate['type']) => {
    switch (type) {
      case 'venue_interest':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      case 'quotation_update':
        return <Bell className="h-4 w-4 text-green-600" />;
      case 'new_venue':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'market_trend':
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityUpdate['type']) => {
    switch (type) {
      case 'venue_interest':
        return 'border-blue-200 bg-blue-50';
      case 'quotation_update':
        return 'border-green-200 bg-green-50';
      case 'new_venue':
        return 'border-purple-200 bg-purple-50';
      case 'market_trend':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isVisible || activities.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Live Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className={`${getActivityColor(activity.type)} shadow-lg border cursor-pointer hover:shadow-xl transition-all`}
          onClick={() => onActivityClick?.(activity)}
        >
          <CardContent className="p-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>now</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {activity.description}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2 text-xs"
                >
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealTimeActivityFeed;
