import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ProtectedQuotationRoute } from '@/components/quotation/ProtectedQuotationRoute';
import { FastQuotationForm } from '@/components/quotation/FastQuotationForm';
import { SecurityHeaders } from '@/components/security/SecurityHeaders';

const QuotationFormPage: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      <SecurityHeaders />
      <ProtectedQuotationRoute requireAuth={true} preserveFormState={false}>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }>
              <FastQuotationForm
                onClose={() => window.history.back()}
                onComplete={() => window.location.href = '/dashboard?section=quotations'}
              />
            </Suspense>
          </div>
        </div>
      </ProtectedQuotationRoute>
    </>
  );
};

export default QuotationFormPage;