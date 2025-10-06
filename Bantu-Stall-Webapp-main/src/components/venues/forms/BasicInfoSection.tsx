
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyListingFormData, areas, propertyTypes } from './propertyListingSchema';

interface BasicInfoSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="propertyName">Property Name *</Label>
          <Input
            id="propertyName"
            {...form.register('propertyName')}
            placeholder="Enter property name"
          />
          {form.formState.errors.propertyName && (
            <p className="text-sm text-red-500">{form.formState.errors.propertyName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select onValueChange={(value) => form.setValue('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.propertyType && (
            <p className="text-sm text-red-500">{form.formState.errors.propertyType.message}</p>
          )}
        </div>
      </div>

      {/* Location Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Full Address *</Label>
          <Input
            id="location"
            {...form.register('location')}
            placeholder="Enter full address"
          />
          {form.formState.errors.location && (
            <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="area">Area *</Label>
          <Select onValueChange={(value) => form.setValue('area', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.area && (
            <p className="text-sm text-red-500">{form.formState.errors.area.message}</p>
          )}
        </div>
      </div>



      {/* Proximity to Landmark */}
      <div>
        <Label htmlFor="proximityToLandmark">Proximity to Landmark or Airport *</Label>
        <Input
          id="proximityToLandmark"
          {...form.register('proximityToLandmark')}
          placeholder="e.g., 5km from Sandton City, 10min from OR Tambo Airport, next to major hospital, etc."
        />
        {form.formState.errors.proximityToLandmark && (
          <p className="text-sm text-red-500">{form.formState.errors.proximityToLandmark.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Property Description *</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Describe your property, unique features, accessibility, and any edge-case scenarios (e.g., power backup, water supply, security, etc.). Mention what makes it ideal for different guest types (corporate, family, events, etc.)."
          rows={5}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>
    </>
  );
};

export default BasicInfoSection;
