
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from './types/roleTypes';

interface RoleAssignmentFormProps {
  onRoleAssigned: () => void;
}

// Define proper type for Supabase user objects
interface SupabaseUserData {
  id: string;
  email?: string;
}

const RoleAssignmentForm: React.FC<RoleAssignmentFormProps> = ({ onRoleAssigned }) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('user');
  const [submitting, setSubmitting] = useState(false);

  const addRoleToUser = async () => {
    if (!newUserEmail) {
      toast.error('Please enter a user email');
      return;
    }
    
    setSubmitting(true);
    try {
      // First, find the user by email to get their ID
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) throw userError;
      
      // We need to explicitly check if userData.users is defined
      if (!userData || !userData.users) {
        throw new Error('Failed to fetch users');
      }
      
      // Type assertion to help TypeScript understand the structure
      const users = userData.users as SupabaseUserData[];
      
      const targetUser = users.find(u => {
        // Ensure the user object and its email property exist
        return u && typeof u.email === 'string' && u.email === newUserEmail;
      });
      
      if (!targetUser) {
        toast.error('User not found. Make sure they have registered.');
        return;
      }
      
      // Check if user already has this role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUser.id)
        .eq('role', newUserRole)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingRole) {
        toast(`User already has the ${newUserRole} role`);
        return;
      }
      
      // Add the role - using the proper typed role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: targetUser.id, 
          role: newUserRole 
        });
        
      if (insertError) throw insertError;
      
      toast.success(`${newUserRole} role granted to ${newUserEmail}`);
      setNewUserEmail('');
      onRoleAssigned();
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role to user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium mb-4 flex items-center">
        <UserPlus className="mr-2 h-5 w-5 text-bantu-orange" />
        Assign Role
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <Input 
            placeholder="User email address" 
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select 
            value={newUserRole} 
            onValueChange={(value: AppRole) => setNewUserRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button 
            onClick={addRoleToUser} 
            disabled={submitting || !newUserEmail}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Assign Role
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentForm;
