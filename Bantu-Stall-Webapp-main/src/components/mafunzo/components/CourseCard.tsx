
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '../types/course-types';
import CulturalEtiquetteGuide from '@/components/shared/CulturalEtiquetteGuide';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showEtiquette, setShowEtiquette] = React.useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-500">{course.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className="bg-secondary text-secondary-foreground border-none">{course.category}</Badge>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">{course.duration}</span>
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">{course.students || 0} students</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Progress:</span>
          <Progress value={course.progress} className="w-32 h-2" />
          <span className="text-sm text-gray-500">{course.progress}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <Button asChild>
            <Link to={`/courses/${course.id}`}>
              Start Course
            </Link>
          </Button>
          {course.category === 'cultural-etiquette' && (
            <Button variant="secondary" onClick={() => setShowEtiquette(true)}>
              View Etiquette
            </Button>
          )}
        </div>
      </CardFooter>
      {course.category === 'cultural-etiquette' && showEtiquette && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">Cultural Etiquette Guide</h2>
              <Button variant="ghost" onClick={() => setShowEtiquette(false)}>✕</Button>
            </div>
            <div className="p-6">
              <CulturalEtiquetteGuide />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CourseCard;
