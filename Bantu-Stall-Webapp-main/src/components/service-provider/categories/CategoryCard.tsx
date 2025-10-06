
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CategoryContent {
  content: React.ReactNode;
}

export interface CategoryProps {
  id: string;
  name: string;
  description: string;
  content: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryProps> = ({
  id,
  name,
  description,
  content,
  isExpanded,
  onToggle,
}) => {
  return (
    <Card key={id} className={`border ${isExpanded ? 'border-primary' : ''}`}>
      <CardHeader className="py-3 cursor-pointer" onClick={() => onToggle(id)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Badge className="mr-2">✅</Badge>
            <CardTitle className="text-base font-medium">{name}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {!isExpanded && (
          <CardDescription className="ml-8">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <CardDescription className="mb-4">
            {description}
          </CardDescription>
          {content}
        </CardContent>
      )}
    </Card>
  );
};
