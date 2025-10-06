
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const { user } = useRequireAuth('/login');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (error) throw error;
        
        setIsAdmin(!!data);
        
        if (!data) {
          toast.error("You don't have permission to access the admin area");
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        toast.error("An error occurred while checking permissions");
        navigate('/');
      }
    };
    
    checkAdminRole();
  }, [user, navigate]);

  return { isAdmin, user };
};
