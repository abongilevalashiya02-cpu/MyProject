import React from 'react';
import { EnterpriseQuotationSystem } from '@/components/quotation/EnterpriseQuotationSystem';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useGuestQuotationMigration } from '@/hooks/useGuestQuotationMigration';
import { SecurityHeaders } from '@/components/security/SecurityHeaders';

const EnterpriseQuotationPage: React.FC = () => {
  // Ensure user is authenticated
  const { user } = useRequireAuth();
  
  // Migrate any guest quotations when user signs in
  useGuestQuotationMigration();

  return (
    <>
      <SecurityHeaders />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <EnterpriseQuotationSystem />
        </div>
      </div>
    </>
  );
};

export default EnterpriseQuotationPage;