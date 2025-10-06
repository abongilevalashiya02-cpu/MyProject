
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from './ApplicationForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ApplicationStep3Props {
  form: UseFormReturn<ApplicationFormValues>;
}

export const ApplicationStep3: React.FC<ApplicationStep3Props> = ({ form }) => {
  const addExpertise = () => {
    const input = document.getElementById('expertise-input') as HTMLInputElement;
    if (input && input.value) {
      const currentExpertise = form.getValues('areasOfExpertise') || [];
      form.setValue('areasOfExpertise', [...currentExpertise, input.value]);
      input.value = '';
    }
  };

  const removeExpertise = (index: number) => {
    const currentExpertise = form.getValues('areasOfExpertise') || [];
    form.setValue(
      'areasOfExpertise',
      currentExpertise.filter((_, i) => i !== index)
    );
  };

  const handleLanguageChange = (value: string) => {
    const currentLanguages = form.getValues('languages') || [];
    if (!currentLanguages.includes(value)) {
      form.setValue('languages', [...currentLanguages, value]);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <FormField
        control={form.control}
        name="areasOfExpertise"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Areas of Expertise</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[60px]">
                {field.value && field.value.map((expertise, index) => (
                  <Badge 
                    key={index} 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none cursor-pointer"
                    onClick={() => removeExpertise(index)}
                  >
                    {expertise} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  id="expertise-input" 
                  placeholder="Add area of expertise" 
                  className="flex-1"
                />
                <Button type="button" size="sm" onClick={addExpertise}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <Select onValueChange={handleLanguageChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select languages you speak" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="swahili">Swahili</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value && field.value.map((language, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-800">
                    {language}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="servicesOffered"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Services Offered</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the types of services you can offer..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem>
        <FormLabel>Pricing</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Base Price</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pricePerPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Price Per Person</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Currency</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="tzs">TZS (TSh)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormItem>
      
      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
                <SelectItem value="part-time">Part-time (15-30 hours/week)</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="custom">Custom schedule</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="certifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications & Qualifications</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List any relevant certifications, training, or qualifications..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
