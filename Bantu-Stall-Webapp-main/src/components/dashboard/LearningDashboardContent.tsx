import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Award, Target, TrendingUp, Clock, Star, 
  PlayCircle, CheckCircle, Brain, GraduationCap
} from 'lucide-react';

const LearningDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    {
      id: 1,
      title: 'African Tourism Fundamentals',
      progress: 75,
      duration: '4 hours',
      level: 'Beginner',
      enrolled: true,
      rating: 4.8,
      modules: 8,
      completed: 6
    },
    {
      id: 2,
      title: 'Cultural Heritage Sites',
      progress: 45,
      duration: '6 hours',
      level: 'Intermediate',
      enrolled: true,
      rating: 4.9,
      modules: 12,
      completed: 5
    },
    {
      id: 3,
      title: 'Sustainable Travel Practices',
      progress: 0,
      duration: '3 hours',
      level: 'Beginner',
      enrolled: false,
      rating: 4.7,
      modules: 6,
      completed: 0
    }
  ];

  const certificates = [
    {
      id: 1,
      title: 'African Tourism Expert',
      issued: '2024-01-15',
      validUntil: '2026-01-15',
      credentialId: 'ATE-2024-001',
      type: 'Professional'
    },
    {
      id: 2,
      title: 'Cultural Heritage Guide',
      issued: '2024-02-20',
      validUntil: '2026-02-20',
      credentialId: 'CHG-2024-015',
      type: 'Specialist'
    }
  ];

  const learningStats = [
    { label: 'Courses Completed', value: '8', trend: '+2', icon: BookOpen },
    { label: 'Study Hours', value: '156', trend: '+24', icon: Clock },
    { label: 'Certificates', value: '5', trend: '+1', icon: Award },
    { label: 'Overall Score', value: '92%', trend: '+5%', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Hub</h2>
          <p className="text-muted-foreground">Enhance your African tourism knowledge</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Browse All Courses
        </Button>
      </div>

      {/* Learning Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {learningStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-green-600">8</div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">3</div>
                <div className="text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">12</div>
                <div className="text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <Badge variant="outline">{course.level}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                      
                      {course.enrolled && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress: {course.completed}/{course.modules} modules</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {course.enrolled ? (
                        <Button>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continue
                        </Button>
                      ) : (
                        <Button variant="outline">
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.filter(c => c.enrolled).map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{course.title}</h4>
                      <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                        {course.progress === 100 ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Modules Completed</span>
                        <span>{course.completed}/{course.modules}</span>
                      </div>
                      <Progress value={(course.completed / course.modules) * 100} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Time Invested: {Math.floor(course.progress * 0.04)} hours</span>
                        <span>{course.progress}% Complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{cert.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Issued: {new Date(cert.issued).toLocaleDateString()}</div>
                          <div>Valid until: {new Date(cert.validUntil).toLocaleDateString()}</div>
                          <div>Credential ID: {cert.credentialId}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{cert.type}</Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
                <p className="text-muted-foreground mb-4">
                  Based on your learning progress, we'll recommend relevant courses
                </p>
                <Button>
                  View All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningDashboardContent;
