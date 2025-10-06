
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, MapPin, Users, Truck, Megaphone, 
  BookOpen, GraduationCap, ArrowRight, Clock, Lock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';

const moduleIcons = {
  "Introduction": <Globe className="h-10 w-10 mb-4 text-blue-500" />,
  "Planning": <MapPin className="h-10 w-10 mb-4 text-green-500" />,
  "Cultural": <Users className="h-10 w-10 mb-4 text-purple-500" />,
  "Logistics": <Truck className="h-10 w-10 mb-4 text-amber-500" />,
  "Marketing": <Megaphone className="h-10 w-10 mb-4 text-red-500" />,
  "Case Studies": <BookOpen className="h-10 w-10 mb-4 text-indigo-500" />,
  "Assessment": <GraduationCap className="h-10 w-10 mb-4 text-emerald-500" />,
};

type ModuleStatus = 'unlocked' | 'in-progress' | 'locked' | 'completed';

interface ModuleProps {
  number: number;
  title: string;
  description: string;
  icon: keyof typeof moduleIcons;
  status: ModuleStatus;
  progress?: number;
  duration: string;
  topics: string[];
}

const modules: ModuleProps[] = [
  {
    number: 1,
    title: "Introduction to African Tourism",
    description: "Discover the rich diversity of African regions and their captivating attractions that await travelers from around the globe.",
    icon: "Introduction",
    status: "in-progress",
    progress: 35,
    duration: "2 hours",
    topics: [
      "Overview of African Tourism Industry",
      "Key Tourist Destinations Across Africa",
      "Understanding Regional Differences",
      "Tourism Statistics and Growth Trends"
    ]
  },
  {
    number: 2,
    title: "Planning and Designing Tours in Africa",
    description: "Master the art of crafting bespoke itineraries tailored to every traveler's dream, from wildlife safaris to cultural odysseys.",
    icon: "Planning",
    status: "unlocked",
    duration: "3 hours",
    topics: [
      "Itinerary Development Principles",
      "Balancing Activities and Rest",
      "Seasonal Considerations",
      "Accessibility and Transportation Planning"
    ]
  },
  {
    number: 3,
    title: "Cultural Immersion and Authentic Experiences",
    description: "Immerse yourself in the heart of African cultures and traditions, fostering meaningful connections and sustainable tourism practices.",
    icon: "Cultural",
    status: "locked",
    duration: "2.5 hours",
    topics: [
      "Ethical Cultural Exchange",
      "Community-Based Tourism",
      "Traditional Practices and Ceremonies",
      "Food and Culinary Experiences"
    ]
  },
  {
    number: 4,
    title: "Logistics and Operational Management",
    description: "Navigate the complexities of logistics and operational excellence in multi-country tours, ensuring seamless experiences for all.",
    icon: "Logistics",
    status: "locked",
    duration: "3.5 hours",
    topics: [
      "Border Crossing Procedures",
      "Accommodation Management",
      "Transportation Coordination",
      "Health and Safety Protocols"
    ]
  },
  {
    number: 5,
    title: "Marketing and Promoting African Tours",
    description: "Learn the secrets to effectively market and sell African tour packages, captivating audiences through compelling storytelling and digital prowess.",
    icon: "Marketing",
    status: "locked",
    duration: "3 hours",
    topics: [
      "Storytelling and Content Creation",
      "Digital Marketing Strategies",
      "Photography and Visual Representation",
      "Targeting the Right Audiences"
    ]
  },
  {
    number: 6,
    title: "Case Studies and Best Practices",
    description: "Dive into real-world case studies and industry best practices that showcase the transformative power of African tourism done right.",
    icon: "Case Studies",
    status: "locked",
    duration: "4 hours",
    topics: [
      "Success Stories from Different Regions",
      "Overcoming Common Challenges",
      "Innovation in African Tourism",
      "Sustainable Tourism Models"
    ]
  },
  {
    number: 7,
    title: "Assessment and Certification",
    description: "Challenge yourself with quizzes, assignments, and a final assessment to earn your digital certificate of mastery in African tourism planning.",
    icon: "Assessment",
    status: "locked",
    duration: "2 hours",
    topics: [
      "Module Quizzes Review",
      "Practical Assignment",
      "Final Comprehensive Assessment",
      "Digital Certificate Issuance"
    ]
  }
];

