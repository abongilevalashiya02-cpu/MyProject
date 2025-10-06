
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type UserType = 'traveler' | 'host' | 'abantu';

interface MyLearningProgressProps {
  userType: UserType;
}

const courses = [
  { 
    id: 1,
    title: "Cultural Etiquette Essentials", 
    description: "Learn the essential cultural norms and practices of different regions.",
    progress: 75, 
    modules: 6,
    completedModules: 5,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  { 
    id: 2,
    title: "Leadership Across Borders", 
    description: "Develop leadership skills that translate across cultural boundaries.",
    progress: 45, 
    modules: 8,
    completedModules: 3,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  { 
    id: 3,
    title: "History of East Africa", 
    description: "Explore the rich history and heritage of East African nations.",
    progress: 20, 
    modules: 10,
    completedModules: 2,
    image: "https://images.unsplash.com/photo-1589825274556-02443adc2212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80"
  }
];

const badges = [
  {
    id: 1,
    name: "Cultural Navigator",
    description: "Completed 3 cultural awareness courses",
    acquired: true,
    image: "🧭",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Linguistic Explorer",
    description: "Learned basic phrases in 5 languages",
    acquired: true,
    image: "🔤",
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Cuisine Connoisseur",
    description: "Completed all culinary modules",
    acquired: false,
    progress: 60,
    image: "🍲",
    color: "bg-orange-500"
  },
  {
    id: 4,
    name: "Global Citizen",
    description: "Earned all regional knowledge badges",
    acquired: false,
    progress: 25,
    image: "🌍",
    color: "bg-green-500"
  }
];

const MyLearningProgress: React.FC<MyLearningProgressProps> = ({ userType }) => {
  // Calculate overall progress
  const overallProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );
  
  // Count completed modules
  const completedModules = courses.reduce((sum, course) => 
    sum + course.completedModules, 0
  );
  
  // Count total modules
  const totalModules = courses.reduce((sum, course) => 
    sum + course.modules, 0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Learning Progress</h2>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Browse All Courses
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-8 mb-4">
                <div className="text-3xl font-bold text-green-600">{overallProgress}%</div>
              </div>
              <div className="text-sm text-gray-500">
                You're making steady progress!
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Modules Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-8 mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {completedModules}/{totalModules}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Keep going, you're doing great!
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-8 mb-4">
                <div className="text-3xl font-bold text-purple-600">
                  {badges.filter(badge => badge.acquired).length}/{badges.length}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Collect them all!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map((course, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-full sm:w-32 h-24 overflow-hidden rounded">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{course.description}</p>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-xs text-gray-500">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2 mb-2" />
                        <div className="flex items-center text-xs text-gray-500">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {course.completedModules} of {course.modules} modules completed
                        </div>
                      </div>
                      <div>
                        <Button size="sm">
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {badges.map((badge, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.color} text-white text-lg`}>
                        {badge.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          {badge.acquired && (
                            <BadgeCheck className="h-4 w-4 ml-1 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                        {!badge.acquired && badge.progress && (
                          <div className="mt-1">
                            <Progress value={badge.progress} className="h-1" />
                            <div className="text-xs text-right mt-0.5 text-gray-400">
                              {badge.progress}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {userType === 'traveler' && (
                <>
                  <Separator className="my-4" />
                  <div className="text-center bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg">
                    <GraduationCap className="h-10 w-10 mx-auto mb-2 text-green-600" />
                    <h4 className="font-medium mb-1">Next Certification</h4>
                    <Badge className="bg-green-500 hover:bg-green-600 mb-2">
                      Cultural Ambassador
                    </Badge>
                    <p className="text-xs text-gray-600">Complete 2 more courses to earn this certification</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[
              { 
                type: "Completed Module", 
                title: "Traditional Customs", 
                course: "Cultural Etiquette Essentials", 
                date: "Today, 10:23 AM", 
                icon: <BadgeCheck className="h-4 w-4 text-green-500" /> 
              },
              { 
                type: "Started Module", 
                title: "Family Structures", 
                course: "Cultural Etiquette Essentials", 
                date: "Yesterday, 3:45 PM", 
                icon: <BookOpen className="h-4 w-4 text-blue-500" /> 
              },
              { 
                type: "Quiz Completed", 
                title: "Cross-Cultural Communication", 
                course: "Leadership Across Borders", 
                date: "2 days ago", 
                icon: <BadgeCheck className="h-4 w-4 text-green-500" /> 
              },
              { 
                type: "Time Spent", 
                title: "45 minutes learning session", 
                course: "History of East Africa", 
                date: "3 days ago", 
                icon: <Clock className="h-4 w-4 text-orange-500" /> 
              }
            ].map((activity, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <div className="flex">
                  <div className="mr-3">{activity.icon}</div>
                  <div>
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-xs text-gray-700 mb-1">{activity.title}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{activity.course}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyLearningProgress;
