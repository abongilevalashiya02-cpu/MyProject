
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TourismTrendsDashboard from './creator/TourismTrendsDashboard';
import LiveExperienceMap from './creator/LiveExperienceMap';
import ResourceHub from './creator/ResourceHub';
import ResaleOpportunities from './creator/ResaleOpportunities';
import PerformanceAnalytics from './creator/PerformanceAnalytics';
import CustomAlerts from './creator/CustomAlerts';
import PackageBuilder from './creator/PackageBuilder';

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("package-builder");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview Section Cards */}
        <Card className="p-6">
          <TourismTrendsDashboard />
        </Card>
        <Card className="p-6">
          <LiveExperienceMap />
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="resources">Resource Hub</TabsTrigger>
          <TabsTrigger value="package-builder">Package Builder</TabsTrigger>
          <TabsTrigger value="resale">Pre-Built Packages</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Custom Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="space-y-4">
          <ResourceHub />
        </TabsContent>
        
        <TabsContent value="package-builder" className="space-y-4">
          <PackageBuilder />
        </TabsContent>
        
        <TabsContent value="resale" className="space-y-4">
          <ResaleOpportunities />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceAnalytics />
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <CustomAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
