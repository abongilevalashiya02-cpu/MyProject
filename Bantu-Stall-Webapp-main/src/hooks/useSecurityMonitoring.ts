import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityMetrics {
  failedLoginAttempts: number;
  suspiciousActivity: number;
  dataAccessAlerts: number;
  lastSecurityScan: string | null;
}

export function useSecurityMonitoring() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLoginAttempts: 0,
    suspiciousActivity: 0,
    dataAccessAlerts: 0,
    lastSecurityScan: null
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    startSecurityMonitoring();
    return () => stopSecurityMonitoring();
  }, []);

  const startSecurityMonitoring = () => {
    setIsMonitoring(true);
    // Monitor security events in real-time
    const securityEventsSubscription = supabase
      .channel('security-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events'
        },
        (payload) => {
          handleSecurityEvent(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          handleAuditEvent(payload.new);
        }
      )
      .subscribe();

    // Periodic security health check
    const healthCheckInterval = setInterval(() => {
      performSecurityHealthCheck();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      securityEventsSubscription.unsubscribe();
      clearInterval(healthCheckInterval);
    };
  };

  const stopSecurityMonitoring = () => {
    setIsMonitoring(false);
  };

  const handleSecurityEvent = (event: any) => {
    console.log('Security event detected:', event);
    
    // Handle different types of security events
    switch (event.event_type) {
      case 'failed_login':
        setMetrics(prev => ({
          ...prev,
          failedLoginAttempts: prev.failedLoginAttempts + 1
        }));
        break;
      case 'suspicious_activity':
      case 'rapid_data_access':
        setMetrics(prev => ({
          ...prev,
          suspiciousActivity: prev.suspiciousActivity + 1
        }));
        // Show immediate alert for high-severity events
        if (event.severity === 'high' || event.severity === 'critical') {
          toast.error('Security Alert: Suspicious activity detected', {
            description: `Event: ${event.event_type}`,
            duration: 10000
          });
        }
        break;
      case 'unauthorized_access':
        setMetrics(prev => ({
          ...prev,
          dataAccessAlerts: prev.dataAccessAlerts + 1
        }));
        toast.error('Security Alert: Unauthorized access attempt', {
          description: 'Please review your security logs immediately',
          duration: 10000
        });
        break;
    }
  };

  const handleAuditEvent = (auditLog: any) => {
    // Check for suspicious patterns in audit logs
    if (auditLog.action === 'SELECT' && auditLog.resource.includes('sensitive')) {
      // This would trigger additional monitoring
      console.log('Sensitive data access logged:', auditLog);
    }
  };

  const performSecurityHealthCheck = async () => {
    try {
      // Check for recent security events
      const { data: recentEvents, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Security health check failed:', error);
        return;
      }

      const criticalEvents = recentEvents?.filter(
        event => event.severity === 'high' || event.severity === 'critical'
      ).length || 0;

      if (criticalEvents > 5) {
        toast.warning('Security Health Check', {
          description: `${criticalEvents} critical security events in the last 24 hours`,
          duration: 8000
        });
      }

      setMetrics(prev => ({
        ...prev,
        lastSecurityScan: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Error performing security health check:', error);
    }
  };

  const logSecurityEvent = async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any
  ) => {
    try {
      const { error } = await supabase
        .from('security_events')
        .insert({
          event_type: eventType,
          severity,
          details,
          ip_address: null // Will be populated by server if available
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  const resetMetrics = () => {
    setMetrics({
      failedLoginAttempts: 0,
      suspiciousActivity: 0,
      dataAccessAlerts: 0,
      lastSecurityScan: null
    });
  };

  return {
    metrics,
    isMonitoring,
    logSecurityEvent,
    resetMetrics,
    performSecurityHealthCheck
  };
}