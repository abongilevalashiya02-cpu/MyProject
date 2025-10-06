
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, CheckCircle, Calendar, MessageCircle, Award, Plane } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsCenterProps {
  onClose: () => void;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ onClose }) => {
  const notifications = [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your safari experience in Kenya has been confirmed',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      id: '2',
      type: 'message',
      title: 'Message from Host',
      message: 'Amara sent you pre-arrival information for your Marrakech cooking class',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      icon: MessageCircle,
      iconColor: 'text-blue-500'
    },
    {
      id: '3',
      type: 'tokens',
      title: 'Culture Tokens Earned',
      message: 'You earned 25 tokens for completing your Tanzania experience',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: Award,
      iconColor: 'text-bantu-orange'
    },
    {
      id: '4',
      type: 'travel',
      title: 'Flight Reminder',
      message: 'Your flight to Cape Town is in 3 days - check-in now available',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      icon: Plane,
      iconColor: 'text-purple-500'
    },
    {
      id: '5',
      type: 'community',
      title: 'Abantu Activity',
      message: '3 travelers are currently in your city - connect for meetups',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      icon: MessageCircle,
      iconColor: 'text-indigo-500'
    }
  ];

  return (
    <Card className="w-80 max-h-96 overflow-hidden shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification, index) => {
            const IconComponent = notification.icon;
            
            return (
              <React.Fragment key={notification.id}>
                <div className={`p-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${notification.iconColor}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge className="bg-blue-500 text-white text-xs ml-2">New</Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(notification.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {index < notifications.length - 1 && <Separator />}
              </React.Fragment>
            );
          })}
        </div>
        
        <div className="p-3 border-t bg-gray-50">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsCenter;
