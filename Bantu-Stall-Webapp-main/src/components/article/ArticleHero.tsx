
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ArticleHeroProps {
  title: string;
  category: string;
  image: string;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ title, category, image }) => {
  return (
    <header className="relative h-96 bg-gray-900 overflow-hidden">
      <img 
        src={image} 
        alt={`${title} - G20 2025 South Africa Summit Media Strategy`}
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="absolute bottom-8 left-0 right-0">
        <div className="container mx-auto px-6">
          <nav className="mb-4" aria-label="Breadcrumb">
            <Link to="/indaba" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Indaba
            </Link>
          </nav>
          
          <Badge variant="outline" className="text-bantu-orange border-bantu-orange bg-white/10 backdrop-blur-sm mb-4">
            {category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default ArticleHero;
