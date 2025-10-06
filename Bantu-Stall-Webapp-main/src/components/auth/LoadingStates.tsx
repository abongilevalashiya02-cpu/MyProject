import React from 'react';
import { Loader2, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLoadingProps {
  message?: string;
  submessage?: string;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({ 
  message = "Authenticating...", 
  submessage 
}) => (
  <motion.div 
    className="flex flex-col items-center justify-center p-8 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="mb-4"
    >
      <Loader2 className="w-8 h-8 text-primary" />
    </motion.div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
    {submessage && (
      <p className="text-sm text-muted-foreground">{submessage}</p>
    )}
  </motion.div>
);

interface AuthSuccessProps {
  message?: string;
  submessage?: string;
}

export const AuthSuccess: React.FC<AuthSuccessProps> = ({ 
  message = "Success!", 
  submessage 
}) => (
  <motion.div 
    className="flex flex-col items-center justify-center p-8 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: 'spring' }}
      className="mb-4"
    >
      <CheckCircle className="w-8 h-8 text-green-500" />
    </motion.div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
    {submessage && (
      <p className="text-sm text-muted-foreground">{submessage}</p>
    )}
  </motion.div>
);

interface FormLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FormLoadingSpinner: React.FC<FormLoadingSpinnerProps> = ({ 
  size = 'md', 
  className = "" 
}) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClass} ${className}`}
    >
      <Loader2 className={`${sizeClass} text-current`} />
    </motion.div>
  );
};

interface SecurityIndicatorProps {
  level: 'secure' | 'processing' | 'warning';
  message: string;
}

export const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({ 
  level, 
  message 
}) => {
  const getIcon = () => {
    switch (level) {
      case 'secure':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'warning':
        return <Shield className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getColorClass = () => {
    switch (level) {
      case 'secure':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'processing':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'warning':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <motion.div 
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs border ${getColorClass()}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {getIcon()}
      <span>{message}</span>
    </motion.div>
  );
};