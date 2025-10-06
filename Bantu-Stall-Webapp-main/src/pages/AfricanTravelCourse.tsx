
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CourseNavigation from "@/components/courses/african-travel/CourseNavigation";
import CourseOutline from "@/components/courses/african-travel/CourseOutline";
import CourseModuleContent from "@/components/courses/african-travel/CourseModuleContent";
import { courseModules } from "@/components/courses/african-travel/courseData";

const AfricanTravelCourse = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const handleModuleComplete = (moduleIndex: number) => {
    if (!completedModules.includes(moduleIndex)) {
      const newCompleted = [...completedModules, moduleIndex];
      setCompletedModules(newCompleted);
      
      // Calculate new progress
      const newProgress = Math.round((newCompleted.length / courseModules.length) * 100);
      setProgress(newProgress);
    }
  };

  const handleModuleChange = (moduleIndex: number) => {
    setActiveModule(moduleIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link to="/mafunzo/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-xl font-bold">African Travel Essentials</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium">Overall Progress</p>
                <div className="flex items-center space-x-3">
                  <Progress value={progress} className="w-32 h-2" />
                  <span className="text-xs font-medium">{progress}%</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-none">
                2 Hours
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <CourseNavigation 
                  modules={courseModules}
                  activeModule={activeModule}
                  completedModules={completedModules}
                  onModuleChange={handleModuleChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Module Content Area */}
          <div className="lg:col-span-3">
            {activeModule === -1 ? (
              <CourseOutline 
                modules={courseModules}
                completedModules={completedModules}
                onStartModule={handleModuleChange}
              />
            ) : (
              <CourseModuleContent
                module={courseModules[activeModule]}
                onComplete={() => handleModuleComplete(activeModule)}
                onNavigateToModule={handleModuleChange}
                isCompleted={completedModules.includes(activeModule)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AfricanTravelCourse;
