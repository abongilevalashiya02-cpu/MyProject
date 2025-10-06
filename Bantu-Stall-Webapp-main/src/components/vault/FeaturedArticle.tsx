
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ArticleType } from '../../types/marketplace';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  article: ArticleType;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[400px] lg:h-auto relative overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <Badge variant="outline" className="text-bantu-orange border-bantu-orange mb-4">
              {article.category}
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4 leading-tight">
              {article.title}
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{article.author}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <Link to={`/indaba/${article.id}`}>
            <Button variant="link" className="text-bantu-orange font-medium p-0 w-fit flex items-center group">
              Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default FeaturedArticle;
