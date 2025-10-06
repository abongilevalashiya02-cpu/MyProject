
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExperienceTypesSelector from './ExperienceTypesSelector';
import ExcursionFields from './ExcursionFields';
import { destinations } from './constants';

const ExcursionPage: React.FC = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Build Your Excursion</h2>
        <p className="text-gray-600">Tell us about your dream team adventure</p>
      </div>
      
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred African Destination</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {destinations.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="experienceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Type</FormLabel>
            <ExperienceTypesSelector 
              value={field.value} 
              onSelect={(value) => form.setValue("experienceType", value, { shouldValidate: true })} 
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <ExcursionFields />
    </div>
  );
};

export default ExcursionPage;
