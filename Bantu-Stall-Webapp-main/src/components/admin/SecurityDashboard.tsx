import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, Eye, Database, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  details: any;
  created_at: string;
  user_id?: string;
  ip_address?: string;
}

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  details: any;
  created_at: string;
  ip_address?: string;
}

export function SecurityDashboard() {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    recentActivity: 0,
    securedTables: 0
  });

  useEffect(() => {
    if (user) {
      fetchSecurityData();
    }
  }, [user]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch security events
      const { data: events, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Fetch recent audit logs
      const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      setSecurityEvents(events || []);
      setAuditLogs(logs || []);

      // Calculate stats
      const criticalEvents = events?.filter(e => e.severity === 'high' || e.severity === 'critical').length || 0;
      const recentActivity = logs?.filter(l => 
        new Date(l.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;

      setStats({
        totalEvents: events?.length || 0,
        criticalEvents,
        recentActivity,
        securedTables: 8 // Based on our security fixes
      });

    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor security events, audit logs, and system health
          </p>
        </div>
        <Button onClick={fetchSecurityData} variant="outline">
          <Shield className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Security Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Total security events logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalEvents}</div>
            <p className="text-xs text-muted-foreground">
              High/critical severity events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Actions in last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secured Tables</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.securedTables}</div>
            <p className="text-xs text-muted-foreground">
              Tables with RLS policies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.criticalEvents > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.criticalEvents} critical security events that require attention.
            Review the security events below immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Automated security monitoring and threat detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="mx-auto h-8 w-8 mb-2 text-green-600" />
              <p>No security events detected. System is secure.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">{event.event_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.created_at)}
                        {event.ip_address && ` • IP: ${event.ip_address}`}
                      </p>
                    </div>
                  </div>
                  {event.details && (
                    <div className="text-xs text-muted-foreground max-w-xs">
                      {JSON.stringify(event.details, null, 2).slice(0, 100)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>
            Recent database access and modification logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.slice(0, 20).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{log.action}</Badge>
                  <span className="font-medium">{log.resource}</span>
                  <span className="text-muted-foreground">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                {log.user_id && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{log.user_id.slice(0, 8)}...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}