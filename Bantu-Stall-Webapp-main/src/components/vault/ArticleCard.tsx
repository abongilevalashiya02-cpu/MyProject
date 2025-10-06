
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ArticleType } from '../../types/marketplace';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: ArticleType;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <AspectRatio ratio={16/9} className="bg-muted">
        <img 
          src={article.image}
          alt={article.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </AspectRatio>
      
      <CardContent className="p-6">
        <Badge variant="outline" className="text-bantu-orange border-bantu-orange mb-3">
          {article.category}
        </Badge>
        
        <h3 className="font-serif text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <span>{article.readTime}</span>
        </div>
        
        <Link to={`/indaba/${article.id}`}>
          <Button variant="link" className="text-bantu-orange font-medium p-0 flex items-center group">
            Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
