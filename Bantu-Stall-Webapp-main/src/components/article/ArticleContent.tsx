
import React from 'react';
import MetricsCards from './MetricsCards';
import ComparisonSection from './ComparisonSection';
import PillarsSection from './PillarsSection';
import PerceptionTransform from './PerceptionTransform';
import CostEffectivenessChart from '@/components/charts/CostEffectivenessChart';
import LocalProcurementChart from '@/components/charts/LocalProcurementChart';

interface ArticleContentProps {
  excerpt: string;
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ excerpt, content }) => {
  const renderComponent = (componentName: string) => {
    switch (componentName) {
      case '<MetricsCards />':
        return <MetricsCards key="metrics" />;
      case '<ComparisonSection />':
        return <ComparisonSection key="comparison" />;
      case '<PillarsSection />':
        return <PillarsSection key="pillars" />;
      case '<PerceptionTransform />':
        return <PerceptionTransform key="perception" />;
      case '<CostEffectivenessChart />':
        return (
          <div key="cost-chart" className="w-full h-64 md:h-80 mb-8">
            <CostEffectivenessChart />
          </div>
        );
      case '<LocalProcurementChart />':
        return (
          <div key="procurement-chart" className="w-full h-64 md:h-80 mb-8">
            <LocalProcurementChart />
          </div>
        );
      default:
        return null;
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Handle standalone React components
      if (trimmedParagraph.match(/^<[A-Z][a-zA-Z]*.*\/>$/)) {
        const component = renderComponent(trimmedParagraph);
        if (component) {
          return component;
        }
      }

      // Skip JSX div blocks with className
      if (paragraph.includes('className=') || paragraph.includes('<div')) {
        return null;
      }

      // Handle img tags
      if (paragraph.includes('<img')) {
        const imgMatch = paragraph.match(/<img[^>]+>/);
        if (imgMatch) {
          const imgTag = imgMatch[0];
          const srcMatch = imgTag.match(/src="([^"]+)"/);
          const altMatch = imgTag.match(/alt="([^"]+)"/);
          const classMatch = imgTag.match(/class="([^"]+)"/);
          
          if (srcMatch) {
            const src = srcMatch[1];
            const alt = altMatch ? altMatch[1] : '';
            const className = classMatch ? classMatch[1] : 'w-full h-64 object-cover rounded-lg mb-8';
            
            return (
              <img
                key={index}
                src={src}
                alt={alt}
                className={className}
              />
            );
          }
        }
      }
      
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4" id={`section-${index}`}>
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-bantu-orange mt-6 mb-3">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }

      // Handle bullet points
      if (paragraph.includes('→') || paragraph.includes('-')) {
        const lines = paragraph.split('\n');
        return (
          <div key={index} className="my-4 space-y-2">
            {lines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-gray-700 leading-relaxed">
                {line.split('**').map((part, partIndex) => 
                  partIndex % 2 === 1 ? (
                    <strong key={partIndex} className="font-semibold text-bantu-orange">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            ))}
          </div>
        );
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {paragraph.split('**').map((part, partIndex) => 
            partIndex % 2 === 1 ? (
              <strong key={partIndex} className="font-semibold text-bantu-orange">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-lg max-w-none" itemProp="articleBody">
      <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium" itemProp="description">
        {excerpt}
      </div>
      
      <div className="text-gray-700 leading-relaxed">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default ArticleContent;
