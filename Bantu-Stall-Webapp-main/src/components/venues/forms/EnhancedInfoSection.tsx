import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyListingFormData, accessibilityOptions, guestTypes, languageOptions, marketingSources } from './propertyListingSchema';

interface EnhancedInfoSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const EnhancedInfoSection: React.FC<EnhancedInfoSectionProps> = ({ form }) => {
  // For multi-select checkboxes
  const handleMultiCheckbox = (field: keyof PropertyListingFormData, value: string, checked: boolean) => {
    const current = form.getValues(field) as string[];
    const updated = checked ? [...(current || []), value] : (current || []).filter(v => v !== value);
    form.setValue(field, updated);
  };

  return (
    <>
      {/* Accessibility */}
      <div>
        <Label>Accessibility & Special Needs</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {accessibilityOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`accessibility-${option}`}
                checked={(form.watch('accessibility') || []).includes(option)}
                onCheckedChange={checked => handleMultiCheckbox('accessibility', option, checked as boolean)}
              />
              <Label htmlFor={`accessibility-${option}`} className="text-sm">{option}</Label>
            </div>
          ))}
        </div>
        
      </div>

      {/* Unique Selling Points */}
      <div>
        <Label htmlFor="uniqueSellingPoints">What makes your property special? *</Label>
        <Textarea
          id="uniqueSellingPoints"
          {...form.register('uniqueSellingPoints')}
          placeholder="Highlight unique features, history, experiences, and why your property is ideal for different guest types (corporate, family, events, medical, long-stay, etc.)."
          rows={3}
        />
        {form.formState.errors.uniqueSellingPoints && (
          <p className="text-sm text-red-500">{form.formState.errors.uniqueSellingPoints.message}</p>
        )}
      </div>

      {/* Booking Flexibility */}
      <div>
        <Label htmlFor="bookingFlexibility">Booking, Cancellation, and Payment Flexibility *</Label>
        <Textarea
          id="bookingFlexibility"
          {...form.register('bookingFlexibility')}
          placeholder="Describe your policies for booking, cancellation, and payment, including for special cases (e.g., last-minute, long stays, emergencies, high-risk events)."
          rows={3}
        />
        {form.formState.errors.bookingFlexibility && (
          <p className="text-sm text-red-500">{form.formState.errors.bookingFlexibility.message}</p>
        )}
      </div>

      {/* Preferred Guest Types */}
      <div>
        <Label>Preferred Guest Types *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {guestTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`guestType-${type}`}
                checked={(form.watch('preferredGuestTypes') || []).includes(type)}
                onCheckedChange={checked => handleMultiCheckbox('preferredGuestTypes', type, checked as boolean)}
              />
              <Label htmlFor={`guestType-${type}`} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.preferredGuestTypes && (
          <p className="text-sm text-red-500">{form.formState.errors.preferredGuestTypes.message}</p>
        )}
      </div>

      {/* Languages Spoken */}
      <div>
        <Label>Languages Spoken *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {languageOptions.map(lang => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={(form.watch('languagesSpoken') || []).includes(lang)}
                onCheckedChange={checked => handleMultiCheckbox('languagesSpoken', lang, checked as boolean)}
              />
              <Label htmlFor={`lang-${lang}`} className="text-sm">{lang}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.languagesSpoken && (
          <p className="text-sm text-red-500">{form.formState.errors.languagesSpoken.message}</p>
        )}
      </div>

      {/* Marketing Source */}
      <div>
        <Label htmlFor="marketingSource">How did you hear about us? *</Label>
        <Select onValueChange={value => form.setValue('marketingSource', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {marketingSources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.marketingSource && (
          <p className="text-sm text-red-500">{form.formState.errors.marketingSource.message}</p>
        )}
      </div>
    </>
  );
};

export default EnhancedInfoSection;
