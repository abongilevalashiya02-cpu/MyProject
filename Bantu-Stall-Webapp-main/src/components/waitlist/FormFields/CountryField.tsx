
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { WaitlistFormData } from '../types';

interface CountryFieldProps {
  form: UseFormReturn<WaitlistFormData>;
}

const CountryField: React.FC<CountryFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Input placeholder="Enter your country" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CountryField;
