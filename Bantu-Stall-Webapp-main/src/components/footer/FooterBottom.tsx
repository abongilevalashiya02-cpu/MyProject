
import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottom = () => {
  return (
    <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between">
      <p className="text-gray-500 text-sm mb-4 md:mb-0">
        © {new Date().getFullYear()} Bantu Stall. All rights reserved.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link 
          to="/privacy-policy" 
          className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
        >
          Privacy Policy
        </Link>
        <Link 
          to="/about" 
          className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
        >
          About Us
        </Link>
        <Link 
          to="/terms-of-service" 
          className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

export default FooterBottom;
