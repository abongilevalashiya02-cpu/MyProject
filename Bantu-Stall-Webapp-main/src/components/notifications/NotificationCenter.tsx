import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationSystem, Notification } from '@/hooks/useNotificationSystem';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationSystem();
  const navigate = useNavigate();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      navigate(notification.action_url);
      setIsOpen(false);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                <TabsTrigger value="unread" className="relative">
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-96">
                <TabsContent value="unread" className="mt-0">
                  <div className="space-y-2 px-4 pb-4">
                    {loading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
                        ))}
                      </div>
                    ) : unreadNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">All caught up!</p>
                      </div>
                    ) : (
                      unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onNotificationClick={handleNotificationClick}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                          getIcon={getNotificationIcon}
                          getBgColor={getNotificationBgColor}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  <div className="space-y-2 px-4 pb-4">
                    {loading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onNotificationClick={handleNotificationClick}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                          getIcon={getNotificationIcon}
                          getBgColor={getNotificationBgColor}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: Notification['type']) => React.ReactNode;
  getBgColor: (type: Notification['type']) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  getIcon,
  getBgColor
}) => {
  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
        notification.read ? 'bg-background' : getBgColor(notification.type)
      }`}
      onClick={() => onNotificationClick(notification)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {getIcon(notification.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium truncate">{notification.title}</h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
              <div className="flex items-center space-x-1">
                {notification.action_url && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-1 mt-2" onClick={(e) => e.stopPropagation()}>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            className="h-6 w-6 p-0"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(notification.id)}
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;