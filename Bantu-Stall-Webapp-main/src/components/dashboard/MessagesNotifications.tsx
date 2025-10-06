
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Mail, MessageSquare, Bell, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageType } from '@/types/marketplace';

type UserType = 'traveler' | 'host' | 'abantu';

interface MessagesNotificationsProps {
  userType: UserType;
}

// Sample data for demonstration
const messages: MessageType[] = [
  {
    id: 1,
    sender: {
      id: 1,
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    },
    content: 'Hello! I saw your profile and I think we could collaborate on a cross-border textile project. Would you be interested in discussing this further?',
    timestamp: '10:23 AM',
    read: false
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: 'David Mwangi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    },
    content: "Thanks for accepting my connection request! I'd love to learn more about your experience in the tech sector in West Africa.",
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 3,
    sender: {
      id: 3,
      name: 'Fatima Nkosi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    },
    content: "Hi there! I'm organizing a tourism industry meetup next month in Cape Town. Would you be interested in attending?",
    timestamp: 'Yesterday',
    read: false
  },
  {
    id: 4,
    sender: {
      id: 4,
      name: 'Ibrahim Diallo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    },
    content: 'I just shared a document with you regarding agricultural export regulations. Let me know if you have any questions!',
    timestamp: '2 days ago',
    read: true
  }
];

// Notifications data
const notifications = [
  {
    id: 1,
    title: "New Booking Confirmation",
    content: "Your booking for 'Traditional Batik Workshop' has been confirmed.",
    timestamp: "1 hour ago",
    type: "booking",
    read: false
  },
  {
    id: 2,
    title: "Course Completion",
    content: "Congratulations! You've completed 'Cultural Etiquette Essentials'.",
    timestamp: "Yesterday",
    type: "learning",
    read: false
  },
  {
    id: 3,
    title: "Payment Received",
    content: "You've received a payment of $65.00 for your 'Traditional Cuisine Workshop'.",
    timestamp: "2 days ago",
    type: "payment",
    read: true
  },
  {
    id: 4,
    title: "Upcoming Experience Reminder",
    content: "Your 'Desert Astronomy Night' experience starts in 3 days.",
    timestamp: "2 days ago",
    type: "reminder",
    read: true
  },
  {
    id: 5,
    title: "New Badge Earned",
    content: "You've earned the 'Cultural Navigator' badge!",
    timestamp: "1 week ago",
    type: "achievement",
    read: true
  }
];

const MessagesNotifications: React.FC<MessagesNotificationsProps> = ({ userType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [activeTab, setActiveTab] = useState("messages");
  
  const filteredMessages = messages.filter(message => 
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'booking':
        return <Badge className="bg-green-100 text-green-800 border-0">Booking</Badge>;
      case 'learning':
        return <Badge className="bg-blue-100 text-blue-800 border-0">Learning</Badge>;
      case 'payment':
        return <Badge className="bg-purple-100 text-purple-800 border-0">Payment</Badge>;
      case 'reminder':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Reminder</Badge>;
      case 'achievement':
        return <Badge className="bg-orange-100 text-orange-800 border-0">Achievement</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">Notification</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {activeTab === "messages" ? "Messages" : "Notifications"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("messages")}>
            <MessageSquare className={`h-4 w-4 ${activeTab === "messages" ? "text-primary" : "text-gray-500"}`} />
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("notifications")}>
            <Bell className={`h-4 w-4 ${activeTab === "notifications" ? "text-primary" : "text-gray-500"}`} />
            <span className="ml-1 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search messages" 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <Separator />
              
              <ScrollArea className="h-[500px]">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map(message => (
                    <div 
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`flex items-start gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedMessage?.id === message.id ? 'bg-gray-50' : ''} ${!message.read ? 'border-l-4 border-bantu-orange' : ''}`}
                    >
                      <Avatar>
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-sm truncate">{message.sender.name}</h4>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.content}</p>
                      </div>
                      {!message.read && <Badge variant="outline" className="bg-bantu-orange/10 text-bantu-orange border-0">New</Badge>}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No messages found
                  </div>
                )}
              </ScrollArea>
            </Card>
            
            {/* Message Content */}
            <Card className="lg:col-span-2">
              {selectedMessage ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={selectedMessage.sender.avatar} />
                        <AvatarFallback>{selectedMessage.sender.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedMessage.sender.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Received {selectedMessage.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Separator />
                  
                  <CardContent className="pt-6">
                    <div className="mb-12">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMessage.content}
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <Input placeholder="Type your reply..." className="flex-1" />
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
                  <Mail className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No message selected</h3>
                  <p className="text-gray-500">
                    Select a conversation from the list to view messages
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Notifications</CardTitle>
                <Button variant="outline" size="sm">Mark all as read</Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search notifications" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <Separator />
            
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-start gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.read && <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 border-0">NEW</Badge>}
                          </div>
                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                        
                        <div className="flex items-center justify-between">
                          {getNotificationIcon(notification.type)}
                          <Button variant="ghost" size="sm">
                            {notification.type === 'booking' || notification.type === 'reminder' 
                              ? 'View Details' 
                              : 'Dismiss'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications found
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesNotifications;
