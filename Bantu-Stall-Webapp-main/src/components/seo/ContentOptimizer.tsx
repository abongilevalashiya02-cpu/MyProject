import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Target, TrendingUp, Lightbulb } from 'lucide-react';

interface ContentAnalysis {
  titleScore: number;
  descriptionScore: number;
  keywordDensity: number;
  readabilityScore: number;
  suggestions: string[];
  warnings: string[];
  strengths: string[];
}

interface ContentOptimizerProps {
  title?: string;
  description?: string;
  content?: string;
  keywords?: string[];
  onOptimizationComplete?: (optimizedData: any) => void;
}

export const ContentOptimizer: React.FC<ContentOptimizerProps> = ({
  title: initialTitle = '',
  description: initialDescription = '',
  content: initialContent = '',
  keywords: initialKeywords = [],
  onOptimizationComplete
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);
  const [keywords, setKeywords] = useState(initialKeywords.join(', '));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const keywordList = useMemo(() => {
    return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }, [keywords]);

  const analysis = useMemo((): ContentAnalysis => {
    const titleScore = analyzeTitleSEO(title);
    const descriptionScore = analyzeDescriptionSEO(description);
    const keywordDensity = calculateKeywordDensity(keywordList, content);
    const readabilityScore = calculateReadabilityScore(content);

    const suggestions: string[] = [];
    const warnings: string[] = [];
    const strengths: string[] = [];

    // Title Analysis
    if (title.length < 30) warnings.push('Title is too short (recommended: 50-60 characters)');
    else if (title.length > 60) warnings.push('Title is too long (recommended: 50-60 characters)');
    else strengths.push('Title length is optimal');

    if (!keywordList.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      suggestions.push('Include primary keyword in title');
    } else {
      strengths.push('Title includes target keywords');
    }

    // Description Analysis
    if (description.length < 120) warnings.push('Description is too short (recommended: 150-160 characters)');
    else if (description.length > 160) warnings.push('Description is too long (recommended: 150-160 characters)');
    else strengths.push('Description length is optimal');

    // Keyword Density Analysis
    if (keywordDensity < 1) suggestions.push('Increase keyword usage in content (target: 1-3%)');
    else if (keywordDensity > 3) warnings.push('Keyword density too high - risk of keyword stuffing');
    else strengths.push('Keyword density is well-balanced');

    // Readability Analysis
    if (readabilityScore < 60) suggestions.push('Improve readability with shorter sentences and simpler words');
    else if (readabilityScore > 80) strengths.push('Content has excellent readability');

    // African Market Specific Suggestions
    const africanKeywords = ['Africa', 'African', 'Pan-African', 'cultural', 'heritage', 'community'];
    const hasAfricanContext = africanKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase()) || 
      title.toLowerCase().includes(keyword.toLowerCase()) ||
      description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasAfricanContext) {
      suggestions.push('Consider adding African cultural context for better regional relevance');
    } else {
      strengths.push('Content includes relevant African cultural context');
    }

    return {
      titleScore,
      descriptionScore,
      keywordDensity,
      readabilityScore,
      suggestions,
      warnings,
      strengths
    };
  }, [title, description, content, keywordList]);

  const overallScore = useMemo(() => {
    return Math.round((analysis.titleScore + analysis.descriptionScore + 
                     Math.min(100, analysis.readabilityScore) + 
                     Math.min(100, analysis.keywordDensity * 33)) / 4);
  }, [analysis]);

  const analyzeTitleSEO = (titleText: string): number => {
    let score = 0;
    if (titleText.length >= 30 && titleText.length <= 60) score += 40;
    else if (titleText.length > 0) score += 20;
    
    if (keywordList.some(keyword => titleText.toLowerCase().includes(keyword.toLowerCase()))) score += 30;
    
    // Emotional trigger words
    const emotionalWords = ['discover', 'explore', 'authentic', 'unique', 'exclusive', 'amazing'];
    if (emotionalWords.some(word => titleText.toLowerCase().includes(word))) score += 15;
    
    // Question format
    if (titleText.includes('?')) score += 15;
    
    return Math.min(100, score);
  };

  const analyzeDescriptionSEO = (descText: string): number => {
    let score = 0;
    if (descText.length >= 120 && descText.length <= 160) score += 40;
    else if (descText.length > 0) score += 20;
    
    if (keywordList.some(keyword => descText.toLowerCase().includes(keyword.toLowerCase()))) score += 30;
    
    // Call-to-action words
    const ctaWords = ['learn', 'discover', 'explore', 'join', 'connect', 'experience'];
    if (ctaWords.some(word => descText.toLowerCase().includes(word))) score += 15;
    
    // Unique value proposition
    const uniqueWords = ['only', 'exclusive', 'first', 'premier', 'leading'];
    if (uniqueWords.some(word => descText.toLowerCase().includes(word))) score += 15;
    
    return Math.min(100, score);
  };

  const calculateKeywordDensity = (keywordArray: string[], contentText: string): number => {
    if (!contentText || keywordArray.length === 0) return 0;
    
    const words = contentText.toLowerCase().split(/\s+/).length;
    const keywordCount = keywordArray.reduce((count, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = contentText.toLowerCase().match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    return (keywordCount / words) * 100;
  };

  const calculateReadabilityScore = (contentText: string): number => {
    if (!contentText) return 0;
    
    const sentences = contentText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = contentText.split(/\s+/).filter(w => w.length > 0).length;
    const syllables = countSyllables(contentText);
    
    if (sentences === 0 || words === 0) return 0;
    
    // Simplified Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, score));
  };

  const countSyllables = (text: string): number => {
    return text.toLowerCase()
      .replace(/[^a-z]/g, ' ')
      .split(' ')
      .filter(word => word.length > 0)
      .reduce((count, word) => {
        const syllableCount = word.replace(/[^aeiou]/g, '').length;
        return count + Math.max(1, syllableCount);
      }, 0);
  };

  const handleOptimize = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const optimizedData = {
      title: optimizeTitle(title, keywordList),
      description: optimizeDescription(description, keywordList),
      keywords: keywordList,
      analysis,
      score: overallScore
    };
    
    onOptimizationComplete?.(optimizedData);
    setIsAnalyzing(false);
  }, [title, description, keywordList, analysis, overallScore, onOptimizationComplete]);

  const optimizeTitle = (currentTitle: string, keywordArray: string[]): string => {
    if (!currentTitle) return 'Discover Authentic African Experiences | Bantu Stall';
    
    let optimized = currentTitle;
    
    // Ensure primary keyword is included
    if (keywordArray.length > 0 && !optimized.toLowerCase().includes(keywordArray[0].toLowerCase())) {
      optimized = `${keywordArray[0]} - ${optimized}`;
    }
    
    // Truncate if too long
    if (optimized.length > 60) {
      optimized = optimized.substring(0, 57) + '...';
    }
    
    return optimized;
  };

  const optimizeDescription = (currentDesc: string, keywordArray: string[]): string => {
    if (!currentDesc) {
      return 'Explore authentic African cultural experiences, connect with local communities, and discover unique business opportunities across the continent.';
    }
    
    let optimized = currentDesc;
    
    // Ensure description includes keywords
    keywordArray.slice(0, 2).forEach(keyword => {
      if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
        optimized += ` ${keyword}.`;
      }
    });
    
    // Truncate if too long
    if (optimized.length > 160) {
      optimized = optimized.substring(0, 157) + '...';
    }
    
    return optimized;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            SEO Content Optimizer
          </CardTitle>
          <CardDescription>
            Optimize your content for better search engine visibility and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall SEO Score</span>
              <Badge variant={getScoreBadgeVariant(overallScore)}>
                {overallScore}/100
              </Badge>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter page title..."
                className="bg-card"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Characters: {title.length}</span>
                <span className={getScoreColor(analysis.titleScore)}>
                  Score: {analysis.titleScore}/100
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="African business, cultural experiences..."
                className="bg-card"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meta description..."
              className="bg-card min-h-[80px]"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Characters: {description.length}</span>
              <span className={getScoreColor(analysis.descriptionScore)}>
                Score: {analysis.descriptionScore}/100
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content for analysis..."
              className="bg-card min-h-[120px]"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Words: {content.split(/\s+/).filter(w => w.length > 0).length}</span>
              <span>Keyword Density: {analysis.keywordDensity.toFixed(1)}%</span>
              <span>Readability: {analysis.readabilityScore.toFixed(0)}/100</span>
            </div>
          </div>

          {/* Analysis Results */}
          {(analysis.strengths.length > 0 || analysis.suggestions.length > 0 || analysis.warnings.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Warnings
                  </h4>
                  <ul className="space-y-1">
                    {analysis.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleOptimize}
            disabled={isAnalyzing}
            className="w-full"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Optimizing...' : 'Optimize Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};