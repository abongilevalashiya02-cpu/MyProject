
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export const ProfileTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button>Preview Public Profile</Button>
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="services">Services & Skills</TabsTrigger>
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and how we can contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium mb-2">Profile Photo</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upload New</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Sarah" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Johnson" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="sarah.johnson@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Zanzibar, Tanzania" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  className="min-h-[100px]"
                  placeholder="Tell travelers about yourself..." 
                  defaultValue="Cultural heritage expert with over 10 years of experience guiding tourists through the historic streets of Zanzibar. Fluent in English, French, and Swahili."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Services & Skills</CardTitle>
              <CardDescription>
                Manage your service offerings and highlight your expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="provider-type">Service Provider Type</Label>
                <Select defaultValue="tour-guide">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tour-guide">Tour Guide & Experience Creator</SelectItem>
                    <SelectItem value="event-planner">Event Planner & Hospitality Expert</SelectItem>
                    <SelectItem value="photographer">Photographer & Content Creator</SelectItem>
                    <SelectItem value="culinary">Culinary Expert</SelectItem>
                    <SelectItem value="wellness">Wellness & Lifestyle Professional</SelectItem>
                    <SelectItem value="transport">Transport & Logistics Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Areas of Expertise</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                    Cultural History
                    <button className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                    Walking Tours
                    <button className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                    Local Cuisine
                    <button className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                    Photography
                    <button className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                  </Badge>
                  <Button variant="ghost" size="sm" className="border border-dashed">
                    + Add More
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                    English (Fluent)
                    <button className="ml-1 text-green-800 hover:text-green-900">×</button>
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                    French (Conversational)
                    <button className="ml-1 text-green-800 hover:text-green-900">×</button>
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                    Swahili (Native)
                    <button className="ml-1 text-green-800 hover:text-green-900">×</button>
                  </Badge>
                  <Button variant="ghost" size="sm" className="border border-dashed">
                    + Add More
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications & Certifications</Label>
                <Textarea 
                  id="qualifications" 
                  className="min-h-[100px]"
                  placeholder="List your relevant qualifications..." 
                  defaultValue="- Certified Tour Guide (Tanzania Tourism Board)
- First Aid & Safety Certification
- Cultural Heritage Preservation Course"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Manage your payout methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Bank Account</div>
                      <div className="text-sm text-gray-500">Ending in •••• 5678</div>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>
              
              <Button>Add Payment Method</Button>
              
              <div className="space-y-2">
                <Label>Payout Schedule</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payout schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Next payout: April 15, 2025</p>
              </div>
              
              <div className="space-y-2">
                <Label>Tax Information</Label>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">Tax Documents</div>
                    <div className="text-sm text-gray-500">Required for earnings reporting</div>
                  </div>
                  <Button variant="outline">Update Info</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your account security and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Account Security</h3>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-gray-500">Last updated 30 days ago</div>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Add an extra layer of security</div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Privacy Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Profile Visibility</div>
                    <div className="text-sm text-gray-500">Make your profile visible to potential clients</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive booking requests and updates</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Communications</div>
                    <div className="text-sm text-gray-500">Receive platform updates and promotions</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive">Deactivate Account</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
