
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { teamGoals } from './constants';

const GoalsPage: React.FC = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Goals & Learning Outcomes</h2>
        <p className="text-gray-600">What would you like your team to achieve?</p>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Your Top 2 Team Goals
        </label>
        
        {/* Goal 1 */}
        <FormField
          control={form.control}
          name="goal1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Goal</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your #1 goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamGoals.map((goal) => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Goal 2 */}
        <FormField
          control={form.control}
          name="goal2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Goal</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your #2 goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamGoals.map((goal) => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="localFacilitators"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Are you open to local facilitators?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <label htmlFor="yes" className="cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <label htmlFor="no" className="cursor-pointer">No</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <label htmlFor="maybe" className="cursor-pointer">Maybe</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GoalsPage;
