import React, { useState } from 'react';
import { ArticleType } from '../../types/marketplace';
import FeaturedArticle from '../vault/FeaturedArticle';
import ArticleGrid from '../vault/ArticleGrid';
import CategoryFilter from '../vault/CategoryFilter';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown } from 'lucide-react';
import { articles, getLatestArticles } from '@/data/articles';

// Generate categories dynamically from articles
const getCategories = () => {
  const uniqueCategories = [...new Set(articles.map(article => article.category))];
  return ["All", ...uniqueCategories.sort()];
};

const categories = getCategories();

const Indaba: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);
  
  // Always feature the latest article
  const featuredArticle = getLatestArticles(1)[0];
  const regularArticles = filteredArticles.filter(article => article.id !== featuredArticle.id);

  const scrollToArticles = () => {
    const articlesSection = document.getElementById('articles-section');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="pt-6 pb-6 bg-gray-50 border-b">
        <div className="container mx-auto px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Indaba
            </h1>
        </div>
      </div>
      
      <section className="bg-white py-12 flex-1">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-bantu-orange h-7 w-7" />
            <h2 className="font-serif text-4xl font-bold tracking-tight">Indaba</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mb-12">
            In-depth stories, insights, and perspectives on business, culture, and innovation across Africa.
          </p>

          <FeaturedArticle article={featuredArticle} />
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={scrollToArticles}
              variant="outline" 
              className="group flex items-center gap-2 text-bantu-orange border-bantu-orange hover:bg-bantu-orange hover:text-white"
            >
              See More Articles
              <ChevronDown className="h-4 w-4 group-hover:animate-bounce" />
            </Button>
          </div>
          
          <div id="articles-section" className="mt-20 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-6">Categories</h3>
                <Separator className="mb-6" />
                <CategoryFilter 
                  categories={categories} 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={setSelectedCategory} 
                />
              </div>
            </div>
            
            <div className="md:w-3/4">
              <ArticleGrid articles={regularArticles} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Indaba;
