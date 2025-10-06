
import React from 'react';
import { EventType } from '@/types/marketplace';
import PastEventCard from './PastEventCard';

interface PastEventsTabProps {
  pastEvents: Array<EventType & { replayUrl?: string; summary?: string }>;
}

const PastEventsTab: React.FC<PastEventsTabProps> = ({ pastEvents }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Past Events Archive</h2>
      <p className="text-gray-600 mb-8">
        Access recordings and summary notes from our previous events to catch up on what you missed.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pastEvents.map(event => (
          <PastEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default PastEventsTab;
