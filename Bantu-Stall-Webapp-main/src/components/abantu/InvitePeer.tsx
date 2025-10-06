
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserPlus, Mail, Link, Copy, Share2, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const InvitePeer = () => {
  const [copied, setCopied] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState("I'd like to invite you to join the Abantu community for African business owners and travelers. It's a great place to network and find new opportunities!");
  
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
        <h2 className="text-2xl font-bold">Invite a Peer</h2>
      </div>
      
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
                      <Button variant="outline" className="flex-1">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#25D366]" fill="currentColor">
                          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.196-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
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
                      <Share2 className="h-4 w-4 mr-2" />
                      Resend
                    </Button>
                  </div>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvitePeer;
