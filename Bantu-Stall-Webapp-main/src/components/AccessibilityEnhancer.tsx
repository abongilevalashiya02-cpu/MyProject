import { useEffect } from 'react';

/**
 * Component that enhances accessibility across the application
 */
export const AccessibilityEnhancer = () => {
  useEffect(() => {
    // Add keyboard navigation support to clickable elements
    const addKeyboardSupport = () => {
      const clickableElements = document.querySelectorAll('[data-clickable]:not([tabindex])');
      
      clickableElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Make focusable
        if (!htmlElement.getAttribute('tabindex')) {
          htmlElement.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event listeners
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            htmlElement.click();
          }
        };
        
        htmlElement.addEventListener('keypress', handleKeyPress);
        
        // Cleanup function will be handled by useEffect cleanup
        return () => {
          htmlElement.removeEventListener('keypress', handleKeyPress);
        };
      });
    };

    // Add ARIA labels to elements missing them
    const enhanceARIA = () => {
      // Buttons without aria-label
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach((button) => {
        const text = button.textContent?.trim();
        if (text && text.length > 0) {
          button.setAttribute('aria-label', text);
        }
      });
      
      // Links without aria-label
      const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
      links.forEach((link) => {
        const text = link.textContent?.trim();
        if (text && text.length > 0) {
          link.setAttribute('aria-label', text);
        }
      });
      
      // Images without alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        const src = htmlImg.src;
        const filename = src.split('/').pop()?.split('.')[0] || 'Image';
        htmlImg.setAttribute('alt', `${filename} - Bantu Stall`);
      });
      
      // Forms without proper labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach((input) => {
        const htmlInput = input as HTMLInputElement;
        const placeholder = htmlInput.placeholder;
        const type = htmlInput.type;
        
        if (placeholder) {
          htmlInput.setAttribute('aria-label', placeholder);
        } else {
          const label = `${type.charAt(0).toUpperCase() + type.slice(1)} input`;
          htmlInput.setAttribute('aria-label', label);
        }
      });
    };

    // Add skip navigation link
    const addSkipNavigation = () => {
      if (!document.querySelector('#skip-nav')) {
        const skipLink = document.createElement('a');
        skipLink.id = 'skip-nav';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        
        document.body.insertBefore(skipLink, document.body.firstChild);
      }
    };

    // Add main content landmark
    const addMainLandmark = () => {
      const main = document.querySelector('main');
      if (main && !main.id) {
        main.id = 'main-content';
        main.setAttribute('role', 'main');
        main.setAttribute('aria-label', 'Main content');
      }
    };

    // Initialize all enhancements
    addKeyboardSupport();
    enhanceARIA();
    addSkipNavigation();
    addMainLandmark();

    // Reapply enhancements when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        enhanceARIA();
        addKeyboardSupport();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

/**
 * Hook for managing focus states and keyboard navigation
 */
export const useFocusManagement = () => {
  useEffect(() => {
    const handleFocusVisible = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('focus-visible');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('focus-visible');
    };

    document.addEventListener('keydown', handleFocusVisible);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleFocusVisible);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

export default AccessibilityEnhancer;