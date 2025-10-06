import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoroApplicationData } from '../schemas/horoApplicationSchema';

export const OrganizationalContextStep: React.FC = () => {
  const { control } = useFormContext<HoroApplicationData>();

  const teamSizeOptions = [
    { value: '5-10', label: '5-10 people' },
    { value: '11-25', label: '11-25 people' },
    { value: '26-50', label: '26-50 people' },
    { value: '50+', label: '50+ people' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Organizational Context</h3>
        <p className="text-gray-600">Help us understand your company and team structure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Company Name *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Acme Corporation"
                  {...field}
                  className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Your Role/Title *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Head of People & Culture"
                  {...field}
                  className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="teamSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Team Size *
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 border-gray-300 focus:border-bantu-orange focus:ring-bantu-orange">
                  <SelectValue placeholder="Select team size range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {teamSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              The number of participants for the experience.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
};