
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityCategories } from '@/data/activityCategories';
import { Activity, ChefHat, Brain, Flower2, TreePine, Palette, Star } from 'lucide-react';
import { VenueType } from '@/types/venues';

interface ActivitySpecializationsProps {
  venue: VenueType;
  showAllActivities?: boolean;
}

const ActivitySpecializations: React.FC<ActivitySpecializationsProps> = ({ 
  venue, 
  showAllActivities = false 
}) => {
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case 'Activity': return <Activity {...iconProps} />;
      case 'ChefHat': return <ChefHat {...iconProps} />;
      case 'Brain': return <Brain {...iconProps} />;
      case 'Flower2': return <Flower2 {...iconProps} />;
      case 'TreePine': return <TreePine {...iconProps} />;
      case 'Palette': return <Palette {...iconProps} />;
      default: return <Star {...iconProps} />;
    }
  };

  const getVenueActivityCategories = () => {
    return activityCategories.filter(category => {
      return venue.activities.some(activity => 
        category.examples.some(example => 
          activity.toLowerCase().includes(example.toLowerCase()) ||
          example.toLowerCase().includes(activity.toLowerCase())
        )
      );
    });
  };

  const matchedCategories = getVenueActivityCategories();

  if (matchedCategories.length === 0 && venue.activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Activity Categories */}
      {matchedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-bantu-orange" />
              Activity Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedCategories.map((category) => (
                <div key={category.id} className="p-4 bg-gradient-to-br from-bantu-orange/5 to-bantu-yellow/5 rounded-lg border">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 bg-bantu-orange/10 rounded-full">
                      {getIcon(category.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-bantu-orange mb-1">{category.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Available at this venue:</p>
                        <div className="flex flex-wrap gap-1">
                          {venue.activities
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Activities */}
      {showAllActivities && venue.activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Available Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {venue.activities.map((activity, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {activity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivitySpecializations;
