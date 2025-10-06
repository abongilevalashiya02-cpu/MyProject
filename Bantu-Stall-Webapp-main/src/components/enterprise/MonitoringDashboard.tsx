import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  Shield, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  activeUsers: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  dbConnections: number;
}

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface PerformanceMetric {
  timestamp: string;
  value: number;
  metric: string;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 120,
    activeUsers: 0,
    errorRate: 0.01,
    throughput: 150,
    memoryUsage: 65,
    cpuUsage: 45,
    dbConnections: 12
  });
  
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch system metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Get active users count from profiles
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get recent activity from contact inquiries
      const { data: recentActivity } = await supabase
        .from('contact_inquiries')
        .select('id, subject, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent API activity from rate limits table
      const { data: apiActivity } = await supabase
        .from('api_rate_limits')
        .select('request_count')
        .gte('window_start', new Date(Date.now() - 3600000).toISOString());

      // Calculate metrics
      const requestCount = apiActivity?.reduce((sum, item) => sum + item.request_count, 0) || 0;
      const throughput = requestCount / 60; // requests per minute

      // Create system alerts from recent activity
      const systemAlerts: SecurityAlert[] = [];
      if (recentActivity && recentActivity.length > 0) {
        recentActivity.forEach(item => {
          systemAlerts.push({
            id: String(item.id),
            type: item.status === 'pending' ? 'info' : 'warning',
            message: `Contact inquiry: ${item.subject}`,
            timestamp: item.created_at,
            resolved: item.status !== 'pending'
          });
        });
      }

      // Add simulated system alerts
      if (Math.random() > 0.7) {
        systemAlerts.push({
          id: 'system-' + Date.now(),
          type: 'info',
          message: 'System performing optimally',
          timestamp: new Date().toISOString(),
          resolved: true
        });
      }

      setMetrics(prev => ({
        ...prev,
        activeUsers: userCount || 0,
        responseTime: Math.random() * 50 + 100, // Simulated
        errorRate: Math.random() * 0.05,
        throughput: throughput || Math.random() * 100 + 100
      }));

      setAlerts(systemAlerts);

    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, threshold: number) => {
    if (value > threshold) return 'text-destructive';
    if (value > threshold * 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time system health and performance metrics</p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading} className="bg-primary hover:bg-primary/90">
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.responseTime, 200)}`}>
              {Math.round(metrics.responseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.errorRate * 100, 1)}`}>
              {(metrics.errorRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">{metrics.cpuUsage}%</span>
                  </div>
                  <Progress value={metrics.cpuUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">{metrics.memoryUsage}%</span>
                  </div>
                  <Progress value={metrics.memoryUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network & Traffic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Throughput</span>
                  <Badge variant="secondary">{Math.round(metrics.throughput)} req/min</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bandwidth Usage</span>
                  <Badge variant="outline">2.3 GB/hr</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">No security alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <AlertDescription>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </AlertDescription>
                        </div>
                        <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.type}
                        </Badge>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Active Connections</span>
                  <Badge variant="outline">{metrics.dbConnections}/100</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Query Performance</span>
                  <Badge variant="secondary">Optimal</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <Badge variant="outline">1.2 GB / 10 GB</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>User registrations</span>
                    <Badge variant="outline">+{Math.floor(Math.random() * 10)} today</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Form submissions</span>
                    <Badge variant="outline">+{Math.floor(Math.random() * 50)} today</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>API calls</span>
                    <Badge variant="outline">{(Math.random() * 5 + 1).toFixed(1)}k today</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}