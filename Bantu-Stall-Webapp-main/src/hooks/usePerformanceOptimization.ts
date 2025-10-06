import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { performanceTracker } from '@/utils/logger';

// Debounced callback hook for form inputs
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Throttled callback hook for performance-sensitive operations
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const lastCallRef = useRef<number>(0);
  
  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay, ...deps]) as T;

  return throttledCallback;
};

// Memoized form validation
export const useMemoizedValidation = <T>(
  validationFn: (values: T) => boolean,
  values: T
): boolean => {
  return useMemo(() => {
    const startTime = 'form-validation-start';
    performanceTracker.mark(startTime);
    
    const result = validationFn(values);
    
    const endTime = 'form-validation-end';
    performanceTracker.mark(endTime);
    performanceTracker.measure('Form Validation Duration', startTime, endTime);
    
    return result;
  }, [validationFn, values]);
};

// Optimized event handlers to prevent re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
};

// Performance monitoring for component renders
export const useRenderPerformance = (componentName: string): void => {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number>();
  
  useEffect(() => {
    renderCountRef.current += 1;
    
    if (!mountTimeRef.current) {
      mountTimeRef.current = performance.now();
      performanceTracker.mark(`${componentName}-mount-start`);
    }
    
    if (renderCountRef.current === 1) {
      performanceTracker.mark(`${componentName}-mount-end`);
      performanceTracker.measure(
        `${componentName} Mount Duration`,
        `${componentName}-mount-start`,
        `${componentName}-mount-end`
      );
    }
  });
  
  useEffect(() => {
    return () => {
      performanceTracker.mark(`${componentName}-unmount`);
    };
  }, [componentName]);
};

// Optimized form state management
export const useOptimizedFormState = <T extends Record<string, any>>(
  initialState: T
): [T, (field: keyof T, value: T[keyof T]) => void, () => void] => {
  const stateRef = useRef<T>(initialState);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    stateRef.current = {
      ...stateRef.current,
      [field]: value
    };
    setUpdateCounter(prev => prev + 1);
  }, []);
  
  const resetForm = useCallback(() => {
    stateRef.current = initialState;
    setUpdateCounter(prev => prev + 1);
  }, [initialState]);
  
  return [stateRef.current, updateField, resetForm];
};

// Lazy loading for heavy components
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const loadComponent = useCallback(async () => {
    if (Component || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { default: LoadedComponent } = await importFn();
      setComponent(() => LoadedComponent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setIsLoading(false);
    }
  }, [Component, isLoading, importFn]);
  
  return {
    Component: Component || fallback,
    isLoading,
    error,
    loadComponent
  };
};

export default {
  useDebouncedCallback,
  useThrottledCallback,
  useMemoizedValidation,
  useStableCallback,
  useRenderPerformance,
  useOptimizedFormState,
  useLazyComponent
};