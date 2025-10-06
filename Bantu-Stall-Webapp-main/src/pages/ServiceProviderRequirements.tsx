
import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, User, Building2, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RequirementCard from '@/components/service-provider/requirements/RequirementCard';
import { businessTypes } from '@/components/service-provider/requirements/businessTypesData';

const ServiceProviderRequirements = () => {
  const [selectedCountry] = useState('South Africa');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/service-provider-dashboard" className="flex items-center text-gray-600 hover:text-bantu-orange transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="hidden md:block h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Minimum Requirements</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Country:</span>
              <Badge variant="outline" className="bg-white">
                {selectedCountry} ▼
              </Badge>
            </div>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            Check what you'll need before you apply
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="soleProp" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white">
            <TabsTrigger value="soleProp" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sole Prop.</span>
            </TabsTrigger>
            <TabsTrigger value="ptyLtd" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Pty Ltd</span>
            </TabsTrigger>
            <TabsTrigger value="cc" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">CC</span>
            </TabsTrigger>
            <TabsTrigger value="npc" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">NPC</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(businessTypes).map(([key, businessType]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <RequirementCard businessType={businessType} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ServiceProviderRequirements;
