
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle } from "lucide-react";
import { CourseModule } from './courseData';

interface CourseNavigationProps {
  modules: CourseModule[];
  activeModule: number;
  completedModules: number[];
  onModuleChange: (moduleIndex: number) => void;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  modules,
  activeModule,
  completedModules,
  onModuleChange
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Course Contents</h2>
      
      <Button 
        variant={activeModule === -1 ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => onModuleChange(-1)}
      >
        Course Overview
      </Button>
      
      <Separator className="my-2" />
      
      <div className="space-y-1">
        {modules.map((module, index) => (
          <Button
            key={index}
            variant={activeModule === index ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onModuleChange(index)}
          >
            {completedModules.includes(index) ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Circle className="mr-2 h-4 w-4" />
            )}
            Module {index + 1}: {module.title}
          </Button>
        ))}
      </div>
      
      <Separator className="my-2" />
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Course Details</h3>
        <ul className="text-sm space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Duration: 2 hours
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            6 Interactive modules
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Mobile-optimized with offline access
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Completion certificate
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseNavigation;
