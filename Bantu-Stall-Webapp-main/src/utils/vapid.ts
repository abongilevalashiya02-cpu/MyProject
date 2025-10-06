// Utilities for handling VAPID keys and conversions

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const getStoredVapidPublicKey = (): string | null => {
  return localStorage.getItem('vapidPublicKey');
};

export const setStoredVapidPublicKey = (key: string) => {
  localStorage.setItem('vapidPublicKey', key);
};

export const getApplicationServerKey = (): Uint8Array | null => {
  // Prefer config, then localStorage
  try {
    const { PWA_CONFIG } = require('@/config/pwa');
    const key: string | undefined = PWA_CONFIG?.vapidPublicKey;
    const b64 = (key && key.length > 0) ? key : getStoredVapidPublicKey();
    if (!b64) return null;
    return urlBase64ToUint8Array(b64);
  } catch {
    const b64 = getStoredVapidPublicKey();
    return b64 ? urlBase64ToUint8Array(b64) : null;
  }
};
