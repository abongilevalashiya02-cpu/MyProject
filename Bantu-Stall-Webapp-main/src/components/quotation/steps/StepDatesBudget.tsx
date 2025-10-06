import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, DollarSign, Clock } from 'lucide-react';

interface FormData {
  preferredDates: string;
  flexibility: string;
  budgetRange: string;
}

interface StepDatesBudgetProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const BUDGET_RANGES = [
  'Under R50,000',
  'R50,000 - R100,000',
  'R100,000 - R200,000', 
  'R200,000 - R500,000',
  'R500,000 - R1,000,000',
  'Over R1,000,000',
  'Discuss with consultant'
];

const FLEXIBILITY_OPTIONS = [
  { value: 'fixed', label: 'Fixed dates - cannot change' },
  { value: 'flexible', label: 'Somewhat flexible - within 2 weeks' },
  { value: 'very-flexible', label: 'Very flexible - within 2 months' }
];

export default function StepDatesBudget({ formData, updateFormData }: StepDatesBudgetProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Dates & Budget
        </h3>
      </div>

      <div>
        <Label htmlFor="preferredDates" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Preferred Dates *
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          When would you like to hold your event?
        </p>
        <Input
          type="text"
          placeholder="e.g., March 15-17, 2024 or First week of April 2024"
          value={formData.preferredDates}
          onChange={(e) => updateFormData({ preferredDates: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="flexibility" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Date Flexibility
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          How flexible are you with the dates?
        </p>
        <div className="grid grid-cols-1 gap-2">
          {FLEXIBILITY_OPTIONS.map((option) => (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                formData.flexibility === option.value 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : ''
              }`}
              onClick={() => updateFormData({ flexibility: option.value })}
            >
              <CardContent className="p-3">
                <span className="text-sm">{option.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="budgetRange" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Budget Range *
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          What's your approximate budget for this event?
        </p>
        <Select
          value={formData.budgetRange}
          onValueChange={(value) => updateFormData({ budgetRange: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your budget range" />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_RANGES.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Flexible Budget Options</h4>
            <p className="text-sm text-blue-700 mt-1">
              Our team will work with your budget to create the best possible experience. 
              All quotes include transparent pricing with no hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}