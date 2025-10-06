
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityCategories } from '@/data/activityCategories';
import { Activity, ChefHat, Brain, Flower2, TreePine, Palette, X } from 'lucide-react';

interface ActivityFilterProps {
  selectedActivities: string[];
  onActivityToggle: (activityId: string) => void;
  onClearAll: () => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  selectedActivities,
  onActivityToggle,
  onClearAll
}) => {
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (iconName) {
      case 'Activity': return <Activity {...iconProps} />;
      case 'ChefHat': return <ChefHat {...iconProps} />;
      case 'Brain': return <Brain {...iconProps} />;
      case 'Flower2': return <Flower2 {...iconProps} />;
      case 'TreePine': return <TreePine {...iconProps} />;
      case 'Palette': return <Palette {...iconProps} />;
      default: return <Activity {...iconProps} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Activity Categories</CardTitle>
          {selectedActivities.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activityCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedActivities.includes(category.id)
                    ? 'bg-bantu-orange/10 border-bantu-orange'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onActivityToggle(category.id)}
              >
                <div className={`p-2 rounded-full ${
                  selectedActivities.includes(category.id)
                    ? 'bg-bantu-orange text-white'
                    : 'bg-gray-100'
                }`}>
                  {getIcon(category.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              </div>
              
              {selectedActivities.includes(category.id) && (
                <div className="ml-12 space-y-1">
                  <p className="text-xs font-medium text-gray-700">Examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.slice(0, 3).map((example, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                    {category.examples.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.examples.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFilter;
