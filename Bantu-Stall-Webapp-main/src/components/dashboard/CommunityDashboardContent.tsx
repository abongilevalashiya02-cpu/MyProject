import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, MessageSquare, Calendar, Heart, Share2, 
  Search, Filter, Bell, MapPin, Globe, Network
} from 'lucide-react';

const CommunityDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      id: 1,
      name: 'Amara Okafor',
      location: 'Lagos, Nigeria',
      avatar: '/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png',
      role: 'Cultural Ambassador',
      connections: 89,
      verified: true,
      online: true
    },
    {
      id: 2,
      name: 'Kwame Asante',
      location: 'Accra, Ghana',
      avatar: '/lovable-uploads/413f808f-8f03-4a44-bb12-735b1c766c4e.png',
      role: 'Travel Expert',
      connections: 156,
      verified: true,
      online: false
    },
    {
      id: 3,
      name: 'Fatima Al-Rashid',
      location: 'Cairo, Egypt',
      avatar: '/lovable-uploads/440979ba-a8b9-4724-9e35-795b7d747bdd.png',
      role: 'Heritage Guide',
      connections: 234,
      verified: false,
      online: true
    }
  ];

  const events = [
    {
      id: 1,
      title: 'African Heritage Month Celebration',
      date: '2024-12-20',
      time: '18:00',
      location: 'Virtual Event',
      attendees: 89,
      type: 'Cultural'
    },
    {
      id: 2,
      title: 'Travel Photography Workshop',
      date: '2024-12-25',
      time: '14:00',
      location: 'Cape Town, SA',
      attendees: 25,
      type: 'Workshop'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Amara Okafor',
      avatar: '/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png',
      message: 'Great photos from your Serengeti trip!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      sender: 'Travel Enthusiasts Group',
      avatar: '/lovable-uploads/413f808f-8f03-4a44-bb12-735b1c766c4e.png',
      message: 'New discussion: Best hidden gems in East Africa',
      time: '4 hours ago',
      unread: false
    }
  ];

  const communityStats = [
    { label: 'Total Members', value: '2,847', trend: '+89', icon: Users },
    { label: 'My Connections', value: '127', trend: '+12', icon: Network },
    { label: 'Messages', value: '89', trend: '+23', icon: MessageSquare },
    { label: 'Events Attended', value: '12', trend: '+3', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Hub</h2>
          <p className="text-muted-foreground">Connect with the African diaspora community</p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Invite Friends
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {communityStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} this week</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="grid gap-4">
            {members.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.online && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          {member.verified && (
                            <Badge variant="secondary">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {member.location}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {member.connections} connections
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm">
                        Connect
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Messages</h3>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
          
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${message.unread ? 'border-l-4 border-l-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium truncate ${message.unread ? 'font-semibold' : ''}`}>
                          {message.sender}
                        </h4>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                    </div>
                    {message.unread && (
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
          
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees} attendees
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm">
                        Attend
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="text-center py-20">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community Groups</h3>
            <p className="text-muted-foreground mb-4">
              Join groups based on your interests and connect with like-minded people
            </p>
            <Button>
              Browse Groups
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboardContent;
