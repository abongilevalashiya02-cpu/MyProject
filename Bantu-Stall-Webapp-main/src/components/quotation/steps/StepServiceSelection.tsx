import React, { useState } from 'react';
import { ServiceLineItem } from '@/utils/serviceCosting';
import { ServiceCategoryGrid } from '../services/ServiceCategoryGrid';
import { ServiceDetailPanel } from '../services/ServiceDetailPanel';
import { ServiceCartSummary } from '../services/ServiceCartSummary';
import { useServiceCatalog, useServiceCategories } from '@/hooks/useServiceCatalog';
import { Loader2 } from 'lucide-react';

interface FormData {
  selected_service_items?: ServiceLineItem[];
  service_notes?: string;
  attendee_count?: number;
}

interface StepServiceSelectionProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function StepServiceSelection({ formData, updateFormData }: StepServiceSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories = [], isLoading: loadingCategories } = useServiceCategories();
  const { data: services = [], isLoading: loadingServices } = useServiceCatalog({
    category: selectedCategory || undefined,
  });

  const selectedItems = formData.selected_service_items || [];

  const handleAddService = (service: ServiceLineItem) => {
    const updatedItems = [...selectedItems, service];
    updateFormData({ selected_service_items: updatedItems });
  };

  const handleRemoveService = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    updateFormData({ selected_service_items: updatedItems });
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Additional Services</h3>
        <p className="text-sm text-muted-foreground">
          Browse and select professional services for your corporate retreat
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!selectedCategory ? (
            <ServiceCategoryGrid
              categories={categories}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          ) : (
            <ServiceDetailPanel
              category={selectedCategory}
              services={services}
              onBack={() => setSelectedCategory(null)}
              onAddService={handleAddService}
              attendeeCount={formData.attendee_count}
            />
          )}
        </div>

        <div>
          <ServiceCartSummary
            items={selectedItems}
            onRemoveItem={handleRemoveService}
          />
        </div>
      </div>
    </div>
  );
}