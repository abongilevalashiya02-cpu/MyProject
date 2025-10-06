
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import { courses } from './types/course-types';
import FeaturedCourse from './components/FeaturedCourse';
import CourseCard from './components/CourseCard';

const LearningCourses = () => {
  // Find the featured course
  const featuredCourses = courses.filter(course => course.featured);
  // Get regular courses (non-featured)
  const regularCourses = courses.filter(course => !course.featured);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Courses</h2>
        <Button variant="outline">
          <BarChart className="mr-2 h-4 w-4" />
          Filter Courses
        </Button>
      </div>
      
      {/* Featured Course Section */}
      {featuredCourses.map(course => (
        <FeaturedCourse key={`featured-${course.id}`} course={course} />
      ))}
      
      {/* Regular Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {regularCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default LearningCourses;
