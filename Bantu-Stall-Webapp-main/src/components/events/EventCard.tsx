
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Clock, MapPin, Users } from 'lucide-react';
import { EventType } from '@/types/marketplace';
import { toast } from 'sonner';

interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isVirtual = event.location.toLowerCase().includes('virtual') || 
                   event.location.toLowerCase().includes('zoom') || 
                   event.location.toLowerCase().includes('teams') ||
                   event.location.toLowerCase().includes('online');

  const handleRSVP = () => {
    toast.success(`RSVP confirmed for ${event.title}`);
  };

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`${event.title} added to your calendar`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="h-full w-full object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${isVirtual ? 'bg-blue-500' : 'bg-orange-500'}`}>
          {isVirtual ? 'Virtual' : 'In-Person'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <div className="text-sm font-medium text-gray-500">
          {formatDate(event.date)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-2">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          {event.time}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          {event.location}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="mr-2 h-4 w-4 text-gray-400" />
          {event.attendees} attending
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full"
          onClick={handleAddToCalendar}
        >
          <CalendarPlus className="mr-1 h-4 w-4" />
          Add to Calendar
        </Button>
        
        <Button 
          onClick={handleRSVP}
          className="rounded-full"
        >
          RSVP
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
