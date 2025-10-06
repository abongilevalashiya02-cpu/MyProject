import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyListingFormData } from '@/components/venues/forms/propertyListingSchema';

export const useFormValidation = (form: UseFormReturn<PropertyListingFormData>) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const formData = form.watch();
  
  useEffect(() => {
    const completed: string[] = [];
    
    // Media section
    if (formData.propertyName && formData.propertyType) {
      completed.push('basic');
    }
    
    // Capacity section
    if (formData.minCapacity && formData.maxCapacity && formData.totalRooms) {
      completed.push('capacity');
    }
    
    // Pricing section
    if (formData.priceRangeUSD && formData.priceRangeZAR) {
      completed.push('pricing');
    }
    
    // Contact section
    if (formData.contactName && formData.contactEmail && formData.contactPhone) {
      completed.push('contact');
    }
    
    // Amenities section
    if (formData.activities && formData.amenities && formData.amenities.length > 0) {
      completed.push('amenities');
    }
    
    // Features section
    if (formData.ecoFriendly !== undefined || formData.luxury !== undefined) {
      completed.push('features');
    }
    
    // Enhanced section
    if (formData.description || formData.uniqueSellingPoints) {
      completed.push('enhanced');
    }
    
    setCompletedSections(completed);
    
    // Auto-advance current step based on completion
    if (completed.includes('basic') && completed.includes('capacity')) {
      if (completed.includes('pricing') && completed.includes('contact')) {
        if (completed.includes('amenities')) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
      } else {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(1);
    }
  }, [formData]);
  
  const requiredSections = ['basic', 'capacity', 'pricing', 'contact', 'amenities'];
  const isFormComplete = requiredSections.every(section => 
    completedSections.includes(section)
  );
  
  const getFieldError = (fieldName: keyof PropertyListingFormData) => {
    return form.formState.errors[fieldName]?.message;
  };
  
  const validateField = async (fieldName: keyof PropertyListingFormData) => {
    await form.trigger(fieldName);
  };
  
  return {
    completedSections,
    currentStep,
    isFormComplete,
    requiredSections,
    getFieldError,
    validateField,
  };
};