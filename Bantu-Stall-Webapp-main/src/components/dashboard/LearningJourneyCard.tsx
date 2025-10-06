
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, CheckCircle, Map } from 'lucide-react';

const LearningJourneyCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-bantu-orange" />
          Learning Journey
        </CardTitle>
        <p className="text-sm text-gray-500">Mafunzo courses linked to your trips</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Course */}
          <div className="border rounded-lg p-3 bg-gradient-to-r from-bantu-orange/5 to-bantu-yellow/5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">Cultural Etiquette in Rwanda</h4>
                <p className="text-xs text-gray-500">Linked to your Kigali trip</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Play className="h-3 w-3 mr-1" />
                <span>Module 3 of 4</span>
              </div>
              <Button size="sm" className="bg-bantu-orange hover:bg-bantu-orange/90 text-xs">
                Continue Learning
              </Button>
            </div>
          </div>
          
          {/* Upcoming Courses */}
          <div className="space-y-2">
            {[
              {
                title: "Leadership in African Indigenous Systems",
                destination: "Uganda Safari",
                progress: 0,
                status: "upcoming"
              },
              {
                title: "Business Networking in Johannesburg",
                destination: "South Africa Business Trip",
                progress: 100,
                status: "completed"
              }
            ].map((course, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-500">For: {course.destination}</p>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      course.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status === 'completed' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" />Completed</>
                    ) : (
                      'Upcoming'
                    )}
                  </Badge>
                </div>
                
                {course.status !== 'completed' && (
                  <div className="mb-2">
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    disabled={course.status === 'upcoming'}
                  >
                    {course.status === 'completed' ? 'Review' : 'Start Soon'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Map className="h-3 w-3 mr-1" />
                Cultural Map Quiz
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Pre-departure Resources
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningJourneyCard;
