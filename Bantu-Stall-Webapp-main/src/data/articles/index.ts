
import { ArticleType } from '@/types/marketplace';
import { businessArticles } from './businessArticles';

// Combine all article categories
export const articles: ArticleType[] = [
  ...businessArticles
];

// Export individual categories for specific use cases
export { businessArticles };

// Helper functions for filtering articles
export const getFeaturedArticles = (): ArticleType[] => {
  return articles.filter(article => article.featured);
};

export const getArticlesByCategory = (category: string): ArticleType[] => {
  return articles.filter(article => article.category.toLowerCase() === category.toLowerCase());
};

export const getLatestArticles = (count: number = 3): ArticleType[] => {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

export const getArticleById = (id: number): ArticleType | undefined => {
  return articles.find(article => article.id === id);
};
