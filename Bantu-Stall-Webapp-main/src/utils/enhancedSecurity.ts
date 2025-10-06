import { sanitizeAndValidate, csrfTokenManager } from './securityEnhancements';

// Enhanced validation patterns
const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s\-'\.]{2,50}$/,
  passport: /^[A-Z0-9]{5,15}$/,
  postalCode: /^[A-Z0-9\s\-]{3,10}$/i,
  url: /^https?:\/\/[^\s]+$/,
  // Common suspicious patterns
  suspicious: /(?:script|javascript|vbscript|onload|onerror|eval|expression|document\.)/i,
  sqlInjection: /(?:union|select|insert|delete|update|drop|exec|script)/i,
  xss: /(?:<|>|&lt;|&gt;|javascript:|data:|vbscript:)/i
};

// Country codes for validation
const VALID_COUNTRY_CODES = [
  'US', 'CA', 'GB', 'AU', 'NZ', 'ZA', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH',
  'AT', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'SK', 'SI',
  'EE', 'LV', 'LT', 'MT', 'CY', 'LU', 'BG', 'RO', 'HR', 'JP', 'KR', 'SG', 'HK',
  'TW', 'MY', 'TH', 'PH', 'ID', 'VN', 'IN', 'CN', 'BR', 'MX', 'AR', 'CL', 'CO'
];

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
  securityThreats: string[];
}

export interface FormSecurityConfig {
  enableRateLimit: boolean;
  enableSuspiciousDetection: boolean;
  enableDataValidation: boolean;
  enableCaptcha: boolean;
  maxFieldLength: number;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
}

export const DEFAULT_SECURITY_CONFIG: FormSecurityConfig = {
  enableRateLimit: true,
  enableSuspiciousDetection: true,
  enableDataValidation: true,
  enableCaptcha: true,
  maxFieldLength: 1000,
  maxFileSize: 5
};

export class EnhancedFormValidator {
  private config: FormSecurityConfig;

  constructor(config: Partial<FormSecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  validateField(fieldName: string, value: string, fieldType?: string): ValidationResult {
    const errors: string[] = [];
    const securityThreats: string[] = [];

    // Basic sanitization
    const sanitizeResult = sanitizeAndValidate(value, {
      maxLength: this.config.maxFieldLength,
      allowHTML: false,
      strictMode: true
    });

    let sanitizedValue = sanitizeResult.sanitized;
    securityThreats.push(...sanitizeResult.threats);

    // Type-specific validation
    if (fieldType && value.trim()) {
      switch (fieldType) {
        case 'email':
          if (!VALIDATION_PATTERNS.email.test(value)) {
            errors.push('Invalid email format');
          }
          break;
        case 'phone':
          if (!VALIDATION_PATTERNS.phone.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errors.push('Invalid phone number format');
          }
          break;
        case 'name':
          if (!VALIDATION_PATTERNS.name.test(value)) {
            errors.push('Name contains invalid characters');
          }
          break;
        case 'passport':
          if (!VALIDATION_PATTERNS.passport.test(value.replace(/\s/g, ''))) {
            errors.push('Invalid passport number format');
          }
          break;
        case 'country':
          if (!VALID_COUNTRY_CODES.includes(value.toUpperCase())) {
            errors.push('Invalid country code');
          }
          break;
        case 'url':
          if (!VALIDATION_PATTERNS.url.test(value)) {
            errors.push('Invalid URL format');
          }
          break;
        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push('Invalid date format');
          }
          break;
      }
    }

    // Check for suspicious patterns
    if (VALIDATION_PATTERNS.suspicious.test(value)) {
      securityThreats.push('suspicious_content');
    }

    if (VALIDATION_PATTERNS.sqlInjection.test(value)) {
      securityThreats.push('sql_injection_attempt');
    }

    if (VALIDATION_PATTERNS.xss.test(value)) {
      securityThreats.push('xss_attempt');
    }

    // Check for common spam patterns
    if (this.isSpamContent(value)) {
      securityThreats.push('spam_content');
    }

    return {
      isValid: errors.length === 0 && securityThreats.length === 0,
      sanitizedValue,
      errors,
      securityThreats
    };
  }

