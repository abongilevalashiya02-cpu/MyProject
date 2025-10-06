import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  isValid?: boolean;
  children: React.ReactNode;
  description?: string;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  isValid,
  children,
  description,
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={htmlFor} 
        className={`flex items-center gap-1 ${error ? 'text-destructive' : isValid ? 'text-green-600' : ''}`}
      >
        {label}
        {required && <span className="text-destructive">*</span>}
        {isValid && <CheckCircle className="h-3 w-3 text-green-600" />}
      </Label>
      
      <div className="relative">
        {children}
        {isValid && !error && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        )}
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormFieldWrapper;