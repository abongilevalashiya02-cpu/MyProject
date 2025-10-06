import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export const RealTimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: payload.new.type || 'info',
            title: payload.new.title,
            message: payload.new.message,
            timestamp: payload.new.created_at,
            read: false,
            action: payload.new.data?.action_url ? {
              label: payload.new.data?.action_label || 'View',
              url: payload.new.data?.action_url
            } : undefined
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Auto-open on new notification
          setIsOpen(true);
        }
      )
      .subscribe();

    // Fetch existing notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        const formattedNotifications: Notification[] = data.map((n: any) => ({
          id: n.id,
          type: n.type || 'info',
          title: n.title,
          message: n.message,
          timestamp: n.created_at,
          read: n.read || false,
          action: n.data?.action_url ? {
            label: n.data?.action_label || 'View',
            url: n.data?.action_url
          } : undefined
        }));
        
        setNotifications(formattedNotifications);
      }
    };

    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <Card>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="space-y-0">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={`h-4 w-4 mt-0.5 ${getTypeColor(notification.type)}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{notification.title}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                              {notification.action && (
                                <Button
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    window.location.href = notification.action!.url;
                                    markAsRead(notification.id);
                                  }}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="mt-2 text-xs"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};