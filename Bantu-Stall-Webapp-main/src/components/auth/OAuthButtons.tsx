import React, { useState } from 'react';
import { Chrome, Linkedin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { authLogger } from '@/utils/logger';
import { useRenderPerformance, useStableCallback } from '@/hooks/usePerformanceOptimization';

interface OAuthButtonsProps {
  mode: 'login' | 'signup';
  disabled?: boolean;
  className?: string;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ 
  mode, 
  disabled = false,
  className = ""
}) => {
  useRenderPerformance('OAuthButtons');
  
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleOAuthLogin = useStableCallback(async (provider: 'google' | 'linkedin_oidc') => {
    if (disabled || loadingProvider) return;
    
    setLoadingProvider(provider);
    authLogger.info(`Starting OAuth ${mode} with ${provider}`);
    
    try {
      const { error, data } = await signIn(provider, '');
      
      if (error) {
        throw new Error(error.message || `Failed to ${mode} with ${provider}`);
      }
      
      // OAuth redirect handling
      if (data && typeof data === 'object' && 'url' in data && typeof data.url === 'string') {
        authLogger.info(`OAuth redirect URL received for ${provider}`);
        window.location.href = data.url;
      } else {
        // Fallback redirect
        authLogger.warn(`No OAuth URL received, using fallback redirect for ${provider}`);
        window.location.href = '/auth/callback';
      }
    } catch (error) {
      authLogger.error(`OAuth ${mode} failed for ${provider}`, error);
      toast({
        title: `${provider === 'google' ? 'Google' : 'LinkedIn'} ${mode} failed`,
        description: error instanceof Error ? error.message : `Could not ${mode} with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setLoadingProvider(null);
    }
  });

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground font-medium">
            Or {mode} with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          <Button 
            onClick={() => handleOAuthLogin('google')}
            disabled={disabled || loadingProvider === 'google'}
            className="w-full flex items-center justify-center bg-background hover:bg-muted text-foreground border border-border rounded-xl py-3 transition-all shadow-sm"
            type="button"
            variant="outline"
          >
            {loadingProvider === 'google' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-5 w-5 text-blue-600" />
            )}
            Google
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          <Button 
            onClick={() => handleOAuthLogin('linkedin_oidc')}
            disabled={disabled || loadingProvider === 'linkedin_oidc'}
            className="w-full flex items-center justify-center bg-[#0077B5] hover:bg-[#0077B5]/90 text-white rounded-xl py-3 transition-all shadow-sm disabled:opacity-50"
            type="button"
          >
            {loadingProvider === 'linkedin_oidc' ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Linkedin className="mr-2 h-5 w-5" />
            )}
            LinkedIn
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OAuthButtons;