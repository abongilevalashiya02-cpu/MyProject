import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface QuotationSecurityOptions {
  requireAuth?: boolean;
  allowAnonymous?: boolean;
  sessionTimeout?: number; // in minutes
  csrfProtection?: boolean;
}

interface QuotationSecurityState {
  isAuthorized: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  csrfToken?: string;
}

/**
 * Security hook for quotation forms and operations
 * Provides authentication validation, session management, and CSRF protection
 */
export const useQuotationSecurity = (options: QuotationSecurityOptions = {}) => {
  const {
    requireAuth = true,
    allowAnonymous = false,
    sessionTimeout = 30,
    csrfProtection = true
  } = options;

  const { user, loading } = useAuth();
  const [securityState, setSecurityState] = useState<QuotationSecurityState>({
    isAuthorized: false,
    isLoading: true,
    sessionExpired: false,
    csrfToken: undefined
  });

  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Generate CSRF token
  useEffect(() => {
    if (csrfProtection && user) {
      const token = generateCSRFToken();
      setSecurityState(prev => ({ ...prev, csrfToken: token }));
    }
  }, [user, csrfProtection]);

  // Check authorization status
  useEffect(() => {
    const checkAuthorization = () => {
      if (loading) {
        setSecurityState(prev => ({ ...prev, isLoading: true }));
        return;
      }

      const isAuthorized = !requireAuth || !!user || allowAnonymous;
      const sessionValid = checkSessionValidity();

      setSecurityState(prev => ({
        ...prev,
        isAuthorized: isAuthorized && sessionValid,
        isLoading: false,
        sessionExpired: !sessionValid && !!user
      }));
    };

    checkAuthorization();
  }, [user, loading, requireAuth, allowAnonymous]);

  // Session timeout management
  useEffect(() => {
    if (!user || !sessionTimeout) return;

    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      const timeoutMs = sessionTimeout * 60 * 1000;

      if (timeSinceLastActivity > timeoutMs) {
        setSecurityState(prev => ({
          ...prev,
          sessionExpired: true,
          isAuthorized: false
        }));
        toast.warning('Your session has expired. Please sign in again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, sessionTimeout, lastActivity]);

  // Activity tracking
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  const generateCSRFToken = (): string => {
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  };

  const checkSessionValidity = (): boolean => {
    if (!user || !sessionTimeout) return true;
    
    const timeSinceLastActivity = Date.now() - lastActivity;
    const timeoutMs = sessionTimeout * 60 * 1000;
    
    return timeSinceLastActivity <= timeoutMs;
  };

  const validateCSRFToken = (token: string): boolean => {
    if (!csrfProtection) return true;
    return token === securityState.csrfToken;
  };

  const refreshSession = () => {
    setLastActivity(Date.now());
    setSecurityState(prev => ({
      ...prev,
      sessionExpired: false,
      isAuthorized: !requireAuth || !!user || allowAnonymous
    }));
  };

  const logSecurityEvent = (event: string, details?: any) => {
    console.log(`[QuotationSecurity] ${event}:`, {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      ...details
    });
  };

  return {
    ...securityState,
    validateCSRFToken,
    refreshSession,
    logSecurityEvent,
    updateActivity: () => setLastActivity(Date.now())
  };
};