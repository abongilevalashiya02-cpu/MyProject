
import React from 'react';
import { User, Calendar, Clock } from 'lucide-react';

interface ArticleMetaProps {
  author: string;
  date: string;
  readTime: string;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ author, date, readTime }) => {
  return (
    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
      <div className="flex items-center">
        <User className="h-4 w-4 mr-2" />
        <span itemProp="author">{author}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        <time dateTime={new Date(date).toISOString()} itemProp="datePublished">
          {date}
        </time>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span itemProp="timeRequired">{readTime}</span>
      </div>
    </div>
  );
};

export default ArticleMeta;
