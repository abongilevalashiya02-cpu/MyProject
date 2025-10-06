import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock, 
  Users, 
  Globe,
  Search,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface SEOMetrics {
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  clickThroughRate: number;
  organicTraffic: number;
  keywordRankings: Array<{
    keyword: string;
    position: number;
    change: number;
    searchVolume: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    ctr: number;
  }>;
  geoData: Array<{
    country: string;
    visits: number;
    percentage: number;
  }>;
}

interface SEOAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export const SEOAnalytics: React.FC<SEOAnalyticsProps> = ({ timeRange = '30d' }) => {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data generation
  useEffect(() => {
    const generateMockData = (): SEOMetrics => {
      const multiplier = timeRange === '7d' ? 0.25 : timeRange === '30d' ? 1 : timeRange === '90d' ? 3 : 12;
      
      return {
        pageViews: Math.floor(15000 * multiplier),
        uniqueVisitors: Math.floor(8500 * multiplier),
        avgTimeOnPage: 145 + Math.random() * 60,
        bounceRate: 35 + Math.random() * 20,
        clickThroughRate: 2.5 + Math.random() * 2,
        organicTraffic: Math.floor(6500 * multiplier),
        keywordRankings: [
          { keyword: 'African business marketplace', position: 12, change: -2, searchVolume: 2400 },
          { keyword: 'Pan-African experiences', position: 8, change: 3, searchVolume: 1800 },
          { keyword: 'African cultural learning', position: 15, change: 1, searchVolume: 1200 },
          { keyword: 'trade platform Africa', position: 22, change: -1, searchVolume: 980 },
          { keyword: 'African heritage resources', position: 6, change: 4, searchVolume: 1500 },
        ],
        topPages: [
          { page: '/', views: 5200, ctr: 3.2 },
          { page: '/experiences', views: 3800, ctr: 2.8 },
          { page: '/about', views: 2400, ctr: 2.1 },
          { page: '/venues', views: 2100, ctr: 2.9 },
          { page: '/contact', views: 1800, ctr: 1.9 },
        ],
        geoData: [
          { country: 'Nigeria', visits: 3200, percentage: 38 },
          { country: 'Ghana', visits: 1800, percentage: 22 },
          { country: 'Kenya', visits: 1400, percentage: 17 },
          { country: 'South Africa', visits: 1200, percentage: 14 },
          { country: 'Morocco', visits: 750, percentage: 9 },
        ]
      };
    };

    setTimeout(() => {
      setMetrics(generateMockData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const performanceData = [
    { name: 'Jan', organicTraffic: 4000, totalTraffic: 6000 },
    { name: 'Feb', organicTraffic: 4500, totalTraffic: 6800 },
    { name: 'Mar', organicTraffic: 5200, totalTraffic: 7500 },
    { name: 'Apr', organicTraffic: 5800, totalTraffic: 8200 },
    { name: 'May', organicTraffic: 6500, totalTraffic: 9000 },
    { name: 'Jun', organicTraffic: 7200, totalTraffic: 9800 },
  ];

  const geoColors = ['#d97706', '#ea580c', '#dc2626', '#b45309', '#92400e'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{metrics.pageViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Organic Traffic</p>
                <p className="text-2xl font-bold">{metrics.organicTraffic.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              +8.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Avg. Time on Page</p>
                <p className="text-2xl font-bold">{Math.round(metrics.avgTimeOnPage)}s</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              +15.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Click-through Rate</p>
                <p className="text-2xl font-bold">{metrics.clickThroughRate.toFixed(1)}%</p>
              </div>
              <MousePointer className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm text-red-600">
              <ArrowDown className="h-4 w-4 mr-1" />
              -2.1% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Trends
              </CardTitle>
              <CardDescription>
                Organic vs Total traffic over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="organicTraffic" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Organic Traffic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalTraffic" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Total Traffic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Keyword Rankings
              </CardTitle>
              <CardDescription>
                Current positions and changes for target keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.keywordRankings.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-muted-foreground">
                        Search Volume: {keyword.searchVolume.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={keyword.position <= 10 ? 'default' : 'secondary'}>
                        Position {keyword.position}
                      </Badge>
                      <div className={`flex items-center ${keyword.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {keyword.change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {Math.abs(keyword.change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Pages with highest traffic and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.topPages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Page Views" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={metrics.geoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, percentage }) => `${country} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visits"
                    >
                      {metrics.geoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={geoColors[index % geoColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.geoData.map((country, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{country.country}</span>
                        <span>{country.visits.toLocaleString()} visits</span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};