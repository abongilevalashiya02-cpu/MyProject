
import React, { useState } from 'react';
import { EventType } from '@/types/marketplace';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import CalendarView from './CalendarView';
import { Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UpcomingEventsTabProps {
  upcomingEvents: EventType[];
}

const UpcomingEventsTab: React.FC<UpcomingEventsTabProps> = ({ upcomingEvents }) => {
  const [viewType, setViewType] = useState<"list" | "calendar">("list");
  const [eventType, setEventType] = useState<"all" | "virtual" | "in-person">("all");
  
  // Filter events based on type (virtual or in-person)
  const filteredEvents = eventType === "all" 
    ? upcomingEvents 
    : upcomingEvents.filter(event => {
        const isVirtual = event.location.toLowerCase().includes('virtual') || 
                        event.location.toLowerCase().includes('zoom') || 
                        event.location.toLowerCase().includes('teams') ||
                        event.location.toLowerCase().includes('online');
        return eventType === "virtual" ? isVirtual : !isVirtual;
      });

  return (
    <div className="mb-6">
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setViewType(viewType === "list" ? "calendar" : "list")}
        >
          <Calendar className="h-4 w-4" />
          {viewType === "list" ? "Calendar View" : "List View"}
        </Button>
      </div>

      <EventFilters eventType={eventType} setEventType={setEventType} />
      
      {viewType === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <CalendarView events={upcomingEvents} />
      )}
    </div>
  );
};

export default UpcomingEventsTab;
