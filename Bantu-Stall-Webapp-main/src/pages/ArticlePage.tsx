
import React from 'react';
import { useParams } from 'react-router-dom';
import { useArticleData } from '@/hooks/useArticleData';
import ArticleLayout from '@/components/article/ArticleLayout';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { article } = useArticleData(id);

  return <ArticleLayout article={article} />;
};

export default ArticlePage;
