
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Map, MapPin, ChartBar, Users } from 'lucide-react';

type UserType = 'traveler' | 'host' | 'abantu' | 'creator';

interface DashboardHeaderProps {
  userType: UserType;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userType }) => {
  const getUserTitle = () => {
    switch(userType) {
      case 'traveler': return 'Traveler Dashboard';
      case 'host': return 'Host Dashboard';
      case 'abantu': return 'Abantu Member Dashboard';
      case 'creator': return 'Experience Creator Dashboard';
      default: return 'User Dashboard';
    }
  };

  const getUserBadge = () => {
    switch(userType) {
      case 'traveler': return {
        text: 'Cultural Explorer',
        className: 'bg-green-100 text-green-700'
      };
      case 'host': return {
        text: 'Experience Host',
        className: 'bg-purple-100 text-purple-700'
      };
      case 'abantu': return {
        text: 'Premium Member',
        className: 'bg-bantu-orange/10 text-bantu-orange'
      };
      case 'creator': return {
        text: 'Experience Creator',
        className: 'bg-blue-100 text-blue-700'
      };
      default: return {
        text: 'User',
        className: 'bg-gray-100 text-gray-700'
      };
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{getUserTitle()}</h1>
            <Badge className={`text-sm px-3 py-1 rounded-full ${getUserBadge().className}`}>
              {getUserBadge().text}
            </Badge>
          </div>
          
          {userType === 'traveler' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1 text-bantu-orange" />
                <span>3 Upcoming Bookings</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-bantu-orange" />
                <span>Next: Cape Town, South Africa</span>
              </div>
            </div>
          )}
          
          {userType === 'creator' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <ChartBar className="h-4 w-4 mr-1 text-bantu-orange" />
                <span>$24,560 Revenue This Month</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1 text-bantu-orange" />
                <span>184 Total Bookings</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
