import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSections: string[];
  requiredSections: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({ 
  currentStep, 
  totalSteps, 
  completedSections, 
  requiredSections 
}) => {
  const progress = (completedSections.length / requiredSections.length) * 100;
  
  const steps = [
    { id: 1, label: "Media & Basic Info", sections: ["media", "basic"] },
    { id: 2, label: "Capacity & Pricing", sections: ["capacity", "pricing"] },
    { id: 3, label: "Contact & Amenities", sections: ["contact", "amenities"] },
    { id: 4, label: "Features & Details", sections: ["features", "enhanced"] },
  ];

  return (
    <div className="mb-6 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Form Progress</h3>
        <span className="text-xs text-muted-foreground">
          {completedSections.length} of {requiredSections.length} sections completed
        </span>
      </div>
      
      <Progress value={progress} className="mb-4" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step) => {
          const isCompleted = step.sections.every(section => 
            completedSections.includes(section)
          );
          const isCurrent = step.id === currentStep;
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 p-2 rounded text-xs ${
                isCurrent 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : isCompleted 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
              <span className="font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;