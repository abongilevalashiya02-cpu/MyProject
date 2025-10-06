
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-col space-y-2">
      {categories.map(category => (
        <Button
          key={category}
          variant="ghost"
          className={`justify-start px-4 py-2 h-auto ${
            selectedCategory === category 
              ? 'text-bantu-orange font-medium' 
              : 'text-gray-600 hover:text-bantu-orange'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
