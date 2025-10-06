// Accessibility utilities for property listing system

/**
 * Manages focus for keyboard navigation
 */
export class FocusManager {
  private focusableElements = [
    'button',
    'input',
    'select', 
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableElements))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }) as HTMLElement[];
  }

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        const closeButton = container.querySelector('[data-close]') as HTMLElement;
        closeButton?.click();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Set focus to first error field in form
   */
  focusFirstError(formElement: HTMLElement): void {
    const errorField = formElement.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (errorField) {
      errorField.focus();
      errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegion();
  }

  private createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.left = '-10000px';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.overflow = 'hidden';
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    
    // Small delay to ensure screen reader picks up the change
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, 100);
  }

  /**
   * Announce form validation errors
   */
  announceErrors(errors: Record<string, string>) {
    const errorCount = Object.keys(errors).length;
    if (errorCount === 0) return;

    const message = errorCount === 1 
      ? `There is 1 error in the form: ${Object.values(errors)[0]}`
      : `There are ${errorCount} errors in the form. Please review and correct them.`;
    
    this.announce(message, 'assertive');
  }

  /**
   * Announce successful form submission
   */
  announceSuccess(message: string) {
    this.announce(message, 'polite');
  }
}

/**
 * Keyboard navigation utilities
 */
export const KeyboardNavigation = {
  /**
   * Handle arrow key navigation in lists/grids
   */
  handleArrowNavigation(
    e: KeyboardEvent, 
    items: HTMLElement[], 
    currentIndex: number,
    isGrid = false
  ): number {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = isGrid ? currentIndex + 4 : currentIndex + 1; // Assuming 4-column grid
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = isGrid ? currentIndex - 4 : currentIndex - 1;
        break;
      case 'ArrowRight':
        if (isGrid) {
          e.preventDefault();
          newIndex = currentIndex + 1;
        }
        break;
      case 'ArrowLeft':
        if (isGrid) {
          e.preventDefault();
          newIndex = currentIndex - 1;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    // Wrap around or clamp to bounds
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }

    return newIndex;
  },

  /**
   * Add keyboard support to custom components
   */
  addKeyboardSupport(element: HTMLElement, onClick: () => void) {
    element.setAttribute('tabindex', '0');
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  }
};

/**
 * Color contrast utilities
 */
export const ColorContrast = {
  /**
   * Calculate luminance of a color
   */
  getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if contrast meets WCAG AA standards
   */
  meetsWCAG(backgroundColor: string, textColor: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(backgroundColor, textColor);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },

  /**
   * Convert hex to RGB
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
};

/**
 * Form accessibility enhancements
 */
export const FormAccessibility = {
  /**
   * Add proper labels and descriptions to form fields
   */
  enhanceFormField(
    field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    label: string,
    description?: string,
    required = false
  ) {
    const fieldId = field.id || `field_${Math.random().toString(36).substr(2, 9)}`;
    field.id = fieldId;

    // Add label if not exists
    if (!document.querySelector(`label[for="${fieldId}"]`)) {
      const labelEl = document.createElement('label');
      labelEl.setAttribute('for', fieldId);
      labelEl.textContent = label + (required ? ' *' : '');
      field.parentNode?.insertBefore(labelEl, field);
    }

    // Add description
    if (description) {
      const descId = `${fieldId}_desc`;
      const descEl = document.createElement('div');
      descEl.id = descId;
      descEl.className = 'field-description';
      descEl.textContent = description;
      field.setAttribute('aria-describedby', descId);
      field.parentNode?.insertBefore(descEl, field.nextSibling);
    }

    // Required field
    if (required) {
      field.setAttribute('aria-required', 'true');
    }
  },

  /**
   * Show field errors accessibly
   */
  showFieldError(field: HTMLElement, message: string) {
    const fieldId = field.id;
    const errorId = `${fieldId}_error`;
    
    // Remove existing error
    const existingError = document.getElementById(errorId);
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const errorEl = document.createElement('div');
    errorEl.id = errorId;
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', 
      [field.getAttribute('aria-describedby'), errorId]
        .filter(Boolean)
        .join(' ')
    );
    
    field.parentNode?.insertBefore(errorEl, field.nextSibling);
  },

  /**
   * Clear field errors
   */
  clearFieldError(field: HTMLElement) {
    const fieldId = field.id;
    const errorId = `${fieldId}_error`;
    const errorEl = document.getElementById(errorId);
    
    if (errorEl) {
      errorEl.remove();
      field.setAttribute('aria-invalid', 'false');
      
      // Update aria-describedby
      const describedBy = field.getAttribute('aria-describedby');
      if (describedBy) {
        const newDescribedBy = describedBy
          .split(' ')
          .filter(id => id !== errorId)
          .join(' ');
        
        if (newDescribedBy) {
          field.setAttribute('aria-describedby', newDescribedBy);
        } else {
          field.removeAttribute('aria-describedby');
        }
      }
    }
  }
};

// Global instances
export const focusManager = new FocusManager();
export const screenReader = new ScreenReaderAnnouncer();