  validateForm(formData: Record<string, any>, fieldTypes?: Record<string, string>): {
    isValid: boolean;
    sanitizedData: Record<string, any>;
    fieldErrors: Record<string, string[]>;
    securityIssues: string[];
  } {
    const sanitizedData: Record<string, any> = {};
    const fieldErrors: Record<string, string[]> = {};
    const allSecurityThreats: string[] = [];

    Object.entries(formData).forEach(([fieldName, value]) => {
      if (typeof value === 'string') {
        const fieldType = fieldTypes?.[fieldName];
        const result = this.validateField(fieldName, value, fieldType);

        sanitizedData[fieldName] = result.sanitizedValue;

        if (result.errors.length > 0) {
          fieldErrors[fieldName] = result.errors;
        }

        allSecurityThreats.push(...result.securityThreats);
      } else {
        sanitizedData[fieldName] = value;
      }
    });

    return {
      isValid: Object.keys(fieldErrors).length === 0 && allSecurityThreats.length === 0,
      sanitizedData,
      fieldErrors,
      securityIssues: [...new Set(allSecurityThreats)]
    };
  }

  validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];
    const securityThreats: string[] = [];

    // Check file size
    if (this.config.maxFileSize && file.size > this.config.maxFileSize * 1024 * 1024) {
      errors.push(`File size exceeds ${this.config.maxFileSize}MB limit`);
    }

    // Check file type
    if (this.config.allowedFileTypes && !this.config.allowedFileTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check for suspicious file names
    if (VALIDATION_PATTERNS.suspicious.test(file.name)) {
      securityThreats.push('suspicious_filename');
    }

    // Check for executable file extensions
    const dangerousExtensions = /\.(exe|bat|cmd|scr|pif|com|jar|vbs|js|jar|app|deb|pkg|dmg)$/i;
    if (dangerousExtensions.test(file.name)) {
      securityThreats.push('dangerous_file_type');
    }

    return {
      isValid: errors.length === 0 && securityThreats.length === 0,
      sanitizedValue: file.name,
      errors,
      securityThreats
    };
  }

  private isSpamContent(content: string): boolean {
    const spamPatterns = [
      /(?:viagra|cialis|lottery|winner|congratulations|claim.*prize)/i,
      /(?:click.*here|limited.*time|act.*now|urgent)/i,
      /(?:make.*money|work.*home|guaranteed.*income)/i,
      /(?:free.*trial|risk.*free|no.*obligation)/i,
      /(?:http.*bit\.ly|http.*tinyurl|http.*goo\.gl)/i,
      /(?:@.*\.ru|@.*\.tk|@.*\.ml)/i
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  generateSecurityToken(): string {
    return csrfTokenManager.getToken();
  }

  validateSecurityToken(token: string): boolean {
    return csrfTokenManager.validateToken(token);
  }
}

// Utility functions for common security operations
export const securityUtils = {
  getClientFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    return btoa(JSON.stringify({
      userAgent: navigator.userAgent.slice(0, 100),
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
      canvas: canvas.toDataURL().slice(-50),
      timestamp: Date.now()
    }));
  },

  isBot(): boolean {
    // Simple bot detection
    const botPatterns = /bot|crawl|spider|scrape|fetch/i;
    return botPatterns.test(navigator.userAgent) || 
           !navigator.webdriver === undefined ||
           (window as any).phantom !== undefined ||
           (window as any).callPhantom !== undefined;
  },

  detectAutomation(): boolean {
    // Detect automation tools
    return !!(
      (window as any).webdriver ||
      (window as any).domAutomation ||
      (window as any).domAutomationController ||
      (navigator as any).webdriver
    );
  },

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default EnhancedFormValidator;