import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Ban, Activity, TrendingUp, Eye } from 'lucide-react';

interface SecurityEvent {
  id: string;
  form_type: string;
  identifier: string;
  event_type: string;
  severity: 'info' | 'warning' | 'critical';
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface SecurityStats {
  totalSubmissions: number;
  blockedAttempts: number;
  suspiciousActivities: number;
  uniqueIdentifiers: number;
  topFormTypes: Array<{ form_type: string; count: number }>;
}

const SecurityMonitoringDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    fetchSecurityData();
  }, [timeRange]);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const timeRangeHours = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720
      }[timeRange];

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('form_security_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) {
        console.error('Error fetching security events:', eventsError);
      } else {
        setEvents((eventsData || []) as SecurityEvent[]);
      }

      // Calculate statistics
      if (eventsData) {
        const totalSubmissions = eventsData.filter(e => e.event_type === 'submission_allowed').length;
        const blockedAttempts = eventsData.filter(e => e.event_type === 'blocked' || e.event_type === 'rate_limit_exceeded').length;
        const suspiciousActivities = eventsData.filter(e => e.event_type === 'suspicious_activity').length;
        const uniqueIdentifiers = new Set(eventsData.map(e => e.identifier)).size;

        const formTypeCounts = eventsData.reduce((acc, event) => {
          acc[event.form_type] = (acc[event.form_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topFormTypes = Object.entries(formTypeCounts)
          .map(([form_type, count]) => ({ form_type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalSubmissions,
          blockedAttempts,
          suspiciousActivities,
          uniqueIdentifiers,
          topFormTypes
        });
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'blocked':
      case 'rate_limit_exceeded':
        return <Ban className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      case 'submission_allowed':
        return <Activity className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Security Monitoring</h1>
        </div>
        
        <div className="flex gap-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
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

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Total Submissions</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.totalSubmissions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Blocked Attempts</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.blockedAttempts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Suspicious Activities</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.suspiciousActivities}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Unique Visitors</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.uniqueIdentifiers}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Security Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No security events in the selected time range.
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <span className="text-sm font-medium">{event.form_type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.event_type.replace(/_/g, ' ')} - {event.identifier.slice(0, 20)}...
                      </p>
                      {event.details && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(event.details).slice(0, 100)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Form Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topFormTypes.map((formType) => (
                <div key={formType.form_type} className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">
                    {formType.form_type.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="secondary">{formType.count}</Badge>
                </div>
              ))}
              {(!stats?.topFormTypes || stats.topFormTypes.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  No activity data available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={fetchSecurityData} variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default SecurityMonitoringDashboard;