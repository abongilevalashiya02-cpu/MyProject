
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomerIntakeForm from '@/components/forms/CustomerIntakeForm';
import ArticleHero from '@/components/article/ArticleHero';
import ArticleMeta from '@/components/article/ArticleMeta';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleCTA from '@/components/article/ArticleCTA';
import ArticleSummary from '@/components/article/ArticleSummary';
import ArticleSEO from '@/components/article/ArticleSEO';
import G20Countdown from '@/components/article/G20Countdown';
import { ArticleType } from '@/types/marketplace';

interface ArticleLayoutProps {
  article: ArticleType;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article }) => {
  return (
    <div className="min-h-screen flex flex-col font-avenir">
      <ArticleSEO article={article} />
      <Navbar />
      
      <main className="flex-1 pt-24">
        <article className="relative">
          <ArticleHero 
            title={article.title}
            category={article.category}
            image={article.image}
          />

          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <ArticleMeta 
                author={article.author}
                date={article.date}
                readTime={article.readTime}
              />

              {article.id === 1 && <G20Countdown />}

              <ArticleContent 
                excerpt={article.excerpt}
                content={article.content}
              />

              <ArticleCTA />

              <ArticleSummary />

              <section className="mt-16 pt-8 border-t">
                <CustomerIntakeForm />
              </section>

              <div className="mt-16 pt-8 border-t text-center">
                <Link to="/indaba">
                  <Button className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-3">
                    Explore More Articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleLayout;
