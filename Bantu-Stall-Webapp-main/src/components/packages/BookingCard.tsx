
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface BookingCardProps {
  price: number;
  startDate: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ price, startDate }) => {
  const handleBookNow = () => {
    toast.success("Thank you for your interest! A confirmation email has been sent.");
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-3xl font-bold text-bantu-orange">${price}</p>
          <p className="text-gray-600">All-Inclusive, Excluding International Flights</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b pb-2">
            <span>Theme</span>
            <span className="font-medium">"The Smoke That Thunders"</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Duration</span>
            <span className="font-medium">6 Days</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Group Size</span>
            <span className="font-medium">Limited to 30 Speakers</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Starting Date</span>
            <span className="font-medium">{startDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Language</span>
            <span className="font-medium">English</span>
          </div>
        </div>
        
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
          <p className="text-amber-800 font-medium">Early Registration Deadline: April 15, 2025</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
            onClick={handleBookNow}
          >
            Secure Your Spot - $2000 Deposit
          </Button>
          <Button variant="outline" className="w-full">
            Download Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
