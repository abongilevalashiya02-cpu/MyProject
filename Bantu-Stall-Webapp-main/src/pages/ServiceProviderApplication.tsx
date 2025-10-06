
import React from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ApplicationForm } from '@/components/service-provider/application/ApplicationForm';

const ServiceProviderApplication = () => {
  // Ensure the user is logged in
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <ApplicationForm />
      </div>
    </div>
  );
};

export default ServiceProviderApplication;
