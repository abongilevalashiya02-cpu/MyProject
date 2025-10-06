
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Star, Calendar, DollarSign, Clock, MapPin, Tag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const MyHostedExperiences = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Hosted Experiences</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Experience
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-8 mb-4">
                <div className="text-3xl font-bold text-purple-600">147</div>
              </div>
              <div className="text-sm text-gray-500">
                Total guests this year
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-8 mb-4">
                <div className="text-3xl font-bold text-yellow-600">4.8</div>
              </div>
              <div className="flex justify-center">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-yellow-500 fill-yellow-500 opacity-50"}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                From 87 reviews
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-8 mb-4">
                <div className="text-3xl font-bold text-green-600">$12,450</div>
              </div>
              <div className="text-sm text-gray-500">
                Total earnings this year
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Experiences</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="space-y-6">
            {[
              {
                title: "Cultural Heritage Tour",
                description: "Explore the hidden cultural gems of our city with a knowledgeable local guide.",
                price: 45,
                duration: "3 hours",
                category: "Walking Tour",
                location: "Zanzibar, Tanzania",
                image: "https://images.unsplash.com/photo-1605649461939-17e82b7f6f37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                rating: 4.9,
                reviews: 42,
                featured: true,
                availability: "Daily, 9:00 AM & 2:00 PM",
                bookings: {
                  upcoming: 7,
                  thisMonth: 12,
                  lastMonth: 8
                }
              },
              {
                title: "Traditional Cuisine Workshop",
                description: "Learn to prepare authentic local dishes with fresh ingredients from the market.",
                price: 65,
                duration: "4 hours",
                category: "Food & Drink",
                location: "Zanzibar, Tanzania",
                image: "https://images.unsplash.com/photo-1551218371-03a19d7b7aef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                rating: 4.7,
                reviews: 38,
                featured: false,
                availability: "Tue, Thu, Sat at 11:00 AM",
                bookings: {
                  upcoming: 4,
                  thisMonth: 9,
                  lastMonth: 11
                }
              },
              {
                title: "Artisan Craft Workshop",
                description: "Create your own traditional crafts under the guidance of skilled local artisans.",
                price: 35,
                duration: "2 hours",
                category: "Workshops",
                location: "Zanzibar, Tanzania",
                image: "https://images.unsplash.com/photo-1528497342860-d589cbc6f656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80",
                rating: 4.8,
                reviews: 21,
                featured: false,
                availability: "Mon, Wed, Fri at 1:00 PM",
                bookings: {
                  upcoming: 3,
                  thisMonth: 7,
                  lastMonth: 5
                }
              }
            ].map((experience, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-1 h-full min-h-[200px] relative">
                    <img 
                      src={experience.image} 
                      alt={experience.title} 
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {experience.featured && (
                      <Badge className="absolute top-2 left-2 bg-bantu-orange border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{experience.title}</CardTitle>
                          <div className="flex items-center mt-1 gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{experience.rating}</span>
                            <span className="text-sm text-gray-500">({experience.reviews} reviews)</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {experience.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {experience.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          {experience.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {experience.duration}
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                          ${experience.price} per person
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {experience.availability}
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium mb-1">Upcoming Bookings</div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-purple-600" />
                            <span className="text-lg font-bold text-purple-600">{experience.bookings.upcoming}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">This Month</div>
                          <div className="text-center">
                            <span className="text-lg font-bold">{experience.bookings.thisMonth}</span>
                            {experience.bookings.thisMonth > experience.bookings.lastMonth ? (
                              <span className="text-xs ml-1 text-green-600">↑{experience.bookings.thisMonth - experience.bookings.lastMonth}</span>
                            ) : (
                              <span className="text-xs ml-1 text-red-600">↓{experience.bookings.lastMonth - experience.bookings.thisMonth}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button size="sm">Manage Bookings</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft">
          <div className="space-y-6">
            {[
              {
                title: "Night Market Food Tour",
                description: "Sample delicious street food at the vibrant local night market.",
                category: "Food & Drink",
                image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80",
                completion: 80,
                lastEdited: "2 days ago"
              },
              {
                title: "Sustainable Fishing Experience",
                description: "Join local fishermen and learn sustainable fishing practices.",
                category: "Outdoor Activities",
                image: "https://images.unsplash.com/photo-1515847049296-a281d6401047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                completion: 45,
                lastEdited: "1 week ago"
              }
            ].map((draft, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 h-full min-h-[150px] relative">
                    <img 
                      src={draft.image} 
                      alt={draft.title} 
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{draft.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {draft.category}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="bg-gray-100">
                          Draft
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {draft.description}
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Completion</span>
                          <span className="text-xs text-gray-500">{draft.completion}%</span>
                        </div>
                        <Progress value={draft.completion} className="h-2" />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Last edited {draft.lastEdited}</span>
                          {draft.completion >= 80 ? (
                            <span className="text-xs text-green-600">Ready to publish</span>
                          ) : (
                            <span className="text-xs text-orange-600">Needs more details</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Delete</Button>
                        <Button size="sm">Continue Editing</Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded border">
                  <p className="text-gray-500">Line chart would appear here</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: "This Week", value: "8", change: "+2" },
                    { label: "This Month", value: "28", change: "+5" },
                    { label: "This Year", value: "147", change: "+43" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Cultural Heritage Tour", bookings: 72, rating: 4.9 },
                    { name: "Traditional Cuisine Workshop", bookings: 55, rating: 4.7 },
                    { name: "Artisan Craft Workshop", bookings: 20, rating: 4.8 },
                  ].map((exp, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{exp.name}</div>
                        <div className="flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                          {exp.rating}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{exp.bookings}</div>
                        <div className="text-xs text-gray-500">bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="font-medium mb-2">Top Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Cultural", "Food", "Workshop", "Walking", "Traditional", "Authentic"].map((tag, i) => (
                      <div key={i} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                        <Tag className="h-3 w-3 mr-1 text-gray-500" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded border">
                  <p className="text-gray-500">Bar chart would appear here</p>
                </div>
                
                <div className="grid grid-cols-4 gap-6 mt-6">
                  {[
                    { label: "Total Revenue", value: "$12,450", change: "+18%", color: "text-green-600" },
                    { label: "Average Booking", value: "$85", change: "+3%", color: "text-green-600" },
                    { label: "Cancellation Rate", value: "4.2%", change: "-1.1%", color: "text-green-600" },
                    { label: "Repeat Customers", value: "38%", change: "+5%", color: "text-green-600" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className={`text-xs ${stat.color}`}>{stat.change}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyHostedExperiences;
