import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart } from 'lucide-react';
import { ServiceLineItem, formatServiceCost } from '@/utils/serviceCosting';

interface ServiceCartSummaryProps {
  items: ServiceLineItem[];
  onRemoveItem: (index: number) => void;
}

export const ServiceCartSummary: React.FC<ServiceCartSummaryProps> = ({
  items,
  onRemoveItem,
}) => {
  const totalCost = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Selected Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No services selected yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Selected Services ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm">{item.serviceName}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.serviceCategory}
                  </Badge>
                </div>
                
                <div>
                  Qty: {item.quantity}
                  {item.duration && ` × ${item.duration} ${item.pricingModel === 'hourly' ? 'hrs' : 'days'}`}
                  {item.attendeeCount && ` × ${item.attendeeCount} people`}
                </div>
                
                {item.notes && (
                  <div className="text-xs italic truncate">
                    Note: {item.notes}
                  </div>
                )}
              </div>

              <div className="mt-2 font-semibold text-sm text-primary">
                {formatServiceCost(item.subtotal)}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t pt-3 mt-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Services Total:</span>
            <span className="text-lg text-primary">{formatServiceCost(totalCost)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
