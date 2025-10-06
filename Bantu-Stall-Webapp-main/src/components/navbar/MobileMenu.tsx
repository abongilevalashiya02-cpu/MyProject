import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Home, X, ShieldAlert, Store, Users, GraduationCap, MapPin, Calendar, Ticket, Info, Calculator, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => Promise<void>;
}

// Mobile navigation links
const mobileNavLinks = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Quotations', path: '/quotations', icon: FileText },
  { title: 'Countries', path: '/countries', icon: MapPin },
  { title: 'List Properties', path: '/list-property', icon: Building2 },
  { title: 'Musika', path: '/musika', icon: Store },
  { title: 'Stamps', path: '/culture-tokens', icon: Ticket },
  { title: 'About Us', path: '/about', icon: Info },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, handleLogout }) => {
  const { user } = useAuth();
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
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[60] bg-gray-900/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        "md:hidden flex flex-col pt-20 px-6 shadow-2xl"
      )}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col h-full">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[70] bg-white/35 hover:bg-white/55 rounded-full p-3 transition-all duration-200 hover:scale-110 border border-white/30"
          aria-label="Close Menu"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      
        {/* Logo - Increased size */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" 
            alt="Bantu Stall Logo" 
            className="h-24"
          />
        </div>
        
        <nav className="flex flex-col space-y-6 mt-8">
          {mobileNavLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-2xl font-medium text-white hover:text-white bg-bantu-orange/80 hover:bg-bantu-orange/90 p-4 rounded-xl transition-all duration-200 flex items-center gap-3 border border-bantu-orange/90"
              onClick={onClose}
            >
              <link.icon className="h-6 w-6" />
              {link.title}
            </Link>
          ))}
          
          {user && (
            <>
              <Link 
                to="/profile" 
                className="text-2xl font-medium text-white hover:text-white bg-bantu-orange/80 hover:bg-bantu-orange/90 p-4 rounded-xl transition-all duration-200 flex items-center gap-3 border border-bantu-orange/90"
                onClick={onClose}
              >
                <User className="h-6 w-6" />
                My Profile
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-2xl font-medium text-bantu-orange hover:text-bantu-orange/80 bg-bantu-orange/35 hover:bg-bantu-orange/50 p-4 rounded-xl transition-all duration-200 flex items-center gap-3 border border-bantu-orange/45"
                  onClick={onClose}
                >
                  <ShieldAlert className="h-6 w-6" />
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>
        
        <div className="flex flex-col space-y-4 mt-10">
          {user ? (
            <Button 
              variant="outline" 
              className="w-full rounded-2xl py-6 text-lg bg-bantu-orange/80 hover:bg-bantu-orange/90 border-bantu-orange/90 text-white hover:text-white"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full rounded-2xl py-6 text-lg bg-bantu-orange/80 hover:bg-bantu-orange/90 border-bantu-orange/90 text-white hover:text-white"
              onClick={() => {
                navigate('/login');
                onClose();
              }}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;