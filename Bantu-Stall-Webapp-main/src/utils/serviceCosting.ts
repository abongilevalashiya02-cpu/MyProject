// Service costing calculations and types

export type ServicePricingModel = 
  | 'hourly' 
  | 'daily' 
  | 'per_person' 
  | 'per_event' 
  | 'per_word' 
  | 'per_page'
  | 'fixed';

export interface ServiceLineItem {
  id?: string;
  serviceId: string;
  serviceCatalogId?: string;
  serviceName: string;
  serviceCategory: string;
  pricingModel: ServicePricingModel;
  quantity: number;
  unitPrice: number;
  duration?: number; // hours or days
  attendeeCount?: number;
  unit?: string;
  subtotal: number;
  notes?: string;
}

export interface ServiceCategory {
  id: string;
  service_category: string;
  service_name: string;
  description: string;
  pricing_model: ServicePricingModel;
  min_price: number;
  max_price: number;
  avg_price: number;
  currency: string;
  unit: string;
  popular: boolean;
  icon_name: string;
  tags: string[];
}

export function calculateServiceCost(
  service: ServiceCategory | ServiceLineItem,
  quantity: number,
  duration?: number,
  attendeeCount?: number
): number {
  const pricingModel = 'pricingModel' in service ? service.pricingModel : service.pricing_model;
  const basePrice = 'unitPrice' in service ? service.unitPrice : service.avg_price;
  
  let cost = 0;
  
  switch (pricingModel) {
    case 'hourly':
    case 'daily':
      cost = basePrice * (duration || 1) * quantity;
      break;
    case 'per_person':
      cost = basePrice * (attendeeCount || 1) * quantity;
      break;
    case 'per_word':
    case 'per_page':
      cost = basePrice * quantity;
      break;
    case 'per_event':
    case 'fixed':
      cost = basePrice * quantity;
      break;
  }
  
  return Math.round(cost);
}

export function formatServiceCost(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPricingInputLabel(pricingModel: ServicePricingModel): string {
  switch (pricingModel) {
    case 'hourly':
      return 'Duration (hours)';
    case 'daily':
      return 'Duration (days)';
    case 'per_person':
      return 'Number of attendees';
    case 'per_word':
      return 'Number of words';
    case 'per_page':
      return 'Number of pages';
    case 'per_event':
    case 'fixed':
      return 'Quantity';
  }
}

export function getServiceUnit(pricingModel: ServicePricingModel, unit?: string): string {
  if (unit) return unit;
  
  switch (pricingModel) {
    case 'hourly':
      return 'hour';
    case 'daily':
      return 'day';
    case 'per_person':
      return 'person';
    case 'per_word':
      return 'word';
    case 'per_page':
      return 'page';
    case 'per_event':
      return 'event';
    case 'fixed':
      return 'item';
  }
}
