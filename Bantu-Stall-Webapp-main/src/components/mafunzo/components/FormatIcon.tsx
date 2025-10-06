
import React from 'react';
import { Video, FileText, BookOpen } from 'lucide-react';
import { CourseFormat } from '../types/course-types';

interface FormatIconProps {
  format: CourseFormat;
  className?: string;
}

const FormatIcon: React.FC<FormatIconProps> = ({ format, className }) => {
  switch (format) {
    case 'video':
      return <Video className={className || "h-4 w-4"} />;
    case 'text':
      return <FileText className={className || "h-4 w-4"} />;
    case 'mixed':
      return <BookOpen className={className || "h-4 w-4"} />;
    default:
      return <BookOpen className={className || "h-4 w-4"} />;
  }
};

export default FormatIcon;
