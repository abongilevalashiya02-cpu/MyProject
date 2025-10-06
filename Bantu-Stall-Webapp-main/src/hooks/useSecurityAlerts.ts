import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  type: 'login_anomaly' | 'data_breach' | 'suspicious_pattern' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export function useSecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to real-time security alerts
    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events'
        },
        (payload) => {
          const event = payload.new;
          if (event.severity === 'high' || event.severity === 'critical') {
            const alert: SecurityAlert = {
              id: event.id,
              type: event.event_type as SecurityAlert['type'],
              severity: event.severity,
              message: `Security event detected: ${event.event_type}`,
              timestamp: event.created_at,
              acknowledged: false
            };

            setAlerts(prev => [alert, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show immediate toast for critical alerts
            if (event.severity === 'critical') {
              toast.error('Critical Security Alert', {
                description: alert.message,
                duration: 10000,
                action: {
                  label: 'View Details',
                  onClick: () => acknowledgeAlert(alert.id)
                }
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const acknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
    setUnreadCount(0);
  };

  const clearAcknowledgedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.acknowledged));
  };

  return {
    alerts,
    unreadCount,
    acknowledgeAlert,
    acknowledgeAllAlerts,
    clearAcknowledgedAlerts
  };
}