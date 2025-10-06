import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, Globe, FileText } from 'lucide-react';

const Compliance = () => {
  return (
    <>
      <Helmet>
        <title>POPIA & GDPR Compliance - Bantu Stall</title>
        <meta name="description" content="Learn about Bantu Stall's commitment to data protection, privacy compliance with POPIA and GDPR regulations, and how we safeguard your personal information." />
        <meta name="keywords" content="POPIA, GDPR, data protection, privacy, compliance, personal information, South Africa, EU" />
      </Helmet>

      <Navbar compact />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Data Protection & Privacy Compliance</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring compliance with the Protection of Personal 
              Information Act (POPIA) and the General Data Protection Regulation (GDPR).
            </p>
          </div>

          {/* Compliance Badges */}
          <div className="flex justify-center gap-4 mb-12">
            <Badge variant="outline" className="p-2">
              <Shield className="h-4 w-4 mr-2" />
              POPIA Compliant
            </Badge>
            <Badge variant="outline" className="p-2">
              <Globe className="h-4 w-4 mr-2" />
              GDPR Compliant
            </Badge>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* POPIA Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  POPIA Compliance
                </CardTitle>
                <CardDescription>
                  Protection of Personal Information Act (South Africa)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Information Processing Principles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Accountability and transparency in data processing</li>
                    <li>Processing limitation - only for lawful purposes</li>
                    <li>Purpose specification and collection limitation</li>
                    <li>Data quality and reasonable security safeguards</li>
                    <li>Openness about processing activities</li>
                    <li>Data subject participation rights</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Your Rights Under POPIA</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Right to access your personal information</li>
                    <li>Right to correction of inaccurate information</li>
                    <li>Right to deletion of personal information</li>
                    <li>Right to object to processing</li>
                    <li>Right to data portability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* GDPR Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  GDPR Compliance
                </CardTitle>
                <CardDescription>
                  General Data Protection Regulation (European Union)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Data Processing Principles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Lawfulness, fairness and transparency</li>
                    <li>Purpose limitation and data minimization</li>
                    <li>Accuracy and storage limitation</li>
                    <li>Integrity, confidentiality and accountability</li>
                    <li>Privacy by design and by default</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Your Rights Under GDPR</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Right to be informed</li>
                    <li>Right of access and rectification</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Protection Measures */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Our Data Protection Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Database className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Secure Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    All personal data is encrypted and stored securely using industry best practices
                  </p>
                </div>
                
                <div className="text-center">
                  <Eye className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Access Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    Strict access controls ensure only authorized personnel can access personal data
                  </p>
                </div>
                
                <div className="text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Regular Audits</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular compliance audits and security assessments to maintain standards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection and Use */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What Information We Collect and Why</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  We collect personal information to provide our travel services:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Name, email address, and contact details for account creation and communication</li>
                  <li>Travel preferences and booking history to personalize recommendations</li>
                  <li>Payment information for processing bookings (handled by secure payment processors)</li>
                  <li>Identity documents for travel booking verification when required</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Technical Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Website usage data for improving user experience</li>
                  <li>Device and browser information for compatibility and security</li>
                  <li>Cookies for essential functionality and analytics (with your consent)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Legal Basis for Processing</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Contract performance - to provide travel services you've booked</li>
                  <li>Legitimate interests - to improve our services and prevent fraud</li>
                  <li>Consent - for marketing communications and non-essential cookies</li>
                  <li>Legal obligation - for tax, safety, and regulatory requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Data Retention and Deletion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Retention Periods</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Account Data:</strong> Retained while your account is active, plus 7 years for legal/tax purposes</li>
                    <li><strong>Booking Records:</strong> Retained for 7 years after travel completion for legal compliance</li>
                    <li><strong>Marketing Data:</strong> Until you withdraw consent or 3 years of inactivity</li>
                    <li><strong>Technical Data:</strong> Aggregated analytics data retained indefinitely (anonymized)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Right to Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    You can request deletion of your personal data at any time, subject to legal retention requirements. 
                    We will delete or anonymize your data within 30 days of a valid deletion request.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                As a global travel platform, we may transfer your data internationally to provide our services:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Data processing services in secure, GDPR-adequate countries</li>
                <li>Travel partners and suppliers in your destination countries</li>
                <li>Payment processors with appropriate safeguards</li>
                <li>All transfers protected by appropriate safeguards and contracts</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Data Protection Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  For any questions about our data protection practices or to exercise your rights:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Data Protection Officer</h4>
                    <p className="text-sm text-muted-foreground">
                      Email: privacy@bantustall.com<br />
                      Response time: Within 30 days
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Regulatory Authorities</h4>
                    <p className="text-sm text-muted-foreground">
                      South Africa: Information Regulator<br />
                      EU: Your local Data Protection Authority
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Compliance;