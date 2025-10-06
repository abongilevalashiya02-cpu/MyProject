
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  LogOut,
  Menu,
  Home as HomeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface DashboardNavbarProps {
  handleLogout: () => Promise<void>;
  user: any;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ handleLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Dashboard Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" 
                alt="Bantu Stall Logo" 
                className="h-10"
              />
            </Link>
            <span className="hidden md:inline-block text-lg font-semibold">Dashboard</span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-bantu-orange transition-colors">
              Home
            </Link>
            <Link to="/musika" className="text-sm font-medium text-gray-700 hover:text-bantu-orange transition-colors">
              Musika
            </Link>
            <Link to="/events" className="text-sm font-medium text-gray-700 hover:text-bantu-orange transition-colors">
              Events
            </Link>
            <Link to="/culture-tokens" className="text-sm font-medium text-gray-700 hover:text-bantu-orange transition-colors">
              Stamps
            </Link>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hidden md:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80" />
                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-64" : "max-h-0"
        )}>
          <div className="py-3 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-sm font-medium text-gray-700 hover:text-bantu-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/musika" 
              className="block py-2 text-sm font-medium text-gray-700 hover:text-bantu-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Musika
            </Link>
            <Link 
              to="/events" 
              className="block py-2 text-sm font-medium text-gray-700 hover:text-bantu-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/culture-tokens" 
              className="block py-2 text-sm font-medium text-gray-700 hover:text-bantu-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stamps
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start pl-0 text-sm font-medium text-gray-700"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
