
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';


export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, loading };
}
