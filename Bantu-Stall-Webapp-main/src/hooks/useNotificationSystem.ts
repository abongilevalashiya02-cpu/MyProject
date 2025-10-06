import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

interface NotificationFilters {
  type?: string;
  read?: boolean;
  limit?: number;
}

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Fetch notifications from database (would need to create notifications table)
  const fetchNotifications = async (filters: NotificationFilters = {}) => {
    try {
      setLoading(true);
      
      // For now, we'll create mock notifications since the table doesn't exist
      // In a real implementation, this would query a notifications table
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Property Listing',
          message: 'A new property "Luxury Safari Lodge" has been submitted for review',
          type: 'info',
          read: false,
          created_at: new Date().toISOString(),
          action_url: '/admin/properties',
          metadata: { property_id: '123' }
        },
        {
          id: '2',
          title: 'Property Approved',
          message: 'Mountain View Resort has been approved and is now live',
          type: 'success',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          action_url: '/admin/properties'
        },
        {
          id: '3',
          title: 'Security Alert',
          message: 'Multiple failed login attempts detected',
          type: 'warning',
          read: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          action_url: '/admin/security'
        }
      ];

      let filteredNotifications = mockNotifications;

      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
      }

      if (filters.read !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.read === filters.read);
      }

      if (filters.limit) {
        filteredNotifications = filteredNotifications.slice(0, filters.limit);
      }

      setNotifications(filteredNotifications);
      setUnreadCount(filteredNotifications.filter(n => !n.read).length);

    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error loading notifications",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // In a real implementation, this would update the database
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));

      toast({
        title: "Notification marked as read"
      });

    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error updating notification",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would update all unread notifications in the database
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);

      toast({
        title: "All notifications marked as read"
      });

    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error updating notifications",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      // In a real implementation, this would delete from the database
      const notification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      toast({
        title: "Notification deleted"
      });

    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error deleting notification",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Create a new notification (for system use)
  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        read: false
      };

      // In a real implementation, this would insert into the database
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default'
      });

      return newNotification;

    } catch (error: any) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error creating notification",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for notifications (if table exists)
    // const subscription = supabase
    //   .channel('notifications')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, 
    //     (payload) => {
    //       fetchNotifications();
    //     })
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };
};