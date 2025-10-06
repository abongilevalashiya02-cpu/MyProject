import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCategory } from '@/utils/serviceCosting';

export const useServiceCatalog = (filters?: {
  category?: string;
  popular?: boolean;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ['service-catalog', filters],
    queryFn: async () => {
      let query = supabase
        .from('service_catalog')
        .select('*')
        .order('popular', { ascending: false })
        .order('service_category')
        .order('service_name');

      if (filters?.category) {
        query = query.eq('service_category', filters.category);
      }

      if (filters?.popular !== undefined) {
        query = query.eq('popular', filters.popular);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
};

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_catalog')
        .select('service_category, min_price, max_price, icon_name, tags')
        .order('service_category');

      if (error) throw error;

      // Group by category with aggregated data
      const categoryMap = new Map<string, {
        name: string;
        minPrice: number;
        maxPrice: number;
        icon: string;
        tags: string[];
        count: number;
      }>();

      data.forEach((item: any) => {
        const existing = categoryMap.get(item.service_category);
        if (existing) {
          existing.minPrice = Math.min(existing.minPrice, item.min_price);
          existing.maxPrice = Math.max(existing.maxPrice, item.max_price);
          existing.count += 1;
          existing.tags = [...new Set([...existing.tags, ...item.tags])];
        } else {
          categoryMap.set(item.service_category, {
            name: item.service_category,
            minPrice: item.min_price,
            maxPrice: item.max_price,
            icon: item.icon_name || 'Package',
            tags: item.tags || [],
            count: 1,
          });
        }
      });

      return Array.from(categoryMap.values());
    },
  });
};
