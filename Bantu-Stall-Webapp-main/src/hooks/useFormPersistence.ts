import { useEffect, useCallback } from 'react';
import { saveFormData, loadFormData, clearFormData, loadFormStep } from '@/utils/formPersistence';

/**
 * Hook for automatic form data persistence with field exclusion
 */
export const useFormPersistence = <T>(
  key: string,
  formData: T,
  defaultData: T,
  step?: number,
  dependencies: any[] = [],
  excludeFields?: (keyof T)[]
) => {
  // Save form data whenever it changes (excluding specified fields)
  useEffect(() => {
    if (excludeFields && excludeFields.length > 0) {
      const filteredData = { ...formData };
      excludeFields.forEach(field => {
        delete filteredData[field];
      });
      saveFormData(key, filteredData, step);
    } else {
      saveFormData(key, formData, step);
    }
  }, [key, formData, step, excludeFields, ...dependencies]);

  // Load initial form data
  const loadInitialData = useCallback((): T => {
    return loadFormData(key, defaultData);
  }, [key, defaultData]);

  // Load initial step
  const loadInitialStep = useCallback((defaultStep: number = 1): number => {
    return loadFormStep(key, defaultStep);
  }, [key]);

  // Clear form data
  const clearData = useCallback(() => {
    clearFormData(key);
  }, [key]);

  return {
    loadInitialData,
    loadInitialStep,
    clearData
  };
};

/**
 * Hook for manual form data persistence control
 */
export const useManualFormPersistence = <T>(key: string) => {
  const saveData = useCallback((data: T, step?: number) => {
    saveFormData(key, data, step);
  }, [key]);

  const loadData = useCallback((defaultData: T): T => {
    return loadFormData(key, defaultData);
  }, [key]);

  const loadStep = useCallback((defaultStep: number = 1): number => {
    return loadFormStep(key, defaultStep);
  }, [key]);

  const clearData = useCallback(() => {
    clearFormData(key);
  }, [key]);

  return {
    saveData,
    loadData,
    loadStep,
    clearData
  };
};