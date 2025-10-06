
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarPlus, MapPin, Users, ExternalLink } from 'lucide-react';
import { EventType } from '@/types/marketplace';

// Sample data for demonstration
const events: EventType[] = [
  {
    id: 1,
    title: 'Pan-African Business Summit',
    date: '2023-09-12',
    time: '09:00 - 17:00',
    location: 'Kigali Convention Center, Rwanda',
    organizer: 'African Business Council',
    attendees: 340,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    title: 'Tech Entrepreneurship Masterclass',
    date: '2023-09-18',
    time: '14:00 - 16:30',
    location: 'Virtual (Zoom)',
    organizer: 'AfriTech Hub',
    attendees: 120,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 3,
    title: 'Cross-Border Trade Workshop',
    date: '2023-09-25',
    time: '10:00 - 13:00',
    location: 'Lagos Business School, Nigeria',
    organizer: 'West African Trade Association',
    attendees: 85,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 4,
    title: 'Cultural Tourism Networking Mixer',
    date: '2023-10-05',
    time: '18:00 - 21:00',
    location: 'Mombasa Beach Hotel, Kenya',
    organizer: 'East African Tourism Board',
    attendees: 65,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  }
];

const EventsCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState('all');
  
  // Filter events based on selected date and filter
  const filteredEvents = events.filter(event => {
    if (filter === 'virtual') {
      return event.location.toLowerCase().includes('virtual');
    } else if (filter === 'in-person') {
      return !event.location.toLowerCase().includes('virtual');
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events Calendar</h2>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
          <CardFooter>
            <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="virtual">Virtual</TabsTrigger>
                <TabsTrigger value="in-person">In Person</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardFooter>
        </Card>
        
        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
          
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
                <div className="flex flex-col md:flex-row">
                  {event.image && (
                    <div className="md:w-1/3">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="h-full w-full object-cover"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                  
                  <div className={`flex-1 ${event.image ? 'md:w-2/3' : 'w-full'}`}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{event.title}</CardTitle>
                        <Badge>{new Date(event.date).toLocaleDateString()}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{event.attendees} attendees</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Organized by {event.organizer}
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <span className="text-sm font-medium">{event.time}</span>
                      <Button size="sm">
                        Register
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No events found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
