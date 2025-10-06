
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Users, User, MapPin } from 'lucide-react';

interface VictoriaFallsPackageCardProps {
  isCouple: boolean;
  onBookNow: () => void;
}

const VictoriaFallsPackageCard: React.FC<VictoriaFallsPackageCardProps> = ({ isCouple, onBookNow }) => {
  return (
    <Card className="relative">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isCouple ? (
            <Users className="h-8 w-8 text-bantu-orange" />
          ) : (
            <MapPin className="h-8 w-8 text-bantu-orange" />
          )}
        </div>
        <CardTitle className="text-xl">Victoria Falls Only</CardTitle>
        <div className="text-2xl font-bold text-bantu-orange">
          {isCouple ? '$5,300' : '$3,500'}
        </div>
        <p className="text-sm text-gray-500">
          {isCouple ? 'Couple Package' : 'Individual Package'}
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
                <span className="text-sm">All Victoria Falls experiences × 2</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">The Smoke That Thunders event access for two</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Romantic sunset cruise</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Victoria Falls adventure (3 nights)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">The Smoke That Thunders event participation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">All Victoria Falls activities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Lion encounter & safari</span>
              </li>
            </>
          )}
        </ul>
        <Button className="w-full" onClick={onBookNow}>
          Book Victoria Falls {isCouple ? 'Couple' : 'Only'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VictoriaFallsPackageCard;
