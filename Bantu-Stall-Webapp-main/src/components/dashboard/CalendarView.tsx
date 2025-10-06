import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: 'excursion' | 'external' | 'personal';
    location?: string;
    price?: string;
    category?: string;
  };
}

interface EnhancedCalendarViewProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

const EnhancedCalendarView: React.FC<EnhancedCalendarViewProps> = ({
  currentDate,
  view,
  onViewChange
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Safari Adventure',
      start: '2024-01-15T09:00:00',
      end: '2024-01-15T17:00:00',
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      extendedProps: {
        type: 'excursion',
        location: 'Nairobi, Kenya',
        price: 'R1,200',
        category: 'Adventure'
      }
    },
    {
      id: '2',
      title: 'Team Meeting',
      start: '2024-01-16T10:00:00',
      end: '2024-01-16T11:00:00',
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      extendedProps: {
        type: 'external'
      }
    }
  ]);

  const getFullCalendarView = () => {
    switch (view) {
      case 'month':
        return 'dayGridMonth';
      case 'week':
        return 'timeGridWeek';
      case 'day':
        return 'timeGridDay';
      default:
        return 'dayGridMonth';
    }
  };

  const handleEventReceive = (info: any) => {
    // Handle event received from external source
    
    // Extract data from the dragged element
    const draggedData = info.draggedEl.dataset;
    const excursionData = JSON.parse(draggedData.event || '{}');
    
    const newEvent: CalendarEvent = {
      id: `excursion-${Date.now()}`,
      title: excursionData.title || 'New Excursion',
      start: info.dateStr || info.date.toISOString(),
      end: info.dateStr ? 
        new Date(new Date(info.dateStr).getTime() + 4 * 60 * 60 * 1000).toISOString() :
        new Date(info.date.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      extendedProps: {
        type: 'excursion',
        location: excursionData.location,
        price: excursionData.price,
        category: excursionData.category
      }
    };

    setEvents(prev => [...prev, newEvent]);
    toast.success(`${newEvent.title} added to ${format(new Date(newEvent.start), 'PPP')}`);
  };

  const handleEventDrop = (info: any) => {
    // Handle event drop to update timing
    
    setEvents(prev => prev.map(event =>
      event.id === info.event.id 
        ? { ...event, start: info.event.startStr, end: info.event.endStr }
        : event
    ));
    
    toast.success(`${info.event.title} moved to ${format(new Date(info.event.start), 'PPP')}`);
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    const props = event.extendedProps;
    
    if (props.type === 'excursion') {
      toast(`${event.title} - ${props.location} (${props.price})`);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Your Travel Calendar</h2>
        <div className="flex gap-2">
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewChange('month')}
          >
            Month
          </Button>
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewChange('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewChange('day')}
          >
            Day
          </Button>
        </div>
      </div>
      
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={getFullCalendarView()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          events={events}
          editable={true}
          droppable={true}
          eventReceive={handleEventReceive}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height="auto"
          dayMaxEvents={3}
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          selectMirror={true}
          dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
          eventClassNames={(arg) => {
            const type = arg.event.extendedProps.type;
            return [`fc-event-${type}`];
          }}
        />
      </div>
      
      <style>{`
        .calendar-container .fc-event-excursion {
          background-color: #f97316;
          border-color: #ea580c;
        }
        .calendar-container .fc-event-external {
          background-color: #3b82f6;
          border-color: #2563eb;
        }
        .calendar-container .fc {
          font-family: inherit;
        }
        .calendar-container .fc-button {
          background: #f97316;
          border-color: #ea580c;
        }
        .calendar-container .fc-button:hover {
          background: #ea580c;
          border-color: #c2410c;
        }
        .calendar-container .fc-button:disabled {
          opacity: 0.65;
        }
      `}</style>
    </Card>
  );
};

export default EnhancedCalendarView;
