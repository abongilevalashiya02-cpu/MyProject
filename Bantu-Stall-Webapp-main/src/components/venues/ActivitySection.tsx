
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityCategories } from '@/data/activityCategories';
import { Activity, ChefHat, Brain, Flower2, TreePine, Palette } from 'lucide-react';

interface ActivitySectionProps {
  venueActivities: string[];
  className?: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ 
  venueActivities, 
  className = "" 
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

  const getVenueActivityCategories = () => {
    return activityCategories.filter(category => {
      return venueActivities.some(activity => 
        category.examples.some(example => 
          activity.toLowerCase().includes(example.toLowerCase()) ||
          example.toLowerCase().includes(activity.toLowerCase())
        )
      );
    });
  };

  const matchedCategories = getVenueActivityCategories();

  if (matchedCategories.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Activity Specializations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matchedCategories.map((category) => (
            <div key={category.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-bantu-orange/10 rounded-full">
                {getIcon(category.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-bantu-orange">{category.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                <div className="flex flex-wrap gap-1">
                  {venueActivities
                    .filter(activity => 
                      category.examples.some(example => 
                        activity.toLowerCase().includes(example.toLowerCase()) ||
                        example.toLowerCase().includes(activity.toLowerCase())
                      )
                    )
                    .map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
