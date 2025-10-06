import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Settings, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  orderUpdates: boolean;
  newVendors: boolean;
  systemAlerts: boolean;
  marketingUpdates: boolean;
  weeklyReports: boolean;
}

export const PushNotificationManager: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    newVendors: true,
    systemAlerts: true,
    marketingUpdates: false,
    weeklyReports: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationSupport();
    loadNotificationSettings();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await subscribeToNotifications();
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Notifications were blocked. You can enable them in browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission",
        variant: "destructive",
      });
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      setSubscription(subscription);
      
      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          settings
        }),
      });

    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe to notifications",
        variant: "destructive",
      });
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        
        // Remove subscription from backend
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });

        toast({
          title: "Unsubscribed",
          description: "You won't receive push notifications anymore",
        });
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }
  };

  const updateNotificationSettings = async (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    
    try {
      await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      toast({
        title: "Settings Updated",
        description: "Notification preferences saved",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Bantu Stall',
        icon: '/bantu-stall-logo.png',
        badge: '/favicon.ico',
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Not Set</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Stay updated with real-time notifications about your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notification Status</p>
              <p className="text-sm text-muted-foreground">
                Current permission level
              </p>
            </div>
            {getPermissionStatus()}
          </div>

          <div className="flex gap-2">
            {permission !== 'granted' ? (
              <Button onClick={requestNotificationPermission} disabled={!isSupported}>
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            ) : (
              <>
                <Button onClick={sendTestNotification} variant="outline">
                  Send Test
                </Button>
                <Button onClick={unsubscribeFromNotifications} variant="destructive">
                  <BellOff className="h-4 w-4 mr-2" />
                  Disable
                </Button>
              </>
            )}
          </div>

          {!isSupported && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Push notifications are not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...settings, [key]: checked };
                    updateNotificationSettings(newSettings);
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Your latest notification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock notification history */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">New order received</p>
                <p className="text-xs text-muted-foreground">Order #BNT-001 from John Doe</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Vendor registration approved</p>
                <p className="text-xs text-muted-foreground">Sarah's Kitchen has been approved</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="bg-yellow-500 rounded-full p-1">
                <Bell className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">System maintenance scheduled</p>
                <p className="text-xs text-muted-foreground">Planned downtime: Tonight 11 PM - 1 AM</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Utility functions
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    orderUpdates: 'Get notified when orders are placed, updated, or completed',
    newVendors: 'Receive alerts when new vendors register on the platform',
    systemAlerts: 'Important system notifications and security alerts',
    marketingUpdates: 'Promotional content and feature announcements',
    weeklyReports: 'Weekly summary of your business performance',
  };
  return descriptions[key] || '';
}
