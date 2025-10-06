import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { QuotationRequest } from '@/types/retreats';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  Eye, 
  DollarSign,
  Calendar,
  ChevronRight,
  Activity
} from 'lucide-react';

interface VenueActivity {
  venue_name: string;
  area: string;
  recent_requests: number;
  trending_score: number;
  popular_times: string[];
  price_range: string;
  last_activity: string;
}

interface MarketInsight {
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  timeframe: string;
}

interface MusikaDashboardWidgetProps {
  onNavigateToVenue?: (venueName: string) => void;
}

const MusikaDashboardWidget: React.FC<MusikaDashboardWidgetProps> = ({ onNavigateToVenue }) => {
  const [venueActivities, setVenueActivities] = useState<VenueActivity[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const processVenueActivity = useCallback((quotations: any[]): VenueActivity[] => {
    const venueMap = new Map<string, VenueActivity>();

    quotations.forEach(q => {
      const venueName = q.venue_name;
      if (!venueMap.has(venueName)) {
        venueMap.set(venueName, {
          venue_name: venueName,
          area: getVenueArea(venueName),
          recent_requests: 0,
          trending_score: 0,
          popular_times: [],
          price_range: getVenuePriceRange(venueName),
          last_activity: q.submitted_at
        });
      }
      
      const venue = venueMap.get(venueName)!;
      venue.recent_requests += 1;
      venue.trending_score = Math.min(100, venue.recent_requests * 15);
      
      if (new Date(q.submitted_at) > new Date(venue.last_activity)) {
        venue.last_activity = q.submitted_at;
      }
    });

    return Array.from(venueMap.values())
      .sort((a, b) => b.recent_requests - a.recent_requests)
      .slice(0, 5);
  }, []);

  const generateMarketInsights = useCallback((quotations: any[]): MarketInsight[] => {
    const thisWeek = quotations.length;
    const lastWeek = Math.floor(thisWeek * (0.8 + Math.random() * 0.4)); // Simulate last week data
    
    const insights: MarketInsight[] = [
      {
        title: 'Quotation Requests',
        description: 'Weekly quotation activity',
        trend: thisWeek > lastWeek ? 'up' : thisWeek < lastWeek ? 'down' : 'stable',
        percentage: Math.abs(Math.floor(((thisWeek - lastWeek) / lastWeek) * 100)),
        timeframe: 'this week'
      },
      {
        title: 'Team Building Focus',
        description: 'Venues with team building are trending',
        trend: 'up',
        percentage: 35,
        timeframe: 'this month'
      },
      {
        title: 'Magaliesburg Popularity',
        description: 'Mountain venues gaining traction',
        trend: 'up',
        percentage: 28,
        timeframe: 'this quarter'
      }
    ];

    return insights;
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      // Fetch recent quotation activity
      const { data: quotations, error } = await supabase
        .from('quotations')
        .select(`
          *,
          clients!inner(name, email)
        `)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process venue activity data
      const venueStats = processVenueActivity(quotations || []);
      setVenueActivities(venueStats);
      setTotalRequests(quotations?.length || 0);

      // Generate market insights
      const insights = generateMarketInsights(quotations || []);
      setMarketInsights(insights);

    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  }, [processVenueActivity, generateMarketInsights]);

  const setupRealTimeUpdates = useCallback(() => {
    const channel = supabase
      .channel('musika_activity')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'quotations'
        },
        () => {
          // Refresh data when new quotations come in
          fetchMarketData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMarketData]);

  useEffect(() => {
    if (user) {
      fetchMarketData();
      setupRealTimeUpdates();
    }
  }, [user, fetchMarketData, setupRealTimeUpdates]);

  const getVenueArea = (venueName: string): string => {
    // Simple mapping based on venue names
    if (venueName.toLowerCase().includes('magali')) return 'Magaliesburg';
    if (venueName.toLowerCase().includes('mulder')) return 'Muldersdrift';
    if (venueName.toLowerCase().includes('pretoria')) return 'Pretoria';
    if (venueName.toLowerCase().includes('centurion')) return 'Centurion';
    return 'Gauteng';
  };

  const getVenuePriceRange = (venueName: string): string => {
    // Simulate price ranges
    const ranges = ['$120-200', '$180-300', '$90-160', '$200-400'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-bantu-orange" />
            Musika Market Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  {getTrendIcon(insight.trend)}
                </div>
                <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                <div className={`text-sm font-medium ${getTrendColor(insight.trend)}`}>
                  {insight.trend === 'up' ? '+' : insight.trend === 'down' ? '-' : ''}
                  {insight.percentage.toFixed(0)}% {insight.timeframe}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Venues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trending Venues
            </CardTitle>
            <Badge variant="secondary">{totalRequests} requests this week</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {venueActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity data available</p>
            </div>
          ) : (
            venueActivities.map((venue, index) => (
              <div
                key={venue.venue_name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onNavigateToVenue?.(venue.venue_name)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{venue.venue_name}</h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{venue.area}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{venue.recent_requests} requests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{venue.price_range}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Trending Score</span>
                      <span>{venue.trending_score}%</span>
                    </div>
                    <Progress value={venue.trending_score} className="h-1" />
                  </div>
                </div>
                
                <div className="ml-4 flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(venue.last_activity).toLocaleDateString()}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => onNavigateToVenue?.('')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View All Venues on Musika
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigateToVenue?.('')}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Browse Venues
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Popular Dates
            </Button>
          </div>
          
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Pro Tip:</strong> Venues in Magaliesburg and Muldersdrift are seeing 
            increased demand for team building retreats this quarter.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusikaDashboardWidget;
