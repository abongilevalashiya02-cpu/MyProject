
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const ApplicationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Applications</h1>
        <Button asChild>
          <Link to="/service-provider/apply">New Application</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cultural Cooking Experience</CardTitle>
              <CardDescription>Submitted on Apr 1, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <Badge className="mb-2">Culinary Expert</Badge>
                  <p className="text-sm text-gray-600">
                    Learn to make authentic local dishes with fresh ingredients from the market.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button>View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Historic City Photography Tour</CardTitle>
              <CardDescription>Submitted on Mar 28, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <Badge className="mb-2">Photographer</Badge>
                  <p className="text-sm text-gray-600">
                    Guided photography tour of historic landmarks with professional equipment provided.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button>View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cultural Heritage Walking Tour</CardTitle>
              <CardDescription>Approved on Mar 15, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <Badge className="mb-2 bg-green-100 text-green-800">Tour Guide</Badge>
                  <p className="text-sm text-gray-600">
                    Explore the hidden cultural gems of our city with a knowledgeable local guide.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">Edit Listing</Button>
                  <Button>Manage Experience</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Extreme Adventure Tour</CardTitle>
              <CardDescription>Rejected on Feb 20, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <Badge variant="destructive" className="mb-2">Tour Guide</Badge>
                  <p className="text-sm text-gray-600 mb-2">
                    High-adrenaline adventure tour with cliff jumping and remote hiking.
                  </p>
                  <p className="text-sm font-medium text-red-600">
                    Reason: Safety concerns and insurance requirements not met.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">View Feedback</Button>
                  <Button>Resubmit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
