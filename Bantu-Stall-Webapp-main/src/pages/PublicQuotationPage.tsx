import React from 'react';
import { GuestQuotationWrapper } from '@/components/quotation/GuestQuotationWrapper';
import { AuthenticatedQuotationRedirect } from '@/components/quotation/AuthenticatedQuotationRedirect';
import { SecurityHeaders } from '@/components/security/SecurityHeaders';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PublicQuotationPage: React.FC = () => {
  return (
    <>
      <SecurityHeaders />
      <AuthenticatedQuotationRedirect />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Get Your Retreat Quote
                </h1>
                <p className="text-muted-foreground">
                  Start planning your perfect African retreat experience
                </p>
              </div>
              
              <GuestQuotationWrapper
                isOpen={true}
                onClose={() => window.location.href = '/'}
                mode="navbar"
              />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PublicQuotationPage;