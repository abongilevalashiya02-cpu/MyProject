import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  fingerprint: string;
}

export function useDeviceFingerprinting() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  const generateFingerprint = (): DeviceFingerprint => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const canvasFingerprint = canvas.toDataURL();
    
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      fingerprint: ''
    };

    // Create a simple hash of the device characteristics
    const deviceString = JSON.stringify(deviceInfo) + canvasFingerprint;
    const fingerprint = btoa(deviceString).slice(0, 32);
    
    return { ...deviceInfo, fingerprint };
  };

  const logDeviceFingerprint = async (action: string) => {
    try {
      const deviceFingerprint = generateFingerprint();
      
      // Log for security monitoring
      await supabase.functions.invoke('security-monitor', {
        body: {
          type: 'device_fingerprint',
          severity: 'low',
          details: {
            action,
            fingerprint: deviceFingerprint.fingerprint,
            userAgent: deviceFingerprint.userAgent,
            timestamp: new Date().toISOString()
          }
        }
      });

      setFingerprint(deviceFingerprint.fingerprint);
    } catch (error) {
      console.error('Error logging device fingerprint:', error);
    }
  };

  useEffect(() => {
    logDeviceFingerprint('page_load');
  }, []);

  return {
    fingerprint,
    logDeviceFingerprint
  };
}