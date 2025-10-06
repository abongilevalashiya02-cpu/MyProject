
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, PieChart, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const topics = [
  { 
    name: "Cultural Understanding", 
    progress: 68, 
    modules: [
      { name: "Traditional Customs", completed: true },
      { name: "Social Etiquette", completed: true },
      { name: "Cultural Taboos", completed: true },
      { name: "Family Structures", completed: false },
      { name: "Religious Practices", completed: false }
    ] 
  },
  { 
    name: "Leadership Skills", 
    progress: 45, 
    modules: [
      { name: "Cross-Cultural Communication", completed: true },
      { name: "Conflict Resolution", completed: true },
      { name: "Team Facilitation", completed: false },
      { name: "Ethical Decision Making", completed: false }
    ] 
  },
  { 
    name: "Language Basics", 
    progress: 30, 
    modules: [
      { name: "Greetings & Introductions", completed: true },
      { name: "Everyday Phrases", completed: true },
      { name: "Numbers & Time", completed: false },
      { name: "Travel Vocabulary", completed: false },
      { name: "Market & Shopping", completed: false }
    ] 
  },
  { 
    name: "History & Context", 
    progress: 20, 
    modules: [
      { name: "Pre-Colonial History", completed: true },
      { name: "Colonial Period", completed: false },
      { name: "Independence Movements", completed: false },
      { name: "Modern Political Context", completed: false }
    ] 
  }
];

const recentActivities = [
  { 
    type: "Completed Module", 
    title: "Traditional Customs", 
    course: "Cultural Understanding", 
    date: "Today, 10:23 AM", 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> 
  },
  { 
    type: "Started Module", 
    title: "Family Structures", 
    course: "Cultural Understanding", 
    date: "Yesterday, 3:45 PM", 
    icon: <BookOpen className="h-4 w-4 text-blue-500" /> 
  },
  { 
    type: "Quiz Completed", 
    title: "Cross-Cultural Communication", 
    course: "Leadership Skills", 
    date: "2 days ago", 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> 
  },
  { 
    type: "Time Spent", 
    title: "45 minutes learning session", 
    course: "Language Basics", 
    date: "3 days ago", 
    icon: <Clock className="h-4 w-4 text-orange-500" /> 
  }
];

const LearningProgress = () => {
  // Calculate overall progress
  const overallProgress = Math.round(
    topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length
  );
  
  // Count completed modules
  const completedModules = topics.reduce((sum, topic) => 
    sum + topic.modules.filter(m => m.completed).length, 0
  );
  
  // Count total modules
  const totalModules = topics.reduce((sum, topic) => 
    sum + topic.modules.length, 0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Progress</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-bantu-orange/10 p-8 mb-4">
                <div className="text-3xl font-bold text-bantu-orange">{overallProgress}%</div>
              </div>
              <div className="text-sm text-gray-500">
                You're making excellent progress!
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
              <div className="inline-flex items-center justify-center rounded-full bg-bantu-yellow/10 p-8 mb-4">
                <div className="text-3xl font-bold text-bantu-yellow">
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
            <CardTitle className="text-sm text-gray-500">Time Spent Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-8 mb-4">
                <div className="text-3xl font-bold text-green-600">12.5h</div>
              </div>
              <div className="text-sm text-gray-500">
                Total time spent on courses
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Progress by Topic</span>
                <BarChart className="h-5 w-5 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topics.map((topic, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium">{topic.name}</h4>
                        <p className="text-xs text-gray-500">
                          {topic.modules.filter(m => m.completed).length} of {topic.modules.length} modules completed
                        </p>
                      </div>
                      <span className="text-sm font-medium">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2 mb-3" />
                    <div className="grid grid-cols-2 gap-2">
                      {topic.modules.map((module, j) => (
                        <div 
                          key={j} 
                          className={`text-xs p-2 rounded flex items-center ${
                            module.completed 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          )}
                          <span className="truncate">{module.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Learning Distribution</span>
                <PieChart className="h-5 w-5 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52 flex items-center justify-center">
                <div className="relative h-40 w-40">
                  {/* This would be a pie chart in a real implementation */}
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-bantu-orange" 
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)' }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-bantu-yellow" 
                    style={{ clipPath: 'polygon(0 40%, 100% 40%, 100% 65%, 0 65%)' }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-green-400" 
                    style={{ clipPath: 'polygon(0 65%, 100% 65%, 100% 80%, 0 80%)' }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-blue-400" 
                    style={{ clipPath: 'polygon(0 80%, 100% 80%, 100% 100%, 0 100%)' }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-bantu-orange mr-2"></div>
                  <span>Cultural (40%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-bantu-yellow mr-2"></div>
                  <span>Leadership (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span>Language (15%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span>History (20%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div>
                {recentActivities.map((activity, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <Separator />}
                    <div className="p-4">
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
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
