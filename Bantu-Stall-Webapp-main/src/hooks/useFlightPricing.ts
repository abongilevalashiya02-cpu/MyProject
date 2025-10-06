import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FlightPricingParams {
  origin: string;
  destination: string;
  passengers: number;
  startDate?: string;
  endDate?: string;
}

interface FlightPricingResult {
  totalCost: number;
  pricePerPerson: number;
  currency: string;
  isEstimate: boolean;
  details: string;
}

interface UseFlightPricingReturn {
  flightPrice: FlightPricingResult | null;
  loading: boolean;
  error: string | null;
  fetchFlightPrice: (params: FlightPricingParams) => Promise<void>;
}

export const useFlightPricing = (): UseFlightPricingReturn => {
  const [flightPrice, setFlightPrice] = useState<FlightPricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlightPrice = async (params: FlightPricingParams) => {
    if (!params.origin || !params.destination || !params.passengers) {
      setFlightPrice(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('flight-pricing', {
        body: {
          origin: params.origin,
          destination: params.destination,
          passengers: params.passengers,
          startDate: params.startDate,
          endDate: params.endDate
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.success) {
        setFlightPrice(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch flight price');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flight price';
      setError(errorMessage);
      console.error('Flight pricing error:', err);
      
      // Fallback pricing
      setFlightPrice({
        totalCost: 0,
        pricePerPerson: 0,
        currency: 'USD',
        isEstimate: true,
        details: 'Unable to calculate flight price - please check origin location'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    flightPrice,
    loading,
    error,
    fetchFlightPrice
  };
};