
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  UserPlus, 
  Home, 
  Users, 
  MapPin,
} from 'lucide-react';

type UserType = 'traveler' | 'host' | 'abantu';

interface DashboardSidebarProps {
  userType: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  userType, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="space-y-1">
          <Button 
            variant={activeTab === "bookings" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("bookings")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
          
          <Button 
            variant={activeTab === "learning" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("learning")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Learning Progress
          </Button>
          
          {userType === 'host' && (
            <Button 
              variant={activeTab === "hosting" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("hosting")}
            >
              <Home className="mr-2 h-4 w-4" />
              My Hosted Experiences
            </Button>
          )}
          
          <Button 
            variant={activeTab === "messages" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("messages")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
          
          {userType === 'abantu' && (
            <Button 
              variant={activeTab === "community" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("community")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Community Invites
            </Button>
          )}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="p-4">
        <h3 className="text-sm font-medium mb-3">Quick Stats</h3>
        <div className="space-y-3">
          {userType === 'traveler' && (
            <>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Upcoming Trips</span>
                  <span className="text-xs text-gray-500">3</span>
                </div>
                <Progress value={60} className="h-1" />
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Countries Visited</span>
                  <span className="text-xs text-gray-500">7/54</span>
                </div>
                <Progress value={13} className="h-1" />
              </div>
            </>
          )}
          
          {userType === 'host' && (
            <>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Upcoming Bookings</span>
                  <span className="text-xs text-gray-500">12</span>
                </div>
                <Progress value={75} className="h-1" />
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Rating</span>
                  <span className="text-xs text-gray-500">4.8/5</span>
                </div>
                <Progress value={96} className="h-1" />
              </div>
            </>
          )}
          
          {userType === 'abantu' && (
            <>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Network Connections</span>
                  <span className="text-xs text-gray-500">64</span>
                </div>
                <Progress value={80} className="h-1" />
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Chat Activity</span>
                  <span className="text-xs text-gray-500">High</span>
                </div>
                <Progress value={90} className="h-1" />
              </div>
            </>
          )}
          
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Learning Progress</span>
              <span className="text-xs text-gray-500">45%</span>
            </div>
            <Progress value={45} className="h-1" />
          </div>
        </div>
      </div>
      
      {userType === 'traveler' && (
        <>
          <Separator className="my-2" />
          <div className="p-4">
            <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium text-sm mb-1">Next Destination</h4>
              <Badge className="bg-green-500 hover:bg-green-600">
                Cape Town, South Africa
              </Badge>
            </div>
          </div>
        </>
      )}
      
      {userType === 'host' && (
        <>
          <Separator className="my-2" />
          <div className="p-4">
            <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium text-sm mb-1">Total Guests</h4>
              <Badge className="bg-purple-500 hover:bg-purple-600">
                147 Cultural Explorers
              </Badge>
            </div>
          </div>
        </>
      )}
      
      {userType === 'abantu' && (
        <>
          <Separator className="my-2" />
          <div className="p-4">
            <div className="text-center bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 p-3 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-bantu-orange" />
              <h4 className="font-medium text-sm mb-1">Membership Level</h4>
              <Badge className="bg-bantu-orange/20 text-bantu-orange hover:bg-bantu-orange/30 border-none">
                Premium Access
              </Badge>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default DashboardSidebar;
