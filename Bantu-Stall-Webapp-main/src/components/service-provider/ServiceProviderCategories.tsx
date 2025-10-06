
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { CategoryCard } from './categories/CategoryCard';
import { categoryData } from './categories/categoryData';

export const ServiceProviderCategories: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("tourGuides");

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Provider Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryData.map(category => (
          <CategoryCard 
            key={category.id}
            id={category.id}
            name={category.name}
            description={category.description}
            content={category.content}
            isExpanded={expandedCategory === category.id}
            onToggle={toggleCategory}
          />
        ))}
      </CardContent>
    </Card>
  );
};
