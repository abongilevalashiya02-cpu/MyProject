import React, { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useGlobalStore } from '@/stores/globalStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  onMarkRead?: (id: string) => void;
  onClose?: (id: string) => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  timestamp,
  read,
  onMarkRead,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 mb-3 transition-all duration-200",
        getBgColor(),
        !read && "ring-2 ring-bantu-orange ring-opacity-20"
      )}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {timestamp.toLocaleTimeString()}
              </span>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClose(id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-1">{message}</p>
          {!read && onMarkRead && (
            <Button
              variant="link"
              size="sm"
              onClick={() => onMarkRead(id)}
              className="text-xs p-0 h-auto mt-2 text-bantu-orange"
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Global notification manager component
export const NotificationManager: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useGlobalStore();
  const [lastNotificationId, setLastNotificationId] = React.useState<string | null>(null);

  useEffect(() => {
    // Auto-show toast notifications for new notifications
    const latestNotification = notifications[0];
    if (latestNotification && 
        !latestNotification.read && 
        latestNotification.id !== lastNotificationId) {
      
      setLastNotificationId(latestNotification.id);
      
      const toastOptions = {
        duration: 4000,
        position: 'top-right' as const,
      };

      switch (latestNotification.type) {
        case 'success':
          toast.success(latestNotification.message, toastOptions);
          break;
        case 'error':
          toast.error(latestNotification.message, toastOptions);
          break;
        case 'warning':
          toast(latestNotification.message, { 
            ...toastOptions,
            icon: '⚠️' 
          });
          break;
        case 'info':
          toast(latestNotification.message, toastOptions);
          break;
      }
    }
  }, [notifications, lastNotificationId]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

// In-app notification center
export const NotificationCenter: React.FC<{ className?: string }> = ({ className }) => {
  const { notifications, markNotificationAsRead, clearNotifications } = useGlobalStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className={cn("p-6 text-center text-gray-500", className)}>
        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Notifications {unreadCount > 0 && (
            <span className="ml-2 bg-bantu-orange text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearNotifications}>
            Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationComponent
            key={notification.id}
            {...notification}
            onMarkRead={markNotificationAsRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;
