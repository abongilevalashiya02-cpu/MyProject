
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PropertyListingFormData } from './propertyListingSchema';
import FormFieldWrapper from './FormFieldWrapper';

interface CapacitySectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const CapacitySection: React.FC<CapacitySectionProps> = ({ form }) => {
  const { watch, formState: { errors } } = form;
  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-foreground">Capacity & Rooms</h3>
        <p className="text-sm text-muted-foreground">
          Specify your property's accommodation capacity and room details
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <FormFieldWrapper
          label="Min Capacity"
          htmlFor="minCapacity"
          required
          error={errors.minCapacity?.message}
          isValid={!!formData.minCapacity && !errors.minCapacity}
          description="Minimum number of guests"
        >
          <Input
            id="minCapacity"
            type="number"
            min="1"
            {...form.register('minCapacity', { valueAsNumber: true })}
            placeholder="10"
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Max Capacity"
          htmlFor="maxCapacity"
          required
          error={errors.maxCapacity?.message}
          isValid={!!formData.maxCapacity && !errors.maxCapacity}
          description="Maximum number of guests"
        >
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            {...form.register('maxCapacity', { valueAsNumber: true })}
            placeholder="200"
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Total Rooms"
          htmlFor="totalRooms"
          required
          error={errors.totalRooms?.message}
          isValid={!!formData.totalRooms && !errors.totalRooms}
          description="Total guest rooms"
        >
          <Input
            id="totalRooms"
            type="number"
            min="1"
            {...form.register('totalRooms', { valueAsNumber: true })}
            placeholder="50"
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Meeting Rooms"
          htmlFor="meetingRooms"
          required
          error={errors.meetingRooms?.message}
          isValid={!!formData.meetingRooms && !errors.meetingRooms}
          description="Dedicated meeting spaces"
        >
          <Input
            id="meetingRooms"
            type="number"
            min="0"
            {...form.register('meetingRooms', { valueAsNumber: true })}
            placeholder="5"
          />
        </FormFieldWrapper>
      </div>
    </div>
  );
};

export default CapacitySection;
