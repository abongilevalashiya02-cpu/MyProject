
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, ArrowRight, Clock, Award } from "lucide-react";
import { CourseModule } from './courseData';

interface CourseOutlineProps {
  modules: CourseModule[];
  completedModules: number[];
  onStartModule: (moduleIndex: number) => void;
}

const CourseOutline: React.FC<CourseOutlineProps> = ({
  modules,
  completedModules,
  onStartModule
}) => {
  const totalModules = modules.length;
  const completedCount = completedModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">African Travel Essentials</h1>
              <p className="text-gray-600">A comprehensive 2-hour course to prepare you for a meaningful journey across Africa</p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span className="mr-4">
                  <span className="font-medium">{completedCount}</span> of {totalModules} modules completed
                </span>
                <span>
                  <span className="font-medium">{progressPercentage}%</span> complete
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Course Highlights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Interactive maps, quizzes, and downloadable resources</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Cultural etiquette and Ubuntu philosophy explained</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Practical advice for health, safety, and authentic connections</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">What You'll Learn</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Navigate Africa's diversity with cultural sensitivity</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Essential preparation for different regions and experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Sustainable travel practices and supporting local communities</span>
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Course Modules</h2>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${completedModules.includes(index) ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1 mr-3">
                      {completedModules.includes(index) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Module {index + 1}: {module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      
                      {module.keyTopics && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 mb-1">Key topics:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {module.keyTopics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 mt-1"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={completedModules.includes(index) ? "outline" : "default"}
                    onClick={() => onStartModule(index)}
                  >
                    {completedModules.includes(index) ? "Review" : "Start"}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Certificate */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <Award className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Certificate: Culture Confident Traveler</h3>
                    <p className="text-sm text-gray-600">Complete all modules to earn your certificate</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={completedCount < totalModules}
                >
                  {completedCount < totalModules ? `${completedCount}/${totalModules} Complete` : "View Certificate"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseOutline;
