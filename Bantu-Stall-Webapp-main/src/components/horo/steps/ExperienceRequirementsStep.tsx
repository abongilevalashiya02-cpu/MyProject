import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoroApplicationData } from '../schemas/horoApplicationSchema';

export const ExperienceRequirementsStep: React.FC = () => {
  const { control, watch, setValue } = useFormContext<HoroApplicationData>();
  const selectedObjectives = watch('objectives') || [];

  const objectiveOptions = [
    'Leadership Development',
    'Team Building & Cohesion',
    'Strategic Planning',
    'Wellness & Rejuvenation',
    'Cultural Intelligence',
  ];

  const budgetRanges = [
    { value: '<10000', label: '< $10,000' },
    { value: '10000-25000', label: '$10,000 - $25,000' },
    { value: '25000-50000', label: '$25,000 - $50,000' },
    { value: '50000+', label: '$50,000+' },
  ];

  const sourceOptions = [
    'Article/Blog',
    'LinkedIn',
    'Google Search',
    'Referral',
    'Conference/Event',
    'Other',
  ];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    const currentObjectives = selectedObjectives;
    if (checked) {
      setValue('objectives', [...currentObjectives, objective]);
    } else {
      setValue('objectives', currentObjectives.filter((obj: string) => obj !== objective));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience Requirements</h3>
        <p className="text-gray-600">Tell us about your ideal transformative journey.</p>
      </div>

      <FormField
        control={control}
        name="objectives"
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Primary Objectives *
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {objectiveOptions.map((objective) => (
                <div key={objective} className="flex items-center space-x-3">
                  <Checkbox
                    id={objective}
                    checked={selectedObjectives.includes(objective)}
                    onCheckedChange={(checked) => handleObjectiveChange(objective, checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-bantu-orange data-[state=checked]:border-bantu-orange"
                  />
                  <label
                    htmlFor={objective}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {objective}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              What are the key outcomes you hope to achieve?
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="experienceDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Desired Experiences
              <span className="text-gray-400 ml-1">(Optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., We are looking for a 3-day retreat with a mix of wellness activities, cultural immersion, and facilitated strategy workshops."
                {...field}
                rows={4}
                maxLength={1000}
                className="border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange resize-none"
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              Tell us more about your ideal retreat. Any specific activities or themes you have in mind?
            </p>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="locations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Preferred Location(s)
                <span className="text-gray-400 ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Gauteng, South Africa; Nairobi, Kenya"
                  {...field}
                  className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                If you have a destination in mind, please let us know.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Estimated Budget
                <span className="text-gray-400 ml-1">(Optional)</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                Providing a range helps our team tailor a proposal that aligns with your financial expectations.
              </p>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              How did you hear about us?
              <span className="text-gray-400 ml-1">(Optional)</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {sourceOptions.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};