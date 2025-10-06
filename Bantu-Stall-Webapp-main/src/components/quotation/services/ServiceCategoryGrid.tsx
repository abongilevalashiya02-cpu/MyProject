import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';
import { formatServiceCost } from '@/utils/serviceCosting';
import { Search } from 'lucide-react';

interface ServiceCategoryGridProps {
  categories: Array<{
    name: string;
    minPrice: number;
    maxPrice: number;
    icon: string;
    tags: string[];
    count: number;
  }>;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ServiceCategoryGrid: React.FC<ServiceCategoryGridProps> = ({
  categories,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const IconComponent = (Icons as any)[category.icon] || Icons.Package;
          
          return (
            <Card
              key={category.name}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
              onClick={() => onSelectCategory(category.name)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatServiceCost(category.minPrice)} - {formatServiceCost(category.maxPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.count} service{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {category.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No services found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};
