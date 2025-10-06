import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { authLogger } from '@/utils/logger';
import { announceToScreenReader, LoadingStateAnnouncer } from './AccessibilityFeatures';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          authLogger.error('Auth callback error', { error, errorDescription });
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          
          toast({
            title: 'Authentication Error',
            description: errorDescription || 'Failed to authenticate',
            variant: 'destructive'
          });
          
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Check for successful authentication
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken || user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Get redirect parameter or default to dashboard
          const redirect = searchParams.get('redirect') || '/dashboard';
          
          toast({
            title: 'Welcome!',
            description: 'You have been successfully signed in'
          });
          
          setTimeout(() => {
            navigate(decodeURIComponent(redirect));
          }, 1500);
          return;
        }
        
        // If no user after loading, redirect to login
        if (!loading && !user) {
          setStatus('error');
          setMessage('Authentication session not found');
          setTimeout(() => navigate('/login'), 2000);
        }
        
      } catch (error) {
        authLogger.error('Auth callback processing error', error);
        setStatus('error');
        setMessage('Failed to process authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    // Wait for auth loading to complete
    if (!loading) {
      handleAuthCallback();
    }
  }, [searchParams, navigate, user, loading, toast]);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Loader2 className="w-12 h-12 animate-spin text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <LoadingStateAnnouncer 
        isLoading={status === 'loading'}
        loadingText="Processing authentication"
        completedText={status === 'success' ? 'Authentication successful' : 'Authentication failed'}
      />
      <motion.div 
        className="max-w-md w-full bg-card rounded-2xl shadow-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          {renderIcon()}
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-card-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </motion.h1>
        
        <motion.p 
          className={`text-sm ${getStatusColor()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>
        
        {status === 'error' && (
          <motion.button
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/login')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Back to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;