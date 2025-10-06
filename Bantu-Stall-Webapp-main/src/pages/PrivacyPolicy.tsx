
import React from 'react';
import { FileText, Shield, Mail, MapPin, Globe, Users, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  const effectiveDate = "June 25, 2025";
  
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar compact />
      
      <main className="flex-grow py-16 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Effective Date: {effectiveDate}</p>
            <p className="text-gray-600">Last Updated: {effectiveDate}</p>
            <Separator className="my-6" />
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>POPIA & GDPR Compliance:</strong> This privacy policy complies with the Protection of Personal Information Act (POPIA) of South Africa and the General Data Protection Regulation (GDPR) of the European Union.
              </p>
            </div>
          </div>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              Welcome to Bantu Stall ("we," "our," "us"). Your privacy is important to us. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our platform at <a href="https://www.bantustall.com" 
              className="text-bantu-orange underline">www.bantustall.com</a> (the "Website").
            </p>
            <p className="ml-9 text-gray-700">
              As a responsible data controller, we are committed to protecting your personal information 
              in accordance with applicable privacy laws including POPIA (South Africa) and GDPR (European Union).
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Users className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">2. Legal Basis for Processing</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              Under POPIA and GDPR, we process your personal information based on the following legal grounds:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Consent:</strong> When you explicitly agree to our processing activities</li>
              <li><strong>Contract:</strong> To fulfill our contractual obligations with you</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Legitimate Interests:</strong> For our business operations, fraud prevention, and service improvement</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">3. Information We Collect</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              We collect the following categories of personal information:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Personal Identifiers:</span> Name, email address, 
                phone number, postal address, and unique identifiers.
              </li>
              <li>
                <span className="font-medium">Financial Information:</span> Billing details, 
                payment card information, and transaction history.
              </li>
              <li>
                <span className="font-medium">Profile Information:</span> Travel preferences, 
                interests, profile pictures, and account settings.
              </li>
              <li>
                <span className="font-medium">Technical Data:</span> IP address, browser type, 
                device information, cookies, and website usage analytics.
              </li>
              <li>
                <span className="font-medium">Communication Data:</span> Messages, feedback, 
                and correspondence with our support team.
              </li>
            </ul>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">4. Cookies and Tracking Technologies</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Necessary Cookies:</strong> Essential for website functionality</li>
              <li><strong>Analytics Cookies:</strong> To understand website usage and performance</li>
              <li><strong>Marketing Cookies:</strong> For targeted advertising and remarketing</li>
              <li><strong>Functional Cookies:</strong> To remember your preferences and settings</li>
            </ul>
            <p className="ml-9 text-gray-700 mt-4">
              You can manage your cookie preferences through our cookie consent banner or browser settings.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">5. How We Use Your Information</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              We process your personal information for the following purposes:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>Provide and improve our services, including bookings and networking features</li>
              <li>Process payments and manage your account</li>
              <li>Personalize user experiences and recommendations</li>
              <li>Communicate updates, promotional offers, and important notices</li>
              <li>Ensure security, prevent fraud, and protect our rights</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Conduct analytics and research to improve our services</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">6. Information Sharing and Disclosure</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Service Providers:</span> Payment processors, 
                hosting services, analytics providers, and other third parties who assist in our operations.
              </li>
              <li>
                <span className="font-medium">Business Partners:</span> Curators, hosts, and 
                experience providers to facilitate bookings and services.
              </li>
              <li>
                <span className="font-medium">Legal Requirements:</span> When required by law, 
                court order, or to protect our rights and safety.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In connection with mergers, 
                acquisitions, or asset sales.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">7. International Data Transfers</h2>
            </div>
            <p className="ml-9 text-gray-700">
              Your information may be transferred to and processed in countries other than South Africa. 
              We ensure appropriate safeguards are in place, including adequacy decisions, standard 
              contractual clauses, or other approved mechanisms under POPIA and GDPR.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">8. Data Security and Retention</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Access controls and authentication measures</li>
              <li>Regular security assessments and updates</li>
              <li>Staff training on data protection</li>
            </ul>
            <p className="ml-9 text-gray-700 mt-4">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this policy or as required by law.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Users className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">9. Your Rights</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              Under POPIA and GDPR, you have the following rights:
            </p>
            <ul className="ml-9 list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Right of Access:</strong> Request copies of your personal information</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              <li><strong>Right to Lodge Complaints:</strong> File complaints with supervisory authorities</li>
            </ul>
            <p className="ml-9 text-gray-700 mt-4">
              To exercise these rights, please contact us using the details below.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">10. Children's Privacy</h2>
            </div>
            <p className="ml-9 text-gray-700">
              Our services are not intended for individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If we become aware that we have collected 
              information from a child, we will delete it promptly.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">11. Updates to This Policy</h2>
            </div>
            <p className="ml-9 text-gray-700">
              We may update this Privacy Policy periodically. Material changes will be communicated 
              through email or prominent website notices. The effective date at the top indicates 
              when the policy was last revised.
            </p>
          </section>
          
          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">12. Contact Information</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              For privacy-related questions, data requests, or complaints, contact our Data Protection Officer:
            </p>
            <div className="ml-9 text-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-bantu-orange" />
                <span className="font-medium">Email:</span>
                <a href="mailto:privacy@bantustall.com" className="text-bantu-orange underline">
                  privacy@bantustall.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-bantu-orange" />
                <span className="font-medium">Legal/DPO:</span>
                <a href="mailto:legal@bantustall.com" className="text-bantu-orange underline">
                  legal@bantustall.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-bantu-orange mt-0.5" />
                <div>
                  <span className="font-medium">Address:</span>
                  <p>Longkloof, Darter Road Innovation City<br />
                  Darter Studios, Gardens<br />
                  Cape Town, 8001<br />
                  South Africa</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold">13. Supervisory Authorities</h2>
            </div>
            <p className="ml-9 text-gray-700 mb-4">
              If you have concerns about our data processing, you may lodge complaints with:
            </p>
            <div className="ml-9 text-gray-700 space-y-3">
              <div>
                <strong>South Africa (POPIA):</strong><br />
                Information Regulator South Africa<br />
                Website: <a href="https://www.justice.gov.za/inforeg/" className="text-bantu-orange underline">www.justice.gov.za/inforeg/</a>
              </div>
              <div>
                <strong>European Union (GDPR):</strong><br />
                Your local Data Protection Authority<br />
                Website: <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" className="text-bantu-orange underline">edpb.europa.eu</a>
              </div>
            </div>
          </section>
          
          <div className="mt-12 bg-gray-100 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              This privacy policy was last updated on {effectiveDate} and complies with POPIA and GDPR requirements.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
