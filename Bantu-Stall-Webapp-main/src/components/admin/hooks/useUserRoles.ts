
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserWithRoles, AppRole } from '../types/roleTypes';

export const useUserRoles = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First get all users with roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Get unique user IDs
      const userIds = [...new Set(rolesData.map(role => role.user_id))];
      
      // For each user ID, fetch email from auth.users
      const usersWithRoles: UserWithRoles[] = [];
      
      // Organize roles by user
      for (const userId of userIds) {
        const roles = rolesData
          .filter(role => role.user_id === userId)
          .map(role => role.role as AppRole);
          
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userData && !userError && userData.user) {
          usersWithRoles.push({
            id: userId,
            email: userData.user.email || 'Unknown',
            roles: roles
          });
        }
      }
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users and roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, fetchUsers };
};
