// Security utilities for production-ready features
import { supabase } from '@/integrations/supabase/client';

// Security Headers Configuration
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com; " +
    "frame-src 'self' https://www.youtube.com https://youtube.com; " +
    "media-src 'self' https://www.youtube.com https://youtube.com; " +
    "frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

// Rate limiting utilities
export const rateLimitConfig = {
  auth: { maxRequests: 5, windowMinutes: 15 }, // 5 attempts per 15 minutes
  api: { maxRequests: 100, windowMinutes: 60 }, // 100 requests per hour
  upload: { maxRequests: 10, windowMinutes: 60 }, // 10 uploads per hour
  contact: { maxRequests: 3, windowMinutes: 60 } // 3 contact forms per hour
};

// Check rate limit for current user/IP
export const checkRateLimit = async (endpoint: string, identifier?: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    const rateLimitId = identifier || user?.id || 'anonymous';
    
    const config = rateLimitConfig[endpoint as keyof typeof rateLimitConfig] || rateLimitConfig.api;
    
    const { data, error } = await supabase.rpc('check_rate_limit', {
      _identifier: rateLimitId,
      _endpoint: endpoint,
      _max_requests: config.maxRequests,
      _window_minutes: config.windowMinutes
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return false; // Fail closed - deny if we can't check
    }
    
    return data as boolean;
  } catch (error) {
    console.error('Rate limit error:', error);
    return false;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format (basic international format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'login'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains common words and is not secure');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Content Security Policy nonce generation
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Audit logging
export interface AuditLog {
  user_id?: string;
  action: string;
  resource: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
}

export const logAuditEvent = async (auditLog: AuditLog): Promise<void> => {
  try {
    // Use the security-monitor edge function for now until audit_logs table is available
    const { error } = await supabase.functions.invoke('security-monitor', {
      body: {
        type: 'audit_log',
        data: {
          ...auditLog,
          timestamp: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

// Session validation
export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }
    
    // Check if session is still valid (not expired)
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// File upload validation
export const validateFileUpload = (file: File, allowedTypes: string[], maxSizeMB: number = 10): {
  isValid: boolean;
  error?: string;
} => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds limit of ${maxSizeMB}MB`
    };
  }
  
  return { isValid: true };
};