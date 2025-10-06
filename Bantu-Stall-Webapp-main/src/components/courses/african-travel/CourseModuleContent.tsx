
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { CourseModule } from './courseData';
import Module1Content from './modules/Module1Content';
import Module2Content from './modules/Module2Content';
import Module3Content from './modules/Module3Content';
import Module4Content from './modules/Module4Content';
import Module5Content from './modules/Module5Content';
import Module6Content from './modules/Module6Content';
import FinalStepContent from './modules/FinalStepContent';

interface CourseModuleContentProps {
  module: CourseModule;
  onComplete: () => void;
  onNavigateToModule: (moduleIndex: number) => void;
  isCompleted: boolean;
}

const CourseModuleContent: React.FC<CourseModuleContentProps> = ({
  module,
  onComplete,
  onNavigateToModule,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState("content");

  const renderModuleContent = () => {
    switch (module.id) {
      case 1:
        return <Module1Content />;
      case 2:
        return <Module2Content />;
      case 3:
        return <Module3Content />;
      case 4:
        return <Module4Content />;
      case 5:
        return <Module5Content />;
      case 6:
        return <Module6Content />;
      case 7:
        return <FinalStepContent />;
      default:
        return <div>Module content not found</div>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Module {module.id}: {module.title}</h2>
            <p className="text-gray-600">{module.description}</p>
          </div>
          {isCompleted && (
            <div className="flex items-center text-green-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-1" /> Completed
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="content">Module Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="quiz">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="pt-4">
            {renderModuleContent()}
          </TabsContent>
          
          <TabsContent value="resources" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Downloadable Resources</h3>
              <ul className="space-y-2">
                {module.resources?.map((resource, index) => (
                  <li key={index} className="flex items-center">
                    <Button variant="outline" className="w-full justify-start">
                      {resource.icon}
                      <span className="ml-2">{resource.title}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="quiz" className="pt-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-4">Interactive Activities</h3>
              <p className="mb-6">Complete the interactive activities to test your knowledge from this module.</p>
              <Button onClick={onComplete}>
                Start Activities
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button 
          variant="outline" 
          onClick={() => onNavigateToModule(Math.max(0, module.id - 2))}
          disabled={module.id === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Module
        </Button>
        <Button 
          onClick={() => {
            onComplete();
            if (module.id < 7) {
              onNavigateToModule(module.id);
            }
          }}
        >
          {isCompleted ? "Review Completed" : "Mark as Complete"}
          {!isCompleted && module.id < 7 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseModuleContent;
