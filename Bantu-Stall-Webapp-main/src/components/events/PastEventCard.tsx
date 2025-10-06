
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Clock, Download, ExternalLink, MapPin } from 'lucide-react';
import { EventType } from '@/types/marketplace';
import { toast } from 'sonner';

interface PastEventCardProps {
  event: EventType & { replayUrl?: string; summary?: string };
}

const PastEventCard: React.FC<PastEventCardProps> = ({ event }) => {
  const handleDownloadSummary = () => {
    toast.success(`Downloading summary for ${event.title}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <img 
          src={event.image} 
          alt={event.title} 
          className="h-48 md:h-full w-full object-cover"
        />
      </div>
      
      <div className="flex flex-col p-6 md:w-2/3">
        <div className="mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Archive className="h-4 w-4" />
            <span>Past Event</span>
          </div>
          <h3 className="text-xl font-bold">{event.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-gray-400" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4 text-gray-400" />
              {event.location.includes('Virtual') ? 'Virtual' : 'In-Person'}
            </div>
          </div>
        </div>
        
        {event.summary && (
          <div className="my-3">
            <p className="text-sm text-gray-600 line-clamp-2">{event.summary}</p>
          </div>
        )}
        
        <div className="mt-auto flex flex-wrap gap-3">
          {event.replayUrl && (
            <Button variant="outline" className="text-sm" asChild>
              <a href={event.replayUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                Watch Replay
              </a>
            </Button>
          )}
          
          <Button variant="outline" className="text-sm" onClick={handleDownloadSummary}>
            <Download className="mr-1 h-4 w-4" />
            Download Summary
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PastEventCard;
