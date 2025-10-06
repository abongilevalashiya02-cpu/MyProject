import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Gauge, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay  
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  userExperience: {
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
    conversionRate: number;
  };
  technical: {
    bundleSize: number;
    loadTime: number;
    renderTime: number;
    apiLatency: number;
  };
}

interface PerformanceIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  threshold: number;
  impact: string;
  suggestion: string;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    coreWebVitals: {
      lcp: 2.1,
      fid: 85,
      cls: 0.08,
      fcp: 1.4,
      ttfb: 120
    },
    userExperience: {
      bounceRate: 32.5,
      sessionDuration: 4.2,
      pageViews: 3.8,
      conversionRate: 8.4
    },
    technical: {
      bundleSize: 245,
      loadTime: 1.8,
      renderTime: 16,
      apiLatency: 110
    }
  });

  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);

  // Monitor Core Web Vitals
  useEffect(() => {
    const measurePerformance = () => {
      // Measure actual performance metrics
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const ttfb = navigation.responseStart - navigation.fetchStart;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;

        // Update metrics with real data
        setMetrics(current => ({
          ...current,
          coreWebVitals: {
            ...current.coreWebVitals,
            fcp: fcp / 1000,
            ttfb: ttfb
          },
          technical: {
            ...current.technical,
            loadTime: loadTime / 1000
          }
        }));

        // Calculate performance score
        const score = calculatePerformanceScore(metrics);
        setPerformanceScore(score);
      }

      // Detect performance issues
      detectPerformanceIssues();
    };

    // Measure on load and periodically
    measurePerformance();
    const interval = setInterval(measurePerformance, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate overall performance score
  const calculatePerformanceScore = (data: PerformanceMetrics): number => {
    let score = 100;

    // Core Web Vitals scoring (Google's thresholds)
    if (data.coreWebVitals.lcp > 2.5) score -= 15;
    else if (data.coreWebVitals.lcp > 2.0) score -= 5;

    if (data.coreWebVitals.fid > 100) score -= 15;
    else if (data.coreWebVitals.fid > 75) score -= 5;

    if (data.coreWebVitals.cls > 0.1) score -= 15;
    else if (data.coreWebVitals.cls > 0.05) score -= 5;

    if (data.technical.loadTime > 3) score -= 10;
    else if (data.technical.loadTime > 2) score -= 5;

    if (data.technical.bundleSize > 300) score -= 10;
    else if (data.technical.bundleSize > 250) score -= 5;

    return Math.max(0, score);
  };

  // Detect performance issues and generate recommendations
  const detectPerformanceIssues = () => {
    const detectedIssues: PerformanceIssue[] = [];

    // Check Core Web Vitals
    if (metrics.coreWebVitals.lcp > 2.5) {
      detectedIssues.push({
        id: 'lcp-slow',
        type: 'critical',
        metric: 'Largest Contentful Paint',
        value: metrics.coreWebVitals.lcp,
        threshold: 2.5,
        impact: 'Poor user experience and SEO ranking',
        suggestion: 'Optimize images, reduce server response times, and implement lazy loading'
      });
    }

    if (metrics.coreWebVitals.fid > 100) {
      detectedIssues.push({
        id: 'fid-slow',
        type: 'warning',
        metric: 'First Input Delay',
        value: metrics.coreWebVitals.fid,
        threshold: 100,
        impact: 'Users experience delayed interactions',
        suggestion: 'Reduce JavaScript execution time and break up long tasks'
      });
    }

    if (metrics.technical.bundleSize > 300) {
      detectedIssues.push({
        id: 'bundle-large',
        type: 'warning',
        metric: 'Bundle Size',
        value: metrics.technical.bundleSize,
        threshold: 250,
        impact: 'Slower initial page loads',
        suggestion: 'Implement code splitting and tree shaking'
      });
    }

    setIssues(detectedIssues);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricStatus = (value: number, good: number, needs_improvement: number) => {
    if (value <= good) return { color: 'text-green-600', status: 'Good' };
    if (value <= needs_improvement) return { color: 'text-yellow-600', status: 'Needs Improvement' };
    return { color: 'text-red-600', status: 'Poor' };
  };

  // Log performance data to analytics
  const logPerformanceData = async () => {
    try {
      await supabase.functions.invoke('performance-analytics', {
        body: {
          metrics,
          score: performanceScore,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      });
    } catch (error) {
      console.error('Failed to log performance data:', error);
    }
  };

  useEffect(() => {
    logPerformanceData();
  }, [metrics, performanceScore]);

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
              {Math.round(performanceScore)}
            </div>
            <div className="flex-1">
              <Progress value={performanceScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {performanceScore >= 90 ? 'Excellent' : 
                 performanceScore >= 70 ? 'Good' : 
                 performanceScore >= 50 ? 'Needs Work' : 'Poor'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">LCP (Largest Contentful Paint)</span>
                <Badge variant={getMetricStatus(metrics.coreWebVitals.lcp, 2.5, 4.0).status === 'Good' ? 'default' : 'destructive'}>
                  {getMetricStatus(metrics.coreWebVitals.lcp, 2.5, 4.0).status}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${getMetricStatus(metrics.coreWebVitals.lcp, 2.5, 4.0).color}`}>
                {metrics.coreWebVitals.lcp.toFixed(1)}s
              </div>
              <p className="text-xs text-muted-foreground">Time to render main content</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">FID (First Input Delay)</span>
                <Badge variant={getMetricStatus(metrics.coreWebVitals.fid, 100, 300).status === 'Good' ? 'default' : 'destructive'}>
                  {getMetricStatus(metrics.coreWebVitals.fid, 100, 300).status}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${getMetricStatus(metrics.coreWebVitals.fid, 100, 300).color}`}>
                {Math.round(metrics.coreWebVitals.fid)}ms
              </div>
              <p className="text-xs text-muted-foreground">Time to first interaction</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">CLS (Cumulative Layout Shift)</span>
                <Badge variant={getMetricStatus(metrics.coreWebVitals.cls, 0.1, 0.25).status === 'Good' ? 'default' : 'destructive'}>
                  {getMetricStatus(metrics.coreWebVitals.cls, 0.1, 0.25).status}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${getMetricStatus(metrics.coreWebVitals.cls, 0.1, 0.25).color}`}>
                {metrics.coreWebVitals.cls.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Visual stability score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Issues */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Performance Issues ({issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.map((issue) => (
                <Alert key={issue.id} className={`border-l-4 ${
                  issue.type === 'critical' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <div className="flex items-start gap-3">
                    {issue.type === 'critical' ? 
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1" /> :
                      <Clock className="h-4 w-4 text-yellow-500 mt-1" />
                    }
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium">{issue.metric}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Current: {issue.value.toFixed(2)} | Threshold: {issue.threshold}
                        </div>
                        <div className="text-sm mt-2">
                          <strong>Impact:</strong> {issue.impact}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Suggestion:</strong> {issue.suggestion}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Load Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Page Load Time</span>
              <Badge variant="outline">{metrics.technical.loadTime.toFixed(1)}s</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Time to First Byte</span>
              <Badge variant="outline">{metrics.coreWebVitals.ttfb.toFixed(0)}ms</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Bundle Size</span>
              <Badge variant="outline">{metrics.technical.bundleSize}KB</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              User Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Bounce Rate</span>
              <Badge variant="outline">{metrics.userExperience.bounceRate}%</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Avg Session Duration</span>
              <Badge variant="outline">{metrics.userExperience.sessionDuration}min</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <Badge variant="secondary">{metrics.userExperience.conversionRate}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}