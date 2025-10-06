import { appConfig } from '@/config/environment';

// Declare EmailJS on window object
declare global {
  interface Window {
    emailjs?: {
      init: (publicKey: string) => void;
    };
  }
}

// Initialize EmailJS with configuration from appConfig
export const initializeEmailJS = () => {
  if (typeof window !== 'undefined' && window.emailjs) {
    window.emailjs.init(appConfig.integrations.emailJs.publicKey);
  }
};

// Call initialization when the module loads
if (typeof window !== 'undefined') {
  // Delay initialization to ensure EmailJS library is loaded
  setTimeout(initializeEmailJS, 100);
}