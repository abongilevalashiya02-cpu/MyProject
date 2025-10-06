
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Low Sales Warning",
      message: "Your bookings are down 20% this week. Consider running a promotion!",
      icon: TrendingDown,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      action: "View Analytics"
    },
    {
      id: 2,
      type: "opportunity",
      title: "High Demand Notice",
      message: "Cape Town Food Tour is trending! Increase availability to maximize sales.",
      icon: TrendingUp,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      action: "Update Calendar"
    },
    {
      id: 3,
      type: "alert",
      title: "Low Engagement Alert",
      message: "Your Serengeti Safari listing hasn't received interactions in 10 days. Update details or refresh marketing.",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      action: "Edit Listing"
    },
    {
      id: 4,
      type: "positive",
      title: "New Review Notification",
      message: "You received a 5-star review on Marrakech Cooking Class!",
      icon: Star,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      action: "View Review"
    },
    {
      id: 5,
      type: "info",
      title: "Payout Reminder",
      message: "Your next payout of $3,450 is scheduled for July 15.",
      icon: DollarSign,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      action: "View Details"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Custom Alerts & Notifications</h3>
        <span className="text-sm text-gray-500">{alerts.length} new alerts</span>
      </div>
      
      <div className="space-y-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`p-4 border-l-4 ${alert.bgColor}`}>
            <div className="flex">
              <div className="mr-4">
                <div className={`p-2 rounded-full ${alert.bgColor}`}>
                  <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-gray-600 my-1">{alert.message}</p>
                <Button variant="link" size="sm" className="px-0">
                  {alert.action}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline">Mark All As Read</Button>
        <Button variant="outline">Notification Settings</Button>
      </div>
    </div>
  );
};

export default CustomAlerts;
