
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Hash, Globe, Users, Briefcase, Music, Camera, Heart, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChatCircleType } from '@/types/marketplace';

// Sample data for demonstration
const chatCircles: ChatCircleType[] = [
  {
    id: 1,
    title: 'Cross-Border Trade',
    description: 'Discuss international trade policies, customs regulations, and export opportunities across African markets.',
    members: 156,
    lastActive: '2 minutes ago',
    icon: 'globe'
  },
  {
    id: 2,
    title: 'Team Building',
    description: 'Share strategies for building high-performing teams and fostering a positive company culture.',
    members: 89,
    lastActive: '1 hour ago',
    icon: 'users'
  },
  {
    id: 3,
    title: 'Business Development',
    description: 'Explore growth strategies, partnerships, and market entry tactics for scaling your business.',
    members: 201,
    lastActive: '25 minutes ago',
    icon: 'briefcase'
  },
  {
    id: 4,
    title: 'Cultural Exchange',
    description: 'Learn about diverse cultural practices, customs, and traditions across the African continent.',
    members: 123,
    lastActive: '3 hours ago',
    icon: 'music'
  },
  {
    id: 5,
    title: 'Travel Photography',
    description: 'Share travel photography tips, favorite locations, and visual storytelling techniques.',
    members: 78,
    lastActive: '12 minutes ago',
    icon: 'camera'
  },
  {
    id: 6,
    title: 'Social Impact',
    description: 'Discuss strategies for building businesses that create positive social and environmental impact.',
    members: 112,
    lastActive: '40 minutes ago',
    icon: 'heart'
  },
  {
    id: 7,
    title: 'Industry Insights',
    description: 'Share the latest industry reports, market trends, and business intelligence.',
    members: 145,
    lastActive: '1 day ago',
    icon: 'book'
  }
];

// Helper function to render the appropriate icon
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'globe': return <Globe className="h-5 w-5" />;
    case 'users': return <Users className="h-5 w-5" />;
    case 'briefcase': return <Briefcase className="h-5 w-5" />;
    case 'music': return <Music className="h-5 w-5" />;
    case 'camera': return <Camera className="h-5 w-5" />;
    case 'heart': return <Heart className="h-5 w-5" />;
    case 'book': return <BookOpen className="h-5 w-5" />;
    default: return <Hash className="h-5 w-5" />;
  }
};

const ChatCircles = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Themed Chat Circles</h2>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" />
          Create New Circle
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search chat circles" className="pl-10" />
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">POPULAR TAGS</h3>
        <div className="flex flex-wrap gap-2">
          {['Trade', 'Marketing', 'Technology', 'Tourism', 'Startups', 'Manufacturing', 'Finance'].map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chatCircles.map((circle) => (
          <Card key={circle.id} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-bantu-orange/10 p-2 rounded-full text-bantu-orange">
                    {renderIcon(circle.icon)}
                  </div>
                  <CardTitle>{circle.title}</CardTitle>
                </div>
                <Badge>{circle.members} members</Badge>
              </div>
              <CardDescription className="mt-2">{circle.description}</CardDescription>
            </CardHeader>
            
            <Separator className="mb-0" />
            
            <CardFooter className="pt-4 pb-4 flex justify-between">
              <span className="text-sm text-gray-500">Active {circle.lastActive}</span>
              <Button size="sm" variant="outline">Join Circle</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatCircles;
