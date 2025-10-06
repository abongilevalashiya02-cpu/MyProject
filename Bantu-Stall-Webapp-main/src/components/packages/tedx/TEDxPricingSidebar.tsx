
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import BookingCard from '@/components/packages/BookingCard';
import { toast } from 'sonner';

interface TEDxPricingSidebarProps {
  price: number;
}

const TEDxPricingSidebar: React.FC<TEDxPricingSidebarProps> = ({ price }) => {
  const handleDownloadItinerary = () => {
    toast("Itinerary download started. Check your downloads folder.");
  };

  return (
    <div>
      <BookingCard 
        price={price} 
        startDate="June 3, 2025" 
      />
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={handleDownloadItinerary}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Download Full Itinerary
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center mb-2">
          <Users className="h-5 w-5 text-amber-800 mr-2" />
          <h4 className="font-bold text-amber-800">Limited Availability</h4>
        </div>
        <p className="text-amber-700 text-sm">Only 12 speaker spots available. Secure yours before they're gone!</p>
      </div>
    </div>
  );
};

export default TEDxPricingSidebar;
