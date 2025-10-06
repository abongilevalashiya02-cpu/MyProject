
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, PlayCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '../types/course-types';

interface FeaturedCourseProps {
  course: Course;
}

const FeaturedCourse: React.FC<FeaturedCourseProps> = ({ course }) => {
  return (
    <Card className="mb-8 overflow-hidden border-2 border-bantu-orange/20">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="aspect-[16/9] md:aspect-auto relative overflow-hidden">
          <img 
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${course.categoryColor} border-none`}>
              {course.category}
            </Badge>
            <Badge className="bg-bantu-orange/90 text-white border-none">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        </div>
        
        <div className="p-6 flex flex-col">
          <div>
            <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{course.modules} Modules</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {course.progress > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">Progress</span>
                <span className="text-bantu-orange">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}
          
          <Button className="mt-auto" asChild>
            <Link to={course.path || "#"}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Flagship Course
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedCourse;
