
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const ServiceProviderNavLink: React.FC = () => {
  return (
    <Link to="/service-provider">
      <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-bantu-orange transition-colors">
        Service Providers
      </Button>
    </Link>
  );
};

export default ServiceProviderNavLink;
