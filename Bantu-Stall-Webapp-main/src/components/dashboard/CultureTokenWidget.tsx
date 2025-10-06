
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, QrCode, Clock, Coins, Map, Star, Gift, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CultureTokenWidget = () => {
  const [isEarnOpen, setIsEarnOpen] = React.useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-bantu-orange" />
            Culture Tokens
          </CardTitle>
          <Badge className="bg-gradient-to-r from-bantu-orange to-bantu-yellow text-white">
            425 Tokens
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual Progress with Stamps */}
          <div className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Star className="mr-2 h-4 w-4 text-bantu-orange" />
              Stamp Collection Progress
            </h4>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((stamp) => (
                <div 
                  key={stamp}
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    stamp <= 3 
                      ? 'bg-bantu-orange text-white border-bantu-orange' 
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                >
                  {stamp <= 3 ? '★' : stamp}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-600">
              3 of 5 stamps collected • 2 more for VIP rewards
            </div>
          </div>

          {/* Ways to Earn Dropdown */}
          <Collapsible open={isEarnOpen} onOpenChange={setIsEarnOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm">
                <span className="flex items-center">
                  <Coins className="mr-2 h-4 w-4" />
                  Ways to Earn
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isEarnOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {[
                { action: 'Complete an experience', tokens: '+50', icon: '🎯' },
                { action: 'Share on social media', tokens: '+15', icon: '📱' },
                { action: 'Write a review', tokens: '+25', icon: '✍️' },
                { action: 'Refer a friend', tokens: '+100', icon: '👥' },
                { action: 'Complete learning module', tokens: '+30', icon: '📚' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <span className="flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.action}
                  </span>
                  <span className="text-green-600 font-medium">{item.tokens}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Ways to Redeem Dropdown */}
          <Collapsible open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm">
                <span className="flex items-center">
                  <Gift className="mr-2 h-4 w-4" />
                  Ways to Redeem
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isRedeemOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {[
                { reward: 'VIP Lounge Access', tokens: '500', available: true },
                { reward: 'Free Cooking Class', tokens: '750', available: false },
                { reward: '20% Experience Discount', tokens: '300', available: true },
                { reward: 'Cultural Tour Upgrade', tokens: '1000', available: false }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center text-sm p-2 rounded ${
                  item.available ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}>
                  <span className={item.available ? 'text-green-800' : 'text-gray-600'}>
                    {item.reward}
                  </span>
                  <Badge className={item.available ? 'bg-green-500' : 'bg-gray-400'}>
                    {item.tokens} tokens
                  </Badge>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Nearest Redemption Locations */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Map className="mr-2 h-4 w-4 text-gray-500" />
              Nearby Redemption Spots
            </h4>
            <div className="space-y-2">
              {[
                { name: 'African Arts Gallery', distance: '0.5 km', tokens: 50 },
                { name: 'Taste of Africa Restaurant', distance: '1.2 km', tokens: 100 }
              ].map((place, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <div>{place.name}</div>
                    <div className="text-xs text-gray-500">{place.distance} away</div>
                  </div>
                  <Badge variant="outline" className="text-bantu-orange border-bantu-orange">
                    {place.tokens} tokens
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp Campaigns */}
          <div className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mb-2 text-bantu-orange border-bantu-orange hover:bg-bantu-orange/10"
            >
              View Current Stamp Campaigns
            </Button>
            
            <Button 
              className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
              size="sm"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Use at African-owned shops near me
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CultureTokenWidget;
