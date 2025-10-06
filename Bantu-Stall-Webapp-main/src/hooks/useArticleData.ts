
import { useMemo } from 'react';
import { articles } from '@/data/articleContent';
import { ArticleType } from '@/types/marketplace';

export const useArticleData = (id: string | undefined) => {
  const article = useMemo(() => {
    if (!id) {
      return articles[0]; // Default to first article if no ID
    }
    
    const articleId = parseInt(id);
    const foundArticle = articles.find(a => a.id === articleId);
    
    // If article not found, return the first article as fallback
    return foundArticle || articles[0];
  }, [id]);

  return { article: article as ArticleType };
};
