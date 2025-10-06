import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export function useSessionTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Show warning 5 minutes before timeout
    warningRef.current = setTimeout(() => {
      toast.warning('Session Expiring', {
        description: 'Your session will expire in 5 minutes. Activity will extend it.',
        duration: 10000,
        action: {
          label: 'Stay Logged In',
          onClick: () => resetTimeout()
        }
      });
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Auto logout after timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await supabase.auth.signOut();
        toast.error('Session Expired', {
          description: 'You have been logged out due to inactivity.'
        });
      } catch (error) {
        console.error('Auto logout failed:', error);
      }
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeoutHandler = () => resetTimeout();
    
    // Set initial timeout
    resetTimeout();
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
    };
  }, []);

  return { resetTimeout };
}