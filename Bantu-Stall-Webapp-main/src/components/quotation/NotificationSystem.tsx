import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type Notification = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
};

export type NotificationSystemProps = {
  notifications: Notification[];
  onDismiss: (id: string) => void;
};

const notificationConfig = {
  success: { icon: CheckCircle, color: 'bg-green-50 border-green-200 text-green-800' },
  error: { icon: AlertCircle, color: 'bg-red-50 border-red-200 text-red-800' },
  info: { icon: Info, color: 'bg-blue-50 border-blue-200 text-blue-800' },
  warning: { icon: AlertTriangle, color: 'bg-yellow-50 border-yellow-200 text-yellow-800' }
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  notifications, 
  onDismiss
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
    
    // Auto-dismiss notifications
    notifications.forEach(notification => {
      const duration = notification.duration || 5000; // Default 5 seconds
      setTimeout(() => {
        onDismiss(notification.id);
      }, duration);
    });
  }, [notifications, onDismiss]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 100, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: 100, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const config = notificationConfig[notification.type];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${config.color} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
                  <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
