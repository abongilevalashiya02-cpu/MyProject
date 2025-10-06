
import React from 'react';
import { Button } from "@/components/ui/button";

interface EventFiltersProps {
  eventType: "all" | "virtual" | "in-person";
  setEventType: (type: "all" | "virtual" | "in-person") => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ eventType, setEventType }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Button 
        variant={eventType === "all" ? "default" : "outline"} 
        onClick={() => setEventType("all")}
        className="rounded-full"
      >
        All Events
      </Button>
      <Button 
        variant={eventType === "virtual" ? "default" : "outline"} 
        onClick={() => setEventType("virtual")}
        className="rounded-full"
      >
        Virtual
      </Button>
      <Button 
        variant={eventType === "in-person" ? "default" : "outline"} 
        onClick={() => setEventType("in-person")}
        className="rounded-full"
      >
        In-Person
      </Button>
    </div>
  );
};

export default EventFilters;
