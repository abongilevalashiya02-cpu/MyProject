import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, CheckSquare, PenTool, BookOpen } from 'lucide-react';
import CulturalEtiquetteGuide from '@/components/shared/CulturalEtiquetteGuide';

const ResourceHub = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Resource Hub</h3>
      
      <Tabs defaultValue="cultural-etiquette">
        <TabsList>
          <TabsTrigger value="cultural-etiquette">Cultural Etiquette</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="cultural-etiquette" className="mt-6">
          <CulturalEtiquetteGuide />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-bantu-orange" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Cultural Etiquette Guides</h4>
                  <p className="text-sm text-gray-500">Best practices for cultural sensitivity and proper etiquette across Africa.</p>
                  <Button variant="link" size="sm" className="px-0 text-bantu-orange">
                    View Guides
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-bantu-orange" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Logistics Checklists</h4>
                  <p className="text-sm text-gray-500">Tour planning templates, operational checklists, and preparation guides.</p>
                  <Button variant="link" size="sm" className="px-0 text-bantu-orange">
                    View Checklists
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <PenTool className="h-6 w-6 text-bantu-orange" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Marketing Toolkit</h4>
                  <p className="text-sm text-gray-500">Campaign templates, promotional assets, and content creation guides.</p>
                  <Button variant="link" size="sm" className="px-0 text-bantu-orange">
                    View Toolkit
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-bantu-orange" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Case Study Database</h4>
                  <p className="text-sm text-gray-500">Extended case studies, analysis, and success stories from across Africa.</p>
                  <Button variant="link" size="sm" className="px-0 text-bantu-orange">
                    View Case Studies
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceHub;
