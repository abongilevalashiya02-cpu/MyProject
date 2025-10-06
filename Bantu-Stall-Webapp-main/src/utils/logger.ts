// Production-ready logging utility
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';  
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info', 
  DEBUG: 'debug'
};

// Only log errors in production, full logging in development
const isDevelopment = import.meta.env.DEV;

class Logger {
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${dataStr}`;
  }

  error(message: string, error?: any): void {
    // Always log errors in production and development
    const errorMessage = this.formatMessage(LOG_LEVELS.ERROR, message);
    console.error(errorMessage, error);
    
    // In production, also send to monitoring service (if configured)
    if (!isDevelopment && error) {
      this.sendToMonitoring('error', message, error);
    }
  }

  warn(message: string, data?: any): void {
    if (isDevelopment) {
      console.warn(this.formatMessage(LOG_LEVELS.WARN, message, data));
    }
  }

  info(message: string, data?: any): void {
    if (isDevelopment) {
      console.info(this.formatMessage(LOG_LEVELS.INFO, message, data));
    }
  }

  debug(message: string, data?: any): void {
    if (isDevelopment) {
      console.debug(this.formatMessage(LOG_LEVELS.DEBUG, message, data));
    }
  }

  // Placeholder for monitoring service integration
  private sendToMonitoring(level: string, message: string, error: any): void {
    // TODO: Integrate with monitoring service like Sentry, LogRocket, etc.
    // For now, this is a placeholder
  }
}

// Create logger instances for different modules
export const createLogger = (context: string): Logger => new Logger(context);

// Pre-configured loggers for common contexts
export const authLogger = createLogger('Auth');
export const apiLogger = createLogger('API');
export const uiLogger = createLogger('UI');
export const performanceLogger = createLogger('Performance');

// Performance tracking utilities
export const performanceTracker = {
  mark: (name: string): void => {
    if (isDevelopment && performance.mark) {
      performance.mark(name);
    }
  },

  measure: (name: string, startMark: string, endMark?: string): void => {
    if (isDevelopment && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        performanceLogger.debug(`Performance: ${name}`, {
          duration: `${measure.duration.toFixed(2)}ms`,
          startTime: measure.startTime
        });
      } catch (error) {
        performanceLogger.warn('Failed to measure performance', { name, startMark, endMark });
      }
    }
  }
};

export default Logger;