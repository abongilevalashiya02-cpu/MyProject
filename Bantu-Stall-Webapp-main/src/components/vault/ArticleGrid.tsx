
import React from 'react';
import { ArticleType } from '../../types/marketplace';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: ArticleType[];
}

const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleGrid;
