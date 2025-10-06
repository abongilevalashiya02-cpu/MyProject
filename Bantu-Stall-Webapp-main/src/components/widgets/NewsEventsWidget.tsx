import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Calendar, MapPin, Clock, ExternalLink, 
  RefreshCw, TrendingUp, Globe, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { realTimeDataService, NewsItem } from '@/services/realTimeDataService';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

interface EventItem {
  id: string;
  name: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  category: string;
  description: string;
  imageUrl?: string;
}

interface NewsEventsWidgetProps {
  className?: string;
  showControls?: boolean;
  maxItems?: number;
}

export const NewsEventsWidget: React.FC<NewsEventsWidgetProps> = ({
  className,
  showControls = true,
  maxItems = 5
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('news');

  const fetchNewsAndEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [newsData, eventsData] = await Promise.all([
        realTimeDataService.getAfricanTourismNews(maxItems),
        realTimeDataService.getUpcomingEvents(undefined, maxItems)
      ]);
      
      setNews(newsData);
      setEvents(eventsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch news and events:', error);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchNewsAndEvents();
  }, [fetchNewsAndEvents]);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = events.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'sustainability', 'wildlife', 'aviation', 'awards', 'nature', 'music', 'arts & culture', 'conservation'];

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    return `Updated ${formatDistanceToNow(lastUpdate)} ago`;
  };

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {item.imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-bantu-orange transition-colors">
              {item.title}
            </h4>
            <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.source}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.publishedAt))} ago
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const EventCard = ({ item }: { item: EventItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {item.imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-bantu-orange transition-colors">
              {item.name}
            </h4>
            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {item.city}, {item.country}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(item.startDate), 'MMM dd')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-bantu-orange" />
            African Tourism Updates
          </CardTitle>
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNewsAndEvents}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          )}
        </div>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground">{formatLastUpdate()}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        {showControls && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news and events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News ({filteredNews.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events ({filteredEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 animate-pulse text-bantu-orange mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading latest news...</p>
                  </div>
                </motion.div>
              ) : filteredNews.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {filteredNews.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Newspaper className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No news found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="text-center">
                    <Calendar className="h-8 w-8 animate-pulse text-bantu-orange mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading upcoming events...</p>
                  </div>
                </motion.div>
              ) : filteredEvents.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {filteredEvents.map((item) => (
                    <EventCard key={item.id} item={item} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No events found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
