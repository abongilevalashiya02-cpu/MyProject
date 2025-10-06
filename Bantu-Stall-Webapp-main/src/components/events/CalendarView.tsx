
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventType } from '@/types/marketplace';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface CalendarViewProps {
  events: EventType[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Function to check if a date has events
  const hasEvents = (date: Date): boolean => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get events for the selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  const handleRSVP = (eventTitle: string) => {
    toast.success(`RSVP confirmed for ${eventTitle}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-3 pointer-events-auto"
            modifiers={{
              hasEvent: (date) => hasEvents(date),
            }}
            modifiersStyles={{
              hasEvent: { 
                fontWeight: 'bold',
                backgroundColor: 'rgba(234, 88, 12, 0.1)',
                color: '#ea580c'
              }
            }}
          />
          <div className="mt-4 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
              Dates with events are highlighted
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold mb-4">
          {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Select a date'}
        </h3>
        
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="h-32 w-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4 md:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-gray-400" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="ml-4"
                        onClick={() => handleRSVP(event.title)}
                      >
                        RSVP
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <Badge className={`${event.location.toLowerCase().includes('virtual') ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {event.location.toLowerCase().includes('virtual') ? 'Virtual' : 'In-Person'}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {event.attendees} attending
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500">
            <p className="mb-2">No events scheduled for this date.</p>
            <p>Select a different date or check back later for updates.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
