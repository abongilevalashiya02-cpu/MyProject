import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { authLogger } from '@/utils/logger';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    authLogger.error('useAuth called outside AuthProvider. Make sure all components using useAuth are wrapped in AuthProvider.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
