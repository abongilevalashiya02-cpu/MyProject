
import React from 'react';
import { MapPin, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, addDays } from 'date-fns';

const upcomingEvents = [
  {
    id: '1',
    title: 'Safari Adventure',
    location: 'Nairobi National Park, Kenya',
    date: addDays(new Date(), 5),
    duration: '6 hours',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Cooking Class with Chef Amine',
    location: 'Marrakech Medina, Morocco',
    date: addDays(new Date(), 12),
    duration: '3 hours',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Wine Tasting Tour',
    location: 'Stellenbosch, South Africa',
    date: addDays(new Date(), 20),
    duration: '4 hours',
    status: 'confirmed'
  }
];

const UpcomingBookings = () => {
  return (
    <div className="space-y-3">
      {upcomingEvents.map((event, index) => (
        <React.Fragment key={event.id}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(event.date, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{event.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Badge className={
                event.status === 'confirmed' 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }>
                {event.status}
              </Badge>
              <Button variant="ghost" size="sm" className="mt-2">
                <span className="text-xs">Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          {index < upcomingEvents.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default UpcomingBookings;
