
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VenueCard from './VenueCard';
import { VenueType } from '@/types/venues';
import { activityCategories } from '@/data/activityCategories';

interface VenueListProps {
  venues: VenueType[];
  selectedActivityCategories: string[];
  onGetQuotation: (venue: VenueType) => void;
  onClearActivities: () => void;
}

const CARDS_PER_PAGE = 6;

const VenueList: React.FC<VenueListProps> = ({
  venues,
  selectedActivityCategories,
  onGetQuotation,
  onClearActivities
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(venues.length / CARDS_PER_PAGE);
  const paginatedVenues: (VenueType & { quotationRequests?: number })[] = venues.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
  const getPopularityBadge = (venue: VenueType & { quotationRequests?: number }) => {
    if (!venue.quotationRequests || venue.quotationRequests === 0) return null;
    
    if (venue.quotationRequests >= 10) {
      return <Badge className="bg-red-500 text-white">🔥 Most Popular</Badge>;
    } else if (venue.quotationRequests >= 5) {
      return <Badge className="bg-orange-500 text-white">⭐ Trending</Badge>;
    } else if (venue.quotationRequests >= 1) {
      return <Badge className="bg-blue-500 text-white">📈 Popular</Badge>;
    }
    return null;
  };

  return (
    <>
      {selectedActivityCategories.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">
            Showing venues that specialize in: {' '}
            <span className="font-medium">
              {selectedActivityCategories.map(id => {
                const category = activityCategories.find(cat => cat.id === id);
                return category?.name;
              }).join(', ')}
            </span>
          </p>
        </div>
      )}
      
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl w-full">
          {paginatedVenues.map((venue, index) => (
            <div key={`${venue.id}-${index}`} className="relative">
              {getPopularityBadge(venue as VenueType & { quotationRequests?: number }) && (
                <div className="absolute top-2 left-2 z-10">
                  {getPopularityBadge(venue as VenueType & { quotationRequests?: number })}
                </div>
              )}
              <VenueCard 
                venue={venue} 
                onGetQuotation={onGetQuotation}
              />
              {typeof venue.quotationRequests === 'number' && venue.quotationRequests > 0 && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">
                    {venue.quotationRequests} recent quotation request{venue.quotationRequests !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {venues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No venues match your current filters. Try adjusting your search criteria.</p>
          {selectedActivityCategories.length > 0 && (
            <Button 
              onClick={onClearActivities}
              variant="outline" 
              className="mt-4"
            >
              Clear Activity Filters
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default VenueList;
