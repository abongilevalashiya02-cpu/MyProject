
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, User, MessageCircle, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const CommunityHub = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-5 w-5 text-bantu-orange" />
          Abantu Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Networking Events */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            Upcoming Events
          </h4>
          <div className="space-y-2">
            {[
              { 
                name: "Tech Entrepreneurs Meetup", 
                date: "Aug 25, 6:00 PM",
                location: "Nairobi Innovation Hub",
                attendees: 24
              },
              { 
                name: "Cultural Exchange Social", 
                date: "Sep 3, 7:30 PM",
                location: "Accra Arts Center",
                attendees: 42
              }
            ].map((event, i) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium text-sm">{event.name}</div>
                <div className="text-xs text-gray-500 mt-1">{event.date}</div>
                <div className="text-xs text-gray-500">{event.location}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <User className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs">{event.attendees} attending</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* People to Connect With */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <UserPlus className="mr-2 h-4 w-4 text-gray-500" />
            People You May Know
          </h4>
          <div className="space-y-3">
            {[
              {
                name: "Amara Okafor",
                role: "Tech Entrepreneur",
                location: "Lagos, Nigeria",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Kwame Mensah",
                role: "Safari Guide",
                location: "Nairobi, Kenya",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Zainab El Fassi",
                role: "Cultural Historian",
                location: "Marrakech, Morocco",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{person.name}</div>
                    <div className="text-xs text-gray-500">{person.role}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full flex items-center" variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Open Community Chat
          <Badge className="ml-2 bg-red-500 text-white">3</Badge>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityHub;
