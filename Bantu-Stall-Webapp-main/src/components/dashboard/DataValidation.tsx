import React from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Validation schemas
export const QuotationRequestSchema = z.object({
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  attendee_count: z.number().min(1, 'Attendee count must be at least 1').max(10000, 'Maximum 10,000 attendees'),
  budget_range: z.string().min(1, 'Budget range is required'),
  preferred_dates: z.string().min(1, 'Preferred dates are required'),
  location_preference: z.string().min(1, 'Location preference is required'),
  event_objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  desired_outcomes: z.array(z.string()).min(1, 'At least one desired outcome is required'),
  special_requirements: z.string().optional(),
  venue_preferences: z.string().optional(),
  catering_requirements: z.string().optional(),
  transportation_needs: z.string().optional(),
  accommodation_type: z.string().optional(),
  selected_services: z.array(z.string()).optional()
});

export const UserProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export const ClientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  vat_id: z.string().optional()
});

// Validation utilities
export const validateData = <T,>(schema: z.ZodSchema<T>, data: unknown): { isValid: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Validation failed'] };
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Form validation hooks
export const useFormValidation = <T,>(schema: z.ZodSchema<T>) => {
  const validateForm = (data: unknown) => {
    const result = validateData(schema, data);
    
    if (!result.isValid && result.errors) {
      result.errors.forEach(error => {
        toast.error(error);
      });
    }
    
    return result;
  };

  const validateField = (fieldName: string, value: unknown) => {
    try {
      // Type assertion for schema with shape property
      const schemaWithShape = schema as any;
      const fieldSchema = schemaWithShape.shape?.[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        return { isValid: true };
      }
      return { isValid: false, error: 'Field not found in schema' };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message };
      }
      return { isValid: false, error: 'Validation failed' };
    }
  };

  return { validateForm, validateField };
};

// Real-time validation for forms  
export const useRealTimeValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  data: T,
  debounceMs = 300
) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const result = schema.safeParse(data);
      
      if (result.success) {
        setErrors({});
        setIsValid(true);
      } else {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach(error => {
          if (error.path.length > 0) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setIsValid(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [data, schema, debounceMs]);

  return { errors, isValid };
};

// Security validation
export const validateSecurityConstraints = (data: any): { isSecure: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Check for potential XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  const checkValue = (value: any, path: string = '') => {
    if (typeof value === 'string') {
      xssPatterns.forEach(pattern => {
        if (pattern.test(value)) {
          warnings.push(`Potential XSS detected in ${path || 'input'}`);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        checkValue(val, path ? `${path}.${key}` : key);
      });
    }
  };

  checkValue(data);

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
    /(\b(UNION|JOIN)\b)/i,
    /(--|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
  ];

  const checkForSql = (value: any) => {
    if (typeof value === 'string') {
      sqlPatterns.forEach(pattern => {
        if (pattern.test(value)) {
          warnings.push('Potential SQL injection pattern detected');
        }
      });
    }
  };

  checkValue(data);

  return {
    isSecure: warnings.length === 0,
    warnings
  };
};

// Rate limiting validation
export const validateRateLimit = (
  userId: string,
  action: string,
  maxRequests = 10,
  windowMs = 60000 // 1 minute
): boolean => {
  const key = `rate_limit_${userId}_${action}`;
  const now = Date.now();
  
  const stored = localStorage.getItem(key);
  const requests = stored ? JSON.parse(stored) : [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp: number) => 
    now - timestamp < windowMs
  );
  
  if (validRequests.length >= maxRequests) {
    toast.error('Too many requests. Please wait before trying again.');
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  localStorage.setItem(key, JSON.stringify(validRequests));
  
  return true;
};

// Data export validation and formatting
export const validateExportData = (data: any[]): { isValid: boolean; formattedData?: any[]; errors?: string[] } => {
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data must be an array'] };
  }

  if (data.length === 0) {
    return { isValid: false, errors: ['No data to export'] };
  }

  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  
  const formattedData = data.map(item => {
    const sanitized: any = {};
    
    Object.entries(item).forEach(([key, value]) => {
      // Skip sensitive fields
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        return;
      }
      
      // Format dates
      if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
        sanitized[key] = new Date(value).toLocaleString();
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  });

  return { isValid: true, formattedData };
};
