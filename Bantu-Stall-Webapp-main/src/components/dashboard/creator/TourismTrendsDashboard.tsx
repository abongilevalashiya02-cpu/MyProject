import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChartBar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tourismTrends } from '@/data/tourismTrends';

const TourismTrendsDashboard = () => {
  const [currentTrends, setCurrentTrends] = useState<number[]>([0, 1, 2]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrends(prev => {
        const next = prev.map(i => (i + 3) % tourismTrends.length);
        return next[0] === prev[0] ? [0, 1, 2] : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tourism Trends Dashboard</h3>
        <ChartBar className="h-5 w-5 text-bantu-orange" />
      </div>
      
      <div className="space-y-4">
        {currentTrends.map((index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{tourismTrends[index].title}</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">{tourismTrends[index].stats}</span>
              <span className="text-xs text-green-600">{tourismTrends[index].change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/tourism-trends')}
      >
        View Detailed Reports
      </Button>
    </div>
  );
};

export default TourismTrendsDashboard;
