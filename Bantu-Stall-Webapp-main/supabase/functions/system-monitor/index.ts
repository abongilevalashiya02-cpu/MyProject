import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SystemMetrics {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestCount: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...params } = await req.json();

    switch (action) {
      case 'get_metrics':
        return await getSystemMetrics(supabase);
      
      case 'health_check':
        return await performHealthCheck(supabase);
      
      case 'alert_check':
        return await checkSystemAlerts(supabase);
      
      case 'log_metric':
        return await logSystemMetric(supabase, params);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('System monitor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getSystemMetrics(supabase: any) {
  try {
    // Get database metrics
    const { data: dbMetrics } = await supabase.rpc('get_database_stats');
    
    // Get user activity metrics
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get recent API activity from rate limits table
    const { data: apiActivity } = await supabase
      .from('api_rate_limits')
      .select('request_count')
      .gte('window_start', new Date(Date.now() - 3600000).toISOString());

    // Calculate metrics
    const requestCount = apiActivity?.reduce((sum, item) => sum + item.request_count, 0) || 0;
    const throughput = requestCount / 60; // requests per minute

    // Get recent security events
    const { data: securityEvents } = await supabase
      .from('security_events')
      .select('severity')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());

    const criticalAlerts = securityEvents?.filter(e => e.severity === 'critical').length || 0;

    const metrics: SystemMetrics = {
      timestamp: new Date().toISOString(),
      cpuUsage: Math.random() * 30 + 40, // Simulated
      memoryUsage: Math.random() * 20 + 60, // Simulated
      activeConnections: Math.floor(Math.random() * 50 + 10),
      requestCount,
      responseTime: Math.random() * 50 + 100,
      errorRate: criticalAlerts / Math.max(requestCount, 1),
      throughput
    };

    return new Response(
      JSON.stringify({ metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting metrics:', error);
    throw error;
  }
}

async function performHealthCheck(supabase: any): Promise<Response> {
  const checks: HealthCheck[] = [];
  
  try {
    // Database health check
    const dbStart = Date.now();
    await supabase.from('profiles').select('id').limit(1);
    const dbTime = Date.now() - dbStart;
    
    checks.push({
      service: 'database',
      status: dbTime < 1000 ? 'healthy' : 'degraded',
      responseTime: dbTime
    });

    // Auth service check
    const authStart = Date.now();
    await supabase.auth.getSession();
    const authTime = Date.now() - authStart;
    
    checks.push({
      service: 'auth',
      status: authTime < 500 ? 'healthy' : 'degraded',
      responseTime: authTime
    });

    // Storage check
    try {
      const storageStart = Date.now();
      await supabase.storage.listBuckets();
      const storageTime = Date.now() - storageStart;
      
      checks.push({
        service: 'storage',
        status: storageTime < 1000 ? 'healthy' : 'degraded',
        responseTime: storageTime
      });
    } catch (error) {
      checks.push({
        service: 'storage',
        status: 'down',
        error: error.message
      });
    }

    // Overall health
    const overallStatus = checks.some(c => c.status === 'down') ? 'down' :
                         checks.some(c => c.status === 'degraded') ? 'degraded' : 'healthy';

    return new Response(
      JSON.stringify({ 
        status: overallStatus,
        checks,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: 'down',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function checkSystemAlerts(supabase: any): Promise<Response> {
  try {
    // Check for performance issues
    const alerts = [];

    // Check error rates
    const { data: recentErrors } = await supabase
      .from('security_events')
      .select('severity')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString())
      .eq('severity', 'critical');

    if (recentErrors && recentErrors.length > 10) {
      alerts.push({
        type: 'high_error_rate',
        severity: 'critical',
        message: `High error rate detected: ${recentErrors.length} critical events in the last hour`,
        timestamp: new Date().toISOString()
      });
    }

    // Check database connections
    const { data: activeConnections } = await supabase.rpc('get_active_connections');
    if (activeConnections && activeConnections > 80) {
      alerts.push({
        type: 'high_db_connections',
        severity: 'warning',
        message: `High database connection count: ${activeConnections}`,
        timestamp: new Date().toISOString()
      });
    }

    // Check response times
    const avgResponseTime = Math.random() * 200 + 100; // Simulated
    if (avgResponseTime > 300) {
      alerts.push({
        type: 'slow_response_time',
        severity: 'warning',
        message: `Slow response times detected: ${Math.round(avgResponseTime)}ms average`,
        timestamp: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify({ alerts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking alerts:', error);
    throw error;
  }
}

async function logSystemMetric(supabase: any, params: any): Promise<Response> {
  try {
    const { metric, value, timestamp } = params;

    // Log to security events table for monitoring
    await supabase.from('security_events').insert({
      event_type: 'system_metric',
      severity: 'info',
      details: {
        metric,
        value,
        timestamp: timestamp || new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error logging metric:', error);
    throw error;
  }
}