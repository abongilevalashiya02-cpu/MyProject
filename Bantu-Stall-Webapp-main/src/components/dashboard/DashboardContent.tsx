
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyBookings from '@/components/dashboard/MyBookings';
import MyLearningProgress from '@/components/dashboard/MyLearningProgress';
import MyHostedExperiences from '@/components/dashboard/MyHostedExperiences';
import MessagesNotifications from '@/components/dashboard/MessagesNotifications';
import CommunityInvites from '@/components/dashboard/CommunityInvites';

type UserType = 'traveler' | 'host' | 'abantu';

interface DashboardContentProps {
  userType: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  userType, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Card className="h-full">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            {userType === 'host' && <TabsTrigger value="hosting">Hosting</TabsTrigger>}
            <TabsTrigger value="messages">Messages</TabsTrigger>
            {userType === 'abantu' && <TabsTrigger value="community">Community</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="bookings" className="h-full">
            <MyBookings userType={userType} />
          </TabsContent>
          
          <TabsContent value="learning" className="h-full">
            <MyLearningProgress userType={userType} />
          </TabsContent>
          
          {userType === 'host' && (
            <TabsContent value="hosting" className="h-full">
              <MyHostedExperiences />
            </TabsContent>
          )}
          
          <TabsContent value="messages" className="h-full">
            <MessagesNotifications userType={userType} />
          </TabsContent>
          
          {userType === 'abantu' && (
            <TabsContent value="community" className="h-full">
              <CommunityInvites />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Card>
  );
};

export default DashboardContent;
