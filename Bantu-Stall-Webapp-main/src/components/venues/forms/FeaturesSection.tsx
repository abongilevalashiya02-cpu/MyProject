
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyListingFormData } from './propertyListingSchema';

interface FeaturesSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ form }) => {
  return (
    <>
      {/* Features */}
      <div>
        <Label>Property Features & Edge Cases</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ecoFriendly"
              {...form.register('ecoFriendly')}
            />
            <Label htmlFor="ecoFriendly">Eco-Friendly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="luxury"
              {...form.register('luxury')}
            />
            <Label htmlFor="luxury">Luxury</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="indoorFocus"
              {...form.register('indoorFocus')}
            />
            <Label htmlFor="indoorFocus">Indoor Focus</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="outdoorFocus"
              {...form.register('outdoorFocus')}
            />
            <Label htmlFor="outdoorFocus">Outdoor Focus</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="csrAlignment"
              {...form.register('csrAlignment')}
            />
            <Label htmlFor="csrAlignment">CSR Alignment</Label>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Special Requests or Additional Information</Label>
        <Textarea
          id="specialRequests"
          {...form.register('specialRequests')}
          placeholder="Any additional information you'd like to share about your property"
          rows={3}
        />
      </div>
    </>
  );
};

export default FeaturesSection;
