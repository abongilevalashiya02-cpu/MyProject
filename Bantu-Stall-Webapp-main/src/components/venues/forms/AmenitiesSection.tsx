
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyListingFormData, amenitiesList } from './propertyListingSchema';

interface AmenitiesSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string, checked: boolean) => void;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ 
  form, 
  selectedAmenities, 
  onAmenityChange 
}) => {
  return (
    <>
      {/* Activities */}
      <div>
        <Label htmlFor="activities">On-site & Nearby Activities *</Label>
        <Textarea
          id="activities"
          {...form.register('activities')}
          placeholder="List all activities/experiences available on-site and nearby (e.g., team building, spa, hiking, cultural tours, nightlife, medical facilities, etc.). Include edge cases like rainy day options, accessible activities, and child-friendly options."
          rows={4}
        />
      </div>

      {/* Amenities */}
      <div>
        <Label>Amenities & Special Facilities *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => onAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.amenities && (
          <p className="text-sm text-red-500">{form.formState.errors.amenities.message}</p>
        )}
      </div>
    </>
  );
};

export default AmenitiesSection;
