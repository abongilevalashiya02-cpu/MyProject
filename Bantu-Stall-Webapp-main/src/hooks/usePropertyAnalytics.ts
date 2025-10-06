import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyAnalytics {
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  rejectedListings: number;
  averageCapacity: number;
  topLocations: Array<{ location: string; count: number }>;
  propertyTypes: Array<{ type: string; count: number }>;
  monthlyGrowth: Array<{ month: string; count: number }>;
  conversionRate: number;
  popularAmenities: Array<{ amenity: string; count: number }>;
  priceRanges: Array<{ range: string; count: number }>;
}

export const usePropertyAnalytics = (dateRange?: { start: Date; end: Date }) => {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all property listings with date filtering
      let query = supabase.from('property_listings').select('*');
      
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      const { data: properties, error } = await query;

      if (error) throw error;

      if (!properties || properties.length === 0) {
        setAnalytics({
          totalListings: 0,
          approvedListings: 0,
          pendingListings: 0,
          rejectedListings: 0,
          averageCapacity: 0,
          topLocations: [],
          propertyTypes: [],
          monthlyGrowth: [],
          conversionRate: 0,
          popularAmenities: [],
          priceRanges: []
        });
        return;
      }

      // Calculate basic stats
      const totalListings = properties.length;
      const approvedListings = properties.filter(p => p.status === 'approved').length;
      const pendingListings = properties.filter(p => p.status === 'pending').length;
      const rejectedListings = properties.filter(p => p.status === 'rejected').length;

      // Calculate average capacity
      const totalCapacity = properties.reduce((sum, p) => sum + (p.max_capacity || 0), 0);
      const averageCapacity = totalCapacity / totalListings;

      // Top locations
      const locationCounts = properties.reduce((acc, p) => {
        acc[p.location] = (acc[p.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Property types
      const typeCounts = properties.reduce((acc, p) => {
        acc[p.property_type] = (acc[p.property_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const propertyTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Monthly growth (last 12 months)
      const monthlyGrowth = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = date.toISOString();
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
        
        const monthCount = properties.filter(p => 
          p.created_at >= monthStart && p.created_at <= monthEnd
        ).length;

        monthlyGrowth.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          count: monthCount
        });
      }

      // Conversion rate (approved / total)
      const conversionRate = totalListings > 0 ? (approvedListings / totalListings) * 100 : 0;

      // Popular amenities
      const amenityCounts = properties.reduce((acc, p) => {
        (p.amenities || []).forEach(amenity => {
          acc[amenity] = (acc[amenity] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const popularAmenities = Object.entries(amenityCounts)
        .map(([amenity, count]) => ({ amenity, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Price ranges
      const priceCounts = properties.reduce((acc, p) => {
        acc[p.price_range_usd] = (acc[p.price_range_usd] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const priceRanges = Object.entries(priceCounts)
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => b.count - a.count);

      setAnalytics({
        totalListings,
        approvedListings,
        pendingListings,
        rejectedListings,
        averageCapacity: Math.round(averageCapacity),
        topLocations,
        propertyTypes,
        monthlyGrowth,
        conversionRate: Math.round(conversionRate * 100) / 100,
        popularAmenities,
        priceRanges
      });

    } catch (error: any) {
      console.error('Error fetching property analytics:', error);
      toast({
        title: "Error loading analytics",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  return { analytics, loading, refetch: fetchAnalytics };
};