import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Store, Calendar, Library } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const clusters = [{
  id: 'learning',
  title: 'Learning',
  phrase: 'Begin your safari ya maarifa (journey of knowledge).',
  description: 'Discover African experiences through curated courses and cultural immersion.',
  icon: BookOpen,
  path: '/dashboard?section=courses',
  color: 'text-accent-earthy'
}, {
  id: 'networking',
  title: 'Networking',
  phrase: 'Kujenga Mtandao—building connections across our continent.',
  description: 'Connect with fellow travelers, business leaders, and cultural enthusiasts.',
  icon: Users,
  path: '/abantu',
  color: 'text-accent-earthy'
}, {
  id: 'trade',
  title: 'Trade',
  phrase: 'Trading beyond borders—soko la Africa in action.',
  description: 'Explore marketplace opportunities and business experiences.',
  icon: Store,
  path: '/musika',
  color: 'text-accent-earthy'
}, {
  id: 'events',
  title: 'Events',
  phrase: 'Join the pulse of community—matukio ya pamoja.',
  description: 'Participate in gatherings that celebrate African excellence.',
  icon: Calendar,
  path: '/events',
  color: 'text-accent-earthy'
}, {
  id: 'resources',
  title: 'Resources',
  phrase: 'Our heritage hub—stories that teach, connect, transform.',
  description: 'Access knowledge hub of African travel and business insights.',
  icon: Library,
  path: '/indaba',
  color: 'text-accent-earthy'
}];
const CulturalClusters = () => {
  const navigate = useNavigate();
  const [visibleClusters, setVisibleClusters] = useState<string[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleClusters(prev => [...prev, entry.target.id]);
        }
      });
    }, {
      threshold: 0.3
    });
    clusters.forEach((_, index) => {
      const element = document.getElementById(`cluster-${index}`);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return;
};
export default CulturalClusters;