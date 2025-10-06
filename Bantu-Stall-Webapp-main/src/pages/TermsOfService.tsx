
import React from 'react';
import { FileText, Scale, AlertTriangle, Mail, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  const effectiveDate = "June 25, 2025";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600">Effective Date: {effectiveDate}</p>
            <p className="text-gray-600">Last Updated: {effectiveDate}</p>
            <Separator className="my-6" />
          </div>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className="ml-9 text-gray-700">
              By accessing and using the Bantu Stall platform at <a href="https://www.bantustall.com" 
              className="text-bantu-orange underline">www.bantustall.com</a>, you accept and agree to be 
              bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, 
              please do not use our services.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Scale className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">2. Service Description</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              Bantu Stall is a pan-African experiential learning, tourism, and networking platform that provides:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>Educational courses and training programs (Mafunzo)</li>
              <li>Community networking and professional connections (Abantu)</li>
              <li>Travel and experience booking services (Musika)</li>
              <li>Corporate retreat planning and management tools</li>
              <li>Cultural content and resources (Indaba)</li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
            </div>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the platform in compliance with applicable laws and regulations</li>
              <li>Respect intellectual property rights and not infringe on others' rights</li>
              <li>Not use the platform for any unlawful or prohibited activities</li>
              <li>Not attempt to gain unauthorized access to our systems or data</li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Scale className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            </div>
            <p className="ml-9 text-gray-700">
              To the maximum extent permitted by law, Bantu Stall shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to loss 
              of profits, data, or other intangible losses resulting from your use of our services.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">5. Governing Law</h2>
            </div>
            <p className="ml-9 text-gray-700">
              These Terms of Service are governed by and construed in accordance with the laws of 
              South Africa. Any disputes arising from these terms will be subject to the exclusive 
              jurisdiction of the courts of South Africa.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">6. Contact Information</h2>
            </div>
            <div className="ml-9 text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-bantu-orange" />
                <span className="font-medium">Email:</span>
                <a href="mailto:legal@bantustall.com" className="text-bantu-orange underline">
                  legal@bantustall.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-bantu-orange" />
                <span className="font-medium">Address:</span>
                <span>Longkloof, Darter Road Innovation City, Darter Studios, Gardens, Cape Town, 8001, South Africa</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
