import { useContext } from 'react';
import { AppStateContext } from '@/contexts/AppStateContext';

export function useAppUser() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppUser must be used within AppStateProvider');
  return context.state.user;
}
