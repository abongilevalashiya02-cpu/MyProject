import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const MinimalFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png" 
              alt="Bantu Stall Logo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <a 
              href="/about" 
              className="micro-copy text-foreground/70 hover:text-accent-earthy transition-colors duration-150"
            >
              About
            </a>
            <a 
              href="/contact" 
              className="micro-copy text-foreground/70 hover:text-accent-earthy transition-colors duration-150"
            >
              Contact
            </a>
            <a 
              href="/privacy-policy" 
              className="micro-copy text-foreground/70 hover:text-accent-earthy transition-colors duration-150"
            >
              Privacy
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-foreground/50 hover:text-accent-earthy transition-all duration-150 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-foreground/50 hover:text-accent-earthy transition-all duration-150 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-foreground/50 hover:text-accent-earthy transition-all duration-150 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-foreground/50 hover:text-accent-earthy transition-all duration-150 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;