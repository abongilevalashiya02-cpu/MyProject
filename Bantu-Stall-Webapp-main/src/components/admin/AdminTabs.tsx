
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminExperiences from '@/components/admin/AdminExperiences';
import AdminLearning from '@/components/admin/AdminLearning';
import AdminIndaba from '@/components/admin/AdminIndaba';
import AdminRoles from '@/components/admin/AdminRoles';
import MonitoringDashboard from '@/components/enterprise/MonitoringDashboard';
import PerformanceMonitor from '@/components/enterprise/PerformanceMonitor';
import BackupManager from '@/components/enterprise/BackupManager';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-7 mb-8">
        <TabsTrigger value="experiences">Experiences</TabsTrigger>
        <TabsTrigger value="learning">Learning Modules</TabsTrigger>
        <TabsTrigger value="vault">Indaba Articles</TabsTrigger>
        <TabsTrigger value="roles">User Roles</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="experiences" className="space-y-4">
        <AdminExperiences />
      </TabsContent>
      
      <TabsContent value="learning" className="space-y-4">
        <AdminLearning />
      </TabsContent>
      
      <TabsContent value="vault" className="space-y-4">
        <AdminIndaba />
      </TabsContent>
      
      <TabsContent value="roles" className="space-y-4">
        <AdminRoles />
      </TabsContent>
      
      <TabsContent value="monitoring" className="space-y-4">
        <MonitoringDashboard />
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-4">
        <PerformanceMonitor />
      </TabsContent>
      
      <TabsContent value="backup" className="space-y-4">
        <BackupManager />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