const CourseProgress = () => {
  // Calculate overall course progress
  const completedModules = 0;
  const inProgressModules = 2;
  const totalModules = modules.length;
  const progressPercentage = Math.round(((completedModules + (inProgressModules * 0.5)) / totalModules) * 100);
  
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1">African Tourism Specialist Course</h3>
            <p className="text-gray-600">Master the art of planning and executing unforgettable African tours</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
            Flagship Course
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Modules</p>
              <p className="font-bold">{totalModules} Modules</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-bold">20 Hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion</p>
              <p className="font-bold">{progressPercentage}% Complete</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Course Progress</p>
            <p className="text-sm text-gray-500">
              {completedModules} completed, {inProgressModules} in progress, {totalModules - completedModules - inProgressModules} to go
            </p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

const ModuleCard: React.FC<ModuleProps> = ({ 
  number, title, description, icon, status, progress, duration, topics 
}) => {
  const navigate = useNavigate();
  
  const handleModuleAction = () => {
    if (status === 'locked') return;
    
    if (number === 1) {
      navigate('/mafunzo/african-tourism/module1');
    } else if (number === 2) {
      navigate('/mafunzo/african-tourism/module2');
    }
  };
  
  return (
    <Card className={`overflow-hidden ${status === 'locked' ? 'opacity-70' : 'card-hover'}`}>
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-3 rounded-lg ${status === 'locked' ? 'bg-gray-100' : 'bg-bantu-orange/10'}`}>
              {moduleIcons[icon]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-gray-100 text-gray-700 border-none">
                  Module {number}
                </Badge>
                {status === 'in-progress' && (
                  <Badge className="bg-blue-100 text-blue-800 border-none">
                    In Progress
                  </Badge>
                )}
                {status === 'completed' && (
                  <Badge className="bg-green-100 text-green-800 border-none">
                    Completed
                  </Badge>
                )}
                {status === 'unlocked' && (
                  <Badge className="bg-amber-100 text-amber-800 border-none">
                    Ready to Start
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{duration}</span>
              </div>
            </div>
          </div>
          
          {status === 'locked' && (
            <div className="bg-gray-100 p-2 rounded-full">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
        
        {status === 'in-progress' && progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-bantu-orange">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h4 className="font-medium mb-3">Topics Covered:</h4>
        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-bantu-orange rounded-full mt-2 mr-2"></span>
              <span className="text-sm text-gray-700">{topic}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <CardFooter className="px-6 py-4 bg-gray-50 border-t">
        <Button 
          className="w-full" 
          variant={status === 'locked' ? "outline" : "default"} 
          disabled={status === 'locked'}
          onClick={handleModuleAction}
        >
          {status === 'completed' ? 'Review Module' : 
           status === 'in-progress' ? 'Continue Learning' : 
           status === 'unlocked' ? 'Start Module' : 'Locked'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const AfricanTourismCourse = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">African Tourism Specialist</h2>
        <p className="text-gray-600">Master the skills needed to create and operate exceptional African tours</p>
      </div>
      
      <CourseProgress />
      
      <div className="space-y-8">
        {modules.map((module) => (
          <ModuleCard key={module.number} {...module} />
        ))}
      </div>
      
      <Separator className="my-10" />
      
      <div className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 p-8 rounded-lg text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-bantu-orange mb-4" />
        <h3 className="text-2xl font-bold mb-2">Ready to Become an African Tourism Specialist?</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Complete all modules and pass the final assessment to earn your digital certificate 
          and demonstrate your expertise in African tourism planning and management.
        </p>
        <Button size="lg" className="bg-bantu-orange hover:bg-bantu-orange/90">
          Continue Your Learning Journey
        </Button>
      </div>
    </div>
  );
};

export default AfricanTourismCourse;
