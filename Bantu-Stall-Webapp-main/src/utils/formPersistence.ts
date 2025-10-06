/**
 * Utility functions for form data persistence in localStorage
 */

export interface PersistedFormData {
  data: any;
  timestamp: number;
  step?: number;
}

/**
 * Save form data to localStorage with timestamp
 */
export const saveFormData = <T>(key: string, data: T, step?: number): void => {
  try {
    const persistedData: PersistedFormData = {
      data,
      timestamp: Date.now(),
      step
    };
    localStorage.setItem(key, JSON.stringify(persistedData));
  } catch (error) {
    console.error(`Failed to save form data for ${key}:`, error);
  }
};

/**
 * Load form data from localStorage
 */
export const loadFormData = <T>(key: string, defaultData: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: PersistedFormData = JSON.parse(saved);
      // Check if data is not older than 7 days
      const isValid = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      if (isValid && parsed.data) {
        return parsed.data;
      }
    }
  } catch (error) {
    console.error(`Failed to load form data for ${key}:`, error);
  }
  return defaultData;
};

/**
 * Load form step from localStorage
 */
export const loadFormStep = (key: string, defaultStep: number = 1): number => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: PersistedFormData = JSON.parse(saved);
      const isValid = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      if (isValid && parsed.step) {
        return parsed.step;
      }
    }
  } catch (error) {
    console.error(`Failed to load form step for ${key}:`, error);
  }
  return defaultStep;
};

/**
 * Clear form data from localStorage
 */
export const clearFormData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear form data for ${key}:`, error);
  }
};

/**
 * Check if form data exists in localStorage
 */
export const hasFormData = (key: string): boolean => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: PersistedFormData = JSON.parse(saved);
      const isValid = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      return isValid && !!parsed.data;
    }
  } catch (error) {
    console.error(`Failed to check form data for ${key}:`, error);
  }
  return false;
};