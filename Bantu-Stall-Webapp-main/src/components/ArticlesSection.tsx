import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { articles as indabaArticles } from '@/data/articleContent';
import { Link } from 'react-router-dom';

// Use the latest 3 articles from indaba
const latestArticles = [...indabaArticles]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
  .map((article, index) => ({
    ...article,
    delay: `${0.2 + (index * 0.2)}s`
  }));

const ArticleCard = ({ article }: { article: typeof latestArticles[0] }) => {
  return (
    <div 
      className="rounded-2xl overflow-hidden shadow-md bg-white card-hover opacity-0 animate-fade-in"
      style={{ animationDelay: article.delay }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="bg-bantu-orange/10 text-bantu-orange text-xs font-medium px-2.5 py-0.5 rounded">
            {article.category}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{article.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>{article.date}</span>
          </div>
          <Link to={`/indaba/${article.id}`}>
            <Button variant="link" className="text-bantu-orange p-0 flex items-center">
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ArticlesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">From Indaba</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stories, insights, and guides to enhance your African journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/indaba">
            <Button className="button-primary">
              Explore All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
