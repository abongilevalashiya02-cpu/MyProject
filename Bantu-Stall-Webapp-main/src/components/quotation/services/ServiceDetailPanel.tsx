import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import { ArrowLeft, Plus } from 'lucide-react';
import { ServiceCategory, ServiceLineItem, calculateServiceCost, formatServiceCost, getPricingInputLabel } from '@/utils/serviceCosting';

interface ServiceDetailPanelProps {
  category: string;
  services: ServiceCategory[];
  onBack: () => void;
  onAddService: (service: ServiceLineItem) => void;
  attendeeCount?: number;
}

export const ServiceDetailPanel: React.FC<ServiceDetailPanelProps> = ({
  category,
  services,
  onBack,
  onAddService,
  attendeeCount,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [customAttendeeCount, setCustomAttendeeCount] = useState<number | undefined>(attendeeCount);
  const [notes, setNotes] = useState('');

  const handleAddToCart = () => {
    if (!selectedService) return;

    const subtotal = calculateServiceCost(
      selectedService,
      quantity,
      duration,
      customAttendeeCount
    );

    const lineItem: ServiceLineItem = {
      serviceId: selectedService.id,
      serviceCatalogId: selectedService.id,
      serviceName: selectedService.service_name,
      serviceCategory: selectedService.service_category,
      pricingModel: selectedService.pricing_model,
      quantity,
      unitPrice: selectedService.avg_price,
      duration,
      attendeeCount: customAttendeeCount,
      unit: selectedService.unit,
      subtotal,
      notes: notes || undefined,
    };

    onAddService(lineItem);
    
    // Reset form
    setSelectedService(null);
    setQuantity(1);
    setDuration(undefined);
    setCustomAttendeeCount(attendeeCount);
    setNotes('');
  };

  const previewCost = selectedService
    ? calculateServiceCost(selectedService, quantity, duration, customAttendeeCount)
    : 0;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Button>

      <h3 className="text-xl font-semibold">{category}</h3>

      {!selectedService ? (
        <div className="grid gap-3">
          {services.map((service) => {
            const IconComponent = (Icons as any)[service.icon_name] || Icons.Package;
            
            return (
              <Card
                key={service.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{service.service_name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                        {service.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-semibold text-primary">
                          {formatServiceCost(service.avg_price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          per {service.unit}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {service.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const IconComponent = (Icons as any)[selectedService.icon_name] || Icons.Package;
                return <IconComponent className="h-5 w-5" />;
              })()}
              {selectedService.service_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedService.description}
            </p>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              {(selectedService.pricing_model === 'hourly' || selectedService.pricing_model === 'daily') && (
                <div>
                  <Label htmlFor="duration">{getPricingInputLabel(selectedService.pricing_model)}</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration || ''}
                    onChange={(e) => setDuration(parseInt(e.target.value) || undefined)}
                    placeholder={`Enter ${selectedService.pricing_model === 'hourly' ? 'hours' : 'days'}`}
                  />
                </div>
              )}

              {selectedService.pricing_model === 'per_person' && (
                <div>
                  <Label htmlFor="attendees">{getPricingInputLabel(selectedService.pricing_model)}</Label>
                  <Input
                    id="attendees"
                    type="number"
                    min="1"
                    value={customAttendeeCount || ''}
                    onChange={(e) => setCustomAttendeeCount(parseInt(e.target.value) || undefined)}
                    placeholder="Number of attendees"
                  />
                </div>
              )}

              {(selectedService.pricing_model === 'per_word' || selectedService.pricing_model === 'per_page') && (
                <div>
                  <Label htmlFor="units">{getPricingInputLabel(selectedService.pricing_model)}</Label>
                  <Input
                    id="units"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements or notes..."
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Estimated Cost:</span>
                <span className="text-primary">{formatServiceCost(previewCost)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedService(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddToCart} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add to Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
