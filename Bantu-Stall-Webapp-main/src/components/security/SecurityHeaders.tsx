import { useEffect } from 'react';
import { generateCSPNonce } from '@/utils/security';

export function SecurityHeaders() {
  useEffect(() => {
    // Set security headers for the application
    const nonce = generateCSPNonce();
    
    // Enhanced Content Security Policy
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://unpkg.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://www.youtube.com https://youtube.com",
      "media-src 'self' https://www.youtube.com https://youtube.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    // Create meta tags for security headers
    const headers = [
      { name: 'Content-Security-Policy', content: csp },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=()' }
    ];

    headers.forEach(header => {
      let meta = document.querySelector(`meta[http-equiv="${header.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('http-equiv', header.name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', header.content);
    });

    // Store nonce for script usage
    (window as any).cspNonce = nonce;
  }, []);

  return null;
}