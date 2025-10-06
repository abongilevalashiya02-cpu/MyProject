
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Users, User } from 'lucide-react';

interface FullExperiencePackageCardProps {
  isCouple: boolean;
  onBookNow: () => void;
}

const FullExperiencePackageCard: React.FC<FullExperiencePackageCardProps> = ({ isCouple, onBookNow }) => {
  return (
    <Card className={`relative ${isCouple ? 'border-bantu-orange border-2' : ''}`}>
      {isCouple && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bantu-orange">
          Most Popular
        </Badge>
      )}
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isCouple ? (
            <Users className="h-8 w-8 text-bantu-orange" />
          ) : (
            <User className="h-8 w-8 text-bantu-orange" />
          )}
        </div>
        <CardTitle className="text-xl">Full Experience</CardTitle>
        <div className="text-2xl font-bold text-bantu-orange">
          {isCouple ? '$7,800' : '$5,000'}
        </div>
        <p className="text-sm text-gray-500">
          Originally {isCouple ? '$8,300' : '$5,500'} - Save $500!
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {isCouple ? (
            <>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Shared luxury accommodation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">All experiences × 2</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">G20 side events access for two</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">The Smoke That Thunders event access for two</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Significant savings per person</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Johannesburg experience (2 nights)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Victoria Falls adventure (3 nights)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">G20 side events access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">The Smoke That Thunders event participation</span>
              </li>
            </>
          )}
        </ul>
        <Button 
          className={`w-full ${isCouple ? 'bg-bantu-orange hover:bg-bantu-orange/90' : ''}`} 
          onClick={onBookNow}
        >
          Book Full Experience
        </Button>
      </CardContent>
    </Card>
  );
};

export default FullExperiencePackageCard;
