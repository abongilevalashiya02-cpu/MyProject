import { useState, useCallback } from 'react';
import { authLogger } from '@/utils/logger';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

interface RetryState {
  isRetrying: boolean;
  attempts: number;
  canRetry: boolean;
}

export function useRetry(options: UseRetryOptions = {}) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attempts: 0,
    canRetry: true
  });

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    customMaxAttempts?: number
  ): Promise<T> => {
    const maxRetries = customMaxAttempts || maxAttempts;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setRetryState({
          isRetrying: attempt > 1,
          attempts: attempt,
          canRetry: attempt < maxRetries
        });

        const result = await operation();
        
        // Success - reset state
        setRetryState({
          isRetrying: false,
          attempts: 0,
          canRetry: true
        });
        
        return result;
      } catch (error) {
        lastError = error as Error;
        authLogger.warn(`Operation failed on attempt ${attempt}/${maxRetries}`, error);
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (
            errorMessage.includes('invalid credentials') ||
            errorMessage.includes('already exists') ||
            errorMessage.includes('not found') ||
            errorMessage.includes('unauthorized') ||
            errorMessage.includes('rate limit')
          ) {
            authLogger.info('Non-retryable error detected, stopping retry attempts');
            break;
          }
        }
        
        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
          authLogger.info(`Waiting ${waitTime}ms before retry attempt ${attempt + 1}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    // All attempts failed
    setRetryState({
      isRetrying: false,
      attempts: maxRetries,
      canRetry: false
    });
    
    throw lastError!;
  }, [maxAttempts, delay, backoff]);

  const reset = useCallback(() => {
    setRetryState({
      isRetrying: false,
      attempts: 0,
      canRetry: true
    });
  }, []);

  return {
    retry,
    reset,
    ...retryState
  };
}