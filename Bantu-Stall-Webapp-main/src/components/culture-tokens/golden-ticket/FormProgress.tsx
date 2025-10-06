
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface FormProgressProps {
  step: number;
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ step, totalSteps }) => {
  const progressPercentage = (step / totalSteps) * 100;
  
  return (
    <div className="px-6 pt-6">
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Start</span>
        <span>Submission</span>
      </div>
    </div>
  );
};

export default FormProgress;
