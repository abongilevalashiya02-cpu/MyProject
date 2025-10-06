
import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLatestArticles } from '@/data/articleContent';

const NewsAndEvents: React.FC = () => {
  // Get the latest 4 articles from your actual data
  const latestArticles = getLatestArticles(4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Indaba
          </h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest insights and stories shaping the African business and cultural landscape.
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                to={`/indaba/${article.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:bg-orange-50 border border-gray-100"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-bantu-orange text-lg mb-2 line-clamp-2 group-hover:text-bantu-orange/80 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            to="/indaba"
            className="inline-flex items-center px-6 py-3 bg-bantu-orange text-white rounded-lg hover:bg-bantu-orange/90 transition-colors font-semibold"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsAndEvents;
