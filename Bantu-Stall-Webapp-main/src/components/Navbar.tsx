
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import NavLinks from './navbar/NavLinks';
import MobileMenu from './navbar/MobileMenu';
import UserMenu from './navbar/UserMenu';

const Navbar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut, user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Show simplified navbar during auth loading
  if (loading) {
    return (
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" 
                alt="Bantu Stall Logo" 
                className={cn(
                  "h-10 transition-all duration-300",
                  isScrolled ? "brightness-100" : "brightness-0 invert"
                )}
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-sm border-b border-gray-200/50",
        compact ? "py-1 shadow-sm" : "py-2 shadow-lg"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" 
                alt="Bantu Stall Logo" 
                className={cn(
                  "transition-all duration-500",
                  compact ? "h-8 drop-shadow-sm" : "h-12 drop-shadow-lg"
                )}
              />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks isScrolled={isScrolled} />
          </div>
          
          {/* Right Side Menu */}
          <div className="flex items-center space-x-2">
            <UserMenu isScrolled={isScrolled} />
            
            {/* Enhanced Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        handleLogout={handleLogout}
      />
    </motion.header>
  );
};

export default Navbar;
