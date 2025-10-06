
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserMenuProps {
  isScrolled: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isScrolled }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

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
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    };
    
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Button 
        variant="outline"
        className="transition-all duration-300 rounded-2xl"
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
        variant="ghost" 
        className="flex items-center gap-2 transition-all duration-300 text-gray-800 hover:text-bantu-orange"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">My Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')} className="text-bantu-orange">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
