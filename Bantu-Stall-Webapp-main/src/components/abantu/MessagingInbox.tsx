
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Mail, MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MessageType } from '@/types/marketplace';

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

const MessagingInbox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  
  const filteredMessages = messages.filter(message => 
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Messaging Inbox</h2>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
      
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
    </div>
  );
};

export default MessagingInbox;
