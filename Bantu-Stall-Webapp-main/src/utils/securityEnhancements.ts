import { sanitizeInput } from './security';

// SQL Injection Detection
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /('|(\\')|(;)|(\-\-)|(\|\|))/,
    /(\bOR\b|\bAND\b).*(\b=\b)/i,
    /(CHAR|ASCII|SUBSTRING|LENGTH|USER|DATABASE|VERSION)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// XSS Detection (enhanced)
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe|<object|<embed|<link|<meta/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Enhanced input sanitization with threat detection
export const sanitizeAndValidate = (input: string, options: {
  maxLength?: number;
  allowHTML?: boolean;
  strictMode?: boolean;
} = {}): {
  sanitized: string;
  threats: string[];
  isValid: boolean;
} => {
  const threats: string[] = [];
  let sanitized = input;

  // Check length
  if (options.maxLength && input.length > options.maxLength) {
    threats.push('Input exceeds maximum length');
    sanitized = sanitized.substring(0, options.maxLength);
  }

  // Detect threats
  if (detectSQLInjection(input)) {
    threats.push('Potential SQL injection detected');
  }

  if (detectXSS(input)) {
    threats.push('Potential XSS attack detected');
  }

  // Sanitize based on options
  if (!options.allowHTML) {
    sanitized = sanitizeInput(sanitized);
  }

  if (options.strictMode) {
    // In strict mode, only allow alphanumeric and basic punctuation
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s\.,!?@\-_]/g, '');
  }

  return {
    sanitized,
    threats,
    isValid: threats.length === 0
  };
};

// Generate secure CSRF token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// CSRF Token Management
class CSRFTokenManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes

  getToken(): string {
    const now = Date.now();
    
    if (!this.token || now > this.tokenExpiry) {
      this.token = generateCSRFToken();
      this.tokenExpiry = now + this.TOKEN_LIFETIME;
      
      // Store in sessionStorage for consistency across tabs
      sessionStorage.setItem('csrf_token', this.token);
      sessionStorage.setItem('csrf_expiry', this.tokenExpiry.toString());
    }
    
    return this.token;
  }

  validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    const expiry = parseInt(sessionStorage.getItem('csrf_expiry') || '0');
    
    return storedToken === token && Date.now() < expiry;
  }

  refreshToken(): string {
    this.token = null;
    return this.getToken();
  }
}

export const csrfTokenManager = new CSRFTokenManager();

// Secure Error Handler - doesn't leak sensitive information
export const createSecureError = (error: any, context?: string): {
  message: string;
  code?: string;
  context?: string;
} => {
  // Log full error for debugging (server-side only in production)
  if (import.meta.env.DEV) {
    console.error('Full error details:', error, { context });
  }

  // Generic error messages for production
  const secureMessages: Record<string, string> = {
    'auth': 'Authentication failed. Please try again.',
    'network': 'Network error. Please check your connection.',
    'validation': 'Invalid input provided.',
    'permission': 'Access denied.',
    'rate_limit': 'Too many requests. Please try again later.',
    'server': 'Server error. Please try again later.'
  };

  // Determine error type
  let errorType = 'server';
  if (error?.message?.includes('auth') || error?.status === 401) {
    errorType = 'auth';
  } else if (error?.message?.includes('network') || !navigator.onLine) {
    errorType = 'network';
  } else if (error?.status === 400) {
    errorType = 'validation';
  } else if (error?.status === 403) {
    errorType = 'permission';
  } else if (error?.status === 429) {
    errorType = 'rate_limit';
  }

  return {
    message: secureMessages[errorType],
    code: error?.code || 'UNKNOWN_ERROR',
    context
  };
};

// Progressive delay for brute force protection
export class BruteForceProtection {
  private attempts: Map<string, { count: number; lastAttempt: number; delay: number }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BASE_DELAY = 1000; // 1 second
  private readonly MAX_DELAY = 300000; // 5 minutes

  async checkAttempt(identifier: string): Promise<{ allowed: boolean; delay: number }> {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, delay: 0 });
      return { allowed: true, delay: 0 };
    }

    // Reset if enough time has passed
    if (now - record.lastAttempt > this.MAX_DELAY) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, delay: 0 });
      return { allowed: true, delay: 0 };
    }

    // Check if still in delay period
    if (now - record.lastAttempt < record.delay) {
      return { allowed: false, delay: record.delay - (now - record.lastAttempt) };
    }

    // Increment attempts and calculate new delay
    const newCount = record.count + 1;
    const newDelay = newCount > this.MAX_ATTEMPTS ? 
      Math.min(this.BASE_DELAY * Math.pow(2, newCount - this.MAX_ATTEMPTS), this.MAX_DELAY) : 0;

    this.attempts.set(identifier, {
      count: newCount,
      lastAttempt: now,
      delay: newDelay
    });

    return { allowed: newDelay === 0, delay: newDelay };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const bruteForceProtection = new BruteForceProtection();