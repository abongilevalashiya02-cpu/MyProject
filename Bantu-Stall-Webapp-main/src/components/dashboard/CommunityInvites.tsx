
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserPlus, Mail, Link, Copy, Share2, Check, Filter, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const CommunityInvites = () => {
  const [copied, setCopied] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState("I'd like to invite you to join the Abantu community for African business owners and travelers. It's a great place to network and find new opportunities!");
  const [activeTab, setActiveTab] = useState("invites");
  
  const inviteLink = 'https://bantustall.com/abantu/join/ref123456';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendInvites = () => {
    // Process community invites
    setEmailsSent(true);
    setTimeout(() => setEmailsSent(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("connections")}>
            <Users className={`h-4 w-4 ${activeTab === "connections" ? "text-primary" : "text-gray-500"}`} />
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("invites")}>
            <UserPlus className={`h-4 w-4 ${activeTab === "invites" ? "text-primary" : "text-gray-500"}`} />
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="invites">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Network (64 connections)</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Input placeholder="Search connections" className="max-w-[220px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Samuel Osei",
                role: "Tech Entrepreneur",
                company: "EcoTech Solutions",
                location: "Accra, Ghana",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
                mutualConnections: 8,
                industry: "Technology",
                tags: ["Startup", "CleanTech"]
              },
              {
                name: "Amina Diop",
                role: "Trade Consultant",
                company: "African Trade Alliance",
                location: "Dakar, Senegal",
                avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80",
                mutualConnections: 12,
                industry: "International Trade",
                tags: ["Import/Export", "Policy"]
              },
              {
                name: "Jamal Mbeki",
                role: "Tourism Director",
                company: "EcoSafari Adventures",
                location: "Nairobi, Kenya",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
                mutualConnections: 5,
                industry: "Tourism",
                tags: ["Sustainable Tourism", "Wildlife"]
              },
              {
                name: "Chioma Adeyemi",
                role: "Textile Designer",
                company: "Heritage Fabrics",
                location: "Lagos, Nigeria",
                avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
                mutualConnections: 3,
                industry: "Fashion & Textiles",
                tags: ["Traditional Crafts", "Export"]
              },
              {
                name: "Ibrahim Toure",
                role: "Agribusiness Manager",
                company: "SahelGrow Farms",
                location: "Bamako, Mali",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
                mutualConnections: 7,
                industry: "Agriculture",
                tags: ["Sustainable Farming", "Export"]
              },
              {
                name: "Zainab Mensah",
                role: "Cultural Program Director",
                company: "Heritage Foundation",
                location: "Kumasi, Ghana",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
                mutualConnections: 10,
                industry: "Arts & Culture",
                tags: ["Cultural Preservation", "Education"]
              }
            ].map((connection, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{connection.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {connection.role} at {connection.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="w-20 text-gray-500">Location:</span>
                      <span>{connection.location}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-20 text-gray-500">Industry:</span>
                      <span>{connection.industry}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-20 text-gray-500">Mutual:</span>
                      <span>{connection.mutualConnections} connections</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {connection.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      Message
                    </Button>
                    <Button size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="invites">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Grow Your Network</CardTitle>
                <CardDescription>
                  Invite trusted peers to join the Abantu community. Each member you invite enhances the community's value.
                </CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="email" className="w-full">
                <CardContent>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="email">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Invitation
                    </TabsTrigger>
                    <TabsTrigger value="link">
                      <Link className="mr-2 h-4 w-4" />
                      Invitation Link
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="mt-0">
                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>Email Addresses</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter email addresses (one per line or comma-separated)" 
                            className="resize-none"
                            rows={4}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          You can invite up to 10 peers at once
                        </FormDescription>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>Personal Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a personal note to your invitation" 
                            className="resize-none"
                            rows={4}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="link" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Share this custom invitation link with your connections. The link is unique to you and tracks your referrals.
                        </p>
                        
                        <div className="flex gap-2">
                          <Input value={inviteLink} readOnly className="flex-1" />
                          <Button onClick={handleCopyLink} variant="outline">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-3">Share via:</p>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor">
                              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                            </svg>
                            Facebook
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#1DA1F2]" fill="currentColor">
                              <path d="M8 2H1L9.26 13.33L1.67 22H4.46L10.59 15.31L16 22H23L14.35 10.24L21.74 2H18.89L13.41 7.99L8 2ZM19.93 20L13 12.76L5.93 20H2.67L5.07 9.33L2.67 4H8.53L12.76 14.67L19.93 4H22.33L14 15.33L22.33 20H19.93Z" />
                            </svg>
                            Twitter
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#0077B5]" fill="currentColor">
                              <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                            </svg>
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    You have sent 5 invitations this month (25 remaining)
                  </p>
                  
                  <Button 
                    onClick={handleSendInvites}
                    disabled={emailsSent}
                  >
                    {emailsSent ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Invitations Sent!
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Send Invitations
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Tabs>
            </Card>
            
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4">Your Invited Members</h3>
              
              <Card>
                <CardContent className="p-6">
                  {[
                    { name: 'Samuel Osei', status: 'Joined 2 weeks ago', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80' },
                    { name: 'Nadia Ahmed', status: 'Invitation pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
                    { name: 'Kwame Nkrumah', status: 'Joined yesterday', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' },
                    { name: 'Maria Santos', status: 'Invitation pending', avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80' }
                  ].map((person, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={person.avatar} />
                            <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.status}</p>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          {person.status.includes('pending') ? (
                            <>
                              <Share2 className="h-4 w-4 mr-2" />
                              Resend
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </React.Fragment>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityInvites;
