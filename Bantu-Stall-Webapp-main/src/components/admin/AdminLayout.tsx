
import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  isLoading: boolean;
  isAdmin: boolean | null;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  isLoading, 
  isAdmin 
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-bantu-orange" />
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
