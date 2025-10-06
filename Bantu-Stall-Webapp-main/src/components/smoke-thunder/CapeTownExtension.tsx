
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface CapeTownExtensionProps {
  onBookNow: () => void;
}

const CapeTownExtension: React.FC<CapeTownExtensionProps> = ({ onBookNow }) => {
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <Card className="relative">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="text-bantu-orange border-bantu-orange">
              ADD-ON OPTION
            </Badge>
          </div>
          <CardTitle className="text-2xl">Cape Town Extension</CardTitle>
          <div className="text-3xl font-bold text-bantu-orange">+$2,200 Individual / +$3,000 Couple</div>
          <p className="text-sm text-gray-500">Available with any package above</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Table Mountain cable car</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cape Peninsula tour</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Penguin colony visit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Luxury vehicle with tour guide (24/7)</span>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Wine tram or botanical garden</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">3 additional nights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All transfers included</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white" 
              onClick={onBookNow}
            >
              Add Cape Town Extension
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapeTownExtension;
