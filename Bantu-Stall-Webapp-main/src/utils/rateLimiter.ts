interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  checkLimit(
    identifier: string, 
    maxRequests: number = 5, 
    windowMs: number = 60 * 1000 // 1 minute
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: this.store[key].resetTime,
      };
    }

    if (this.store[key].count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.store[key].resetTime,
      };
    }

    this.store[key].count++;
    return {
      allowed: true,
      remaining: maxRequests - this.store[key].count,
      resetTime: this.store[key].resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const rateLimiter = new RateLimiter();

// Rate limiting hook for forms
export const useRateLimit = (
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
) => {
  const checkLimit = () => {
    return rateLimiter.checkLimit(identifier, maxRequests, windowMs);
  };

  return { checkLimit };
};