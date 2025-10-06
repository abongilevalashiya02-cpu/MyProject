import { useState, useEffect, useCallback } from 'react';
import { authLogger } from '@/utils/logger';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  lastChecked: Date | null;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    lastChecked: null
  });

  const checkConnectionSpeed = useCallback(async (): Promise<boolean> => {
    try {
      const startTime = performance.now();
      
      // Use a small image to test connection speed
      const testUrl = 'https://httpbin.org/bytes/1024'; // 1KB test
      
      const response = await fetch(testUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Consider connection slow if it takes more than 3 seconds for 1KB
      const isSlowConnection = duration > 3000;
      
      authLogger.debug('Connection speed test', { 
        duration, 
        isSlowConnection,
        bytesPerSecond: 1024 / (duration / 1000)
      });
      
      return isSlowConnection;
    } catch (error) {
      authLogger.warn('Could not test connection speed', error);
      return false; // Assume normal speed if we can't test
    }
  }, []);

  const updateNetworkStatus = useCallback(async () => {
    const isOnline = navigator.onLine;
    let connectionType = 'unknown';
    let isSlowConnection = false;

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connectionType = connection?.effectiveType || connection?.type || 'unknown';
      
      // Consider 2G or slow-2g as slow connections
      isSlowConnection = ['slow-2g', '2g'].includes(connection?.effectiveType);
    }

    // If online and we couldn't determine speed from navigator, test it
    if (isOnline && !isSlowConnection && connectionType === 'unknown') {
      isSlowConnection = await checkConnectionSpeed();
    }

    setNetworkStatus({
      isOnline,
      isSlowConnection,
      connectionType,
      lastChecked: new Date()
    });

    authLogger.debug('Network status updated', {
      isOnline,
      isSlowConnection,
      connectionType
    });
  }, [checkConnectionSpeed]);

  useEffect(() => {
    // Initial check
    updateNetworkStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      authLogger.info('Connection restored');
      updateNetworkStatus();
    };

    const handleOffline = () => {
      authLogger.warn('Connection lost');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: new Date()
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check every 30 seconds
    const interval = setInterval(updateNetworkStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [updateNetworkStatus]);

  const forceCheck = useCallback(() => {
    updateNetworkStatus();
  }, [updateNetworkStatus]);

  return {
    ...networkStatus,
    forceCheck
  };
}