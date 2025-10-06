import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
  userAgent: string;
  url: string;
}

interface PerformanceThresholds {
  loadTime: number; // ms
  renderTime: number; // ms
  memoryUsage: number; // MB
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  loadTime: 3000, // 3 seconds
  renderTime: 100, // 100ms
  memoryUsage: 50 // 50MB
};

export const usePerformanceMonitor = (
  componentName: string,
  thresholds: Partial<PerformanceThresholds> = {}
) => {
  const startTimeRef = useRef<number>();
  const renderStartRef = useRef<number>();
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  const measureStart = useCallback(() => {
    startTimeRef.current = performance.now();
    renderStartRef.current = performance.now();
  }, []);

  const measureRender = useCallback(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      return renderTime;
    }
    return 0;
  }, []);

  const measureLoad = useCallback(() => {
    if (startTimeRef.current) {
      const loadTime = performance.now() - startTimeRef.current;
      return loadTime;
    }
    return 0;
  }, []);

  const getMemoryUsage = useCallback((): number | undefined => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return undefined;
  }, []);

  const logMetrics = useCallback(async (metrics: PerformanceMetrics) => {
    // Store locally first
    metricsRef.current.push(metrics);

    // Check thresholds and log warnings
    if (metrics.loadTime > finalThresholds.loadTime) {
      console.warn(`Slow load time detected in ${componentName}: ${metrics.loadTime.toFixed(2)}ms`);
    }
    
    if (metrics.renderTime > finalThresholds.renderTime) {
      console.warn(`Slow render time detected in ${componentName}: ${metrics.renderTime.toFixed(2)}ms`);
    }

    if (metrics.memoryUsage && metrics.memoryUsage > finalThresholds.memoryUsage) {
      console.warn(`High memory usage detected in ${componentName}: ${metrics.memoryUsage.toFixed(2)}MB`);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      try {
        await supabase.functions.invoke('performance-analytics', {
          body: {
            type: 'performance_metrics',
            data: metrics
          }
        });
      } catch (error) {
        console.error('Failed to log performance metrics:', error);
      }
    }
  }, [componentName, finalThresholds]);

  const recordMetrics = useCallback(() => {
    const loadTime = measureLoad();
    const renderTime = measureRender();
    const memoryUsage = getMemoryUsage();

    const metrics: PerformanceMetrics = {
      componentName,
      loadTime,
      renderTime,
      memoryUsage,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    logMetrics(metrics);
    return metrics;
  }, [componentName, measureLoad, measureRender, getMemoryUsage, logMetrics]);

  // Start measuring when component mounts
  useEffect(() => {
    measureStart();
  }, [measureStart]);

  // Web Vitals integration
  const measureWebVitals = useCallback(() => {
    if ('web-vitals' in window) {
      // This would integrate with web-vitals library if added
      // getCLS(console.log);
      // getFID(console.log);
      // getFCP(console.log);
      // getLCP(console.log);
      // getTTFB(console.log);
    }
  }, []);

  // Resource timing
  const getResourceMetrics = useCallback(() => {
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      return resources.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: (entry as any).transferSize,
        type: (entry as any).initiatorType
      }));
    }
    return [];
  }, []);

  // Navigation timing
  const getNavigationMetrics = useCallback(() => {
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: navigation.responseStart - navigation.fetchStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart
        };
      }
    }
    return null;
  }, []);

  // Performance observer for long tasks
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected in ${componentName}: ${entry.duration.toFixed(2)}ms`);
            logMetrics({
              componentName: `${componentName}_long_task`,
              loadTime: 0,
              renderTime: entry.duration,
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
              url: window.location.href
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        return () => observer.disconnect();
      } catch (e) {
        // Browser doesn't support longtask observation
        console.log('Long task observation not supported');
      }
    }
  }, [componentName, logMetrics]);

  return {
    measureStart,
    measureRender,
    measureLoad,
    recordMetrics,
    measureWebVitals,
    getResourceMetrics,
    getNavigationMetrics,
    getMetrics: () => metricsRef.current,
    clearMetrics: () => { metricsRef.current = []; }
  };
};

// Hook for tracking user interactions
export const useUserInteractionTracking = (componentName: string) => {
  const trackClick = useCallback(async (elementId: string, elementType: string) => {
    const interactionData = {
      component: componentName,
      action: 'click',
      elementId,
      elementType,
      timestamp: Date.now(),
      url: window.location.href
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        await supabase.functions.invoke('user-analytics', {
          body: {
            type: 'user_interaction',
            data: interactionData
          }
        });
      } catch (error) {
        console.error('Failed to track interaction:', error);
      }
    }
  }, [componentName]);

  const trackPageView = useCallback(async (pageName: string) => {
    const pageViewData = {
      component: componentName,
      action: 'page_view',
      pageName,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        await supabase.functions.invoke('user-analytics', {
          body: {
            type: 'page_view',
            data: pageViewData
          }
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    }
  }, [componentName]);

  const trackError = useCallback(async (errorMessage: string, errorStack?: string) => {
    const errorData = {
      component: componentName,
      action: 'error',
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        await supabase.functions.invoke('error-analytics', {
          body: {
            type: 'client_error',
            data: errorData
          }
        });
      } catch (error) {
        console.error('Failed to track error:', error);
      }
    }
  }, [componentName]);

  return {
    trackClick,
    trackPageView,
    trackError
  };
};