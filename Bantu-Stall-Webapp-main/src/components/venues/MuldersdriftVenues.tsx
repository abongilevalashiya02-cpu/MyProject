
import React, { useState, useCallback } from 'react';
import { VenueType, VenueFilters, SortOption } from '@/types/venues';
import VenueHeader from './VenueHeader';
import VenuePopularityManager from './VenuePopularityManager';
import VenueList from './VenueList';
import VenueFiltersDialog from './VenueFiltersDialog';
import VenueFiltersComponent from './VenueFilters';
import PropertyListingModal from './PropertyListingModal';
import QuotationForm from './QuotationForm';
import VenueSEO from './VenueSEO';
import { activityCategories } from '@/data/activityCategories';

// Simple filter interface for this component
interface SimpleFilters {
  area?: string;
  capacity?: number;
  luxury?: boolean;
  ecoFriendly?: boolean;
  priceRange?: string;
  activities?: string[];
}

const MuldersdriftVenues = () => {
  const [filteredVenues, setFilteredVenues] = useState<VenueType[]>([]);
  const [sortedVenues, setSortedVenues] = useState<VenueType[]>([]);
  const [isPropertyListingOpen, setIsPropertyListingOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueType | null>(null);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [selectedActivityCategories, setSelectedActivityCategories] = useState<string[]>([]);
  const [isActivityFilterOpen, setIsActivityFilterOpen] = useState(false);
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);
  
  // Add proper state for VenueFilters
  const [venueFilters, setVenueFilters] = useState<VenueFilters>({
    budgetRange: [200, 5000],
    groupSize: 'any',
    focus: 'any',
    ecoFriendly: false
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // New comprehensive filter function that handles VenueFilters interface
  const applyFiltersToVenues = useCallback((
    venues: VenueType[], 
    filters: VenueFilters, 
    selectedActivityIds: string[]
  ) => {
    setIsFiltersLoading(true);
    
    let filtered = [...venues];
    
    // Budget range filter
    if (filters.budgetRange[0] > 200 || filters.budgetRange[1] < 5000) {
      filtered = filtered.filter(venue => {
        const priceText = venue.pricingSnapshot.toLowerCase();
        const priceMatch = priceText.match(/\$(\d+)-/);
        if (priceMatch) {
          const basePrice = parseInt(priceMatch[1]);
          return basePrice >= filters.budgetRange[0] && basePrice <= filters.budgetRange[1];
        }
        return true;
      });
    }
    
    // Group size filter
    if (filters.groupSize !== 'any') {
      filtered = filtered.filter(venue => {
        switch (filters.groupSize) {
          case 'small':
            return venue.capacity.max <= 30;
          case 'medium':
            return venue.capacity.min <= 100 && venue.capacity.max > 30;
          case 'large':
            return venue.capacity.max > 100;
          default:
            return true;
        }
      });
    }
    
    // Focus filter
    if (filters.focus !== 'any') {
      filtered = filtered.filter(venue => {
        switch (filters.focus) {
          case 'indoor':
            return venue.features.indoorFocus;
          case 'outdoor':
            return venue.features.outdoorFocus;
          case 'mixed':
            return venue.features.indoorFocus && venue.features.outdoorFocus;
          default:
            return true;
        }
      });
    }
    
    // Eco-friendly filter
    if (filters.ecoFriendly) {
      filtered = filtered.filter(venue => venue.features.ecoFriendly);
    }

    // Activity categories filter
    if (selectedActivityIds.length > 0) {
      filtered = filtered.filter(venue => {
        return selectedActivityIds.some(categoryId => {
          const category = activityCategories.find(cat => cat.id === categoryId);
          if (!category) return false;
          
          return venue.activities.some(activity => 
            category.examples.some(example => 
              activity.toLowerCase().includes(example.toLowerCase()) ||
              example.toLowerCase().includes(activity.toLowerCase())
            )
          );
        });
      });
    }
    
    setFilteredVenues(filtered);
    setTimeout(() => setIsFiltersLoading(false), 300); // Small delay for UX
  }, []);

  const handleVenuesUpdate = useCallback((venues: VenueType[]) => {
    setSortedVenues(venues);
    // Apply filters immediately when venues are updated
    applyFiltersToVenues(venues, venueFilters, selectedActivityCategories);
  }, [venueFilters, selectedActivityCategories, applyFiltersToVenues]);

  // Legacy filter function for compatibility
  const handleFilter = useCallback((filters: SimpleFilters) => {
    let filtered = [...sortedVenues];
    
    if (filters.area && filters.area !== 'All') {
      filtered = filtered.filter(venue => venue.location.area === filters.area);
    }
    
    if (filters.capacity) {
      filtered = filtered.filter(venue => 
        venue.capacity.max >= filters.capacity! && venue.capacity.min <= filters.capacity!
      );
    }
    
    if (filters.luxury !== undefined) {
      filtered = filtered.filter(venue => venue.features.luxury === filters.luxury);
    }
    
    if (filters.ecoFriendly !== undefined) {
      filtered = filtered.filter(venue => venue.features.ecoFriendly === filters.ecoFriendly);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(venue => {
        const priceText = venue.pricingSnapshot.toLowerCase();
        if (filters.priceRange === 'budget') {
          return priceText.includes('$50-') || priceText.includes('$60-') || priceText.includes('$70-') || priceText.includes('$80-');
        } else if (filters.priceRange === 'mid') {
          return priceText.includes('$90-') || priceText.includes('$100-') || priceText.includes('$110-') || priceText.includes('$120-') || priceText.includes('$130-') || priceText.includes('$140-');
        } else if (filters.priceRange === 'luxury') {
          return priceText.includes('$150-') || priceText.includes('$160-') || priceText.includes('$170-') || priceText.includes('$180-') || priceText.includes('$190-') || priceText.includes('$200-');
        }
        return true;
      });
    }

    if (selectedActivityCategories.length > 0) {
      filtered = filtered.filter(venue => {
        return selectedActivityCategories.some(categoryId => {
          const category = activityCategories.find(cat => cat.id === categoryId);
          if (!category) return false;
          
          return venue.activities.some(activity => 
            category.examples.some(example => 
              activity.toLowerCase().includes(example.toLowerCase()) ||
              example.toLowerCase().includes(activity.toLowerCase())
            )
          );
        });
      });
    }
    
    setFilteredVenues(filtered);
  }, [sortedVenues, selectedActivityCategories]);

  // Handle venue filters change
  const handleVenueFiltersChange = useCallback((newFilters: VenueFilters) => {
    setVenueFilters(newFilters);
    applyFiltersToVenues(sortedVenues, newFilters, selectedActivityCategories);
  }, [sortedVenues, selectedActivityCategories, applyFiltersToVenues]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    
    let sorted = [...filteredVenues];
    switch (newSort) {
      case 'popular':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'rating':
        sorted.sort((a, b) => b.bantuRating - a.bantuRating);
        break;
      case 'proximity':
        // For now, sort by area (could be enhanced with actual distance)
        sorted.sort((a, b) => a.location.area.localeCompare(b.location.area));
        break;
      case 'csr':
        sorted.sort((a, b) => (b.csrAlignment ? 1 : 0) - (a.csrAlignment ? 1 : 0));
        break;
      case 'nature':
        sorted.sort((a, b) => (b.features.outdoorFocus ? 1 : 0) - (a.features.outdoorFocus ? 1 : 0));
        break;
      case 'luxury':
        sorted.sort((a, b) => (b.features.luxury ? 1 : 0) - (a.features.luxury ? 1 : 0));
        break;
      default:
        break;
    }
    setFilteredVenues(sorted);
  }, [filteredVenues]);

  const handleActivityToggle = useCallback((activityId: string) => {
    const newSelected = selectedActivityCategories.includes(activityId)
      ? selectedActivityCategories.filter(id => id !== activityId)
      : [...selectedActivityCategories, activityId];
    
    setSelectedActivityCategories(newSelected);
    applyFiltersToVenues(sortedVenues, venueFilters, newSelected);
  }, [selectedActivityCategories, sortedVenues, venueFilters, applyFiltersToVenues]);

  const handleClearActivities = useCallback(() => {
    setSelectedActivityCategories([]);
    applyFiltersToVenues(sortedVenues, venueFilters, []);
  }, [sortedVenues, venueFilters, applyFiltersToVenues]);

  const handleGetQuotation = useCallback((venue: VenueType) => {
    setSelectedVenue(venue);
    setIsQuotationOpen(true);
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-2 md:px-6">
        <VenueSEO venues={filteredVenues} />
        <VenuePopularityManager onVenuesUpdate={handleVenuesUpdate} />
        {/* Responsive grid: filters left (desktop), top (mobile), venues right */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-1 mb-4 md:mb-0">
            {/* Venue filters always visible on desktop */}
            <VenueFiltersComponent
              filters={venueFilters}
              sortBy={sortBy}
              onFiltersChange={handleVenueFiltersChange}
              onSortChange={handleSortChange}
              isLoading={isFiltersLoading}
              totalResults={filteredVenues.length}
            />
          </div>
          <div className="md:col-span-3">
            <VenueHeader
              selectedActivityCategories={selectedActivityCategories}
              onActivityFilterOpen={() => setIsActivityFilterOpen(true)}
            />
            <VenueList
              venues={filteredVenues}
              selectedActivityCategories={selectedActivityCategories}
              onGetQuotation={handleGetQuotation}
              onClearActivities={handleClearActivities}
            />
          </div>
        </div>
      </div>

      <PropertyListingModal 
        isOpen={isPropertyListingOpen} 
        onClose={() => setIsPropertyListingOpen(false)} 
      />

      <QuotationForm 
        venue={selectedVenue} 
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)} 
      />

      <VenueFiltersDialog
        isOpen={isActivityFilterOpen}
        onClose={() => setIsActivityFilterOpen(false)}
        selectedActivityCategories={selectedActivityCategories}
        onActivityToggle={handleActivityToggle}
        onClearActivities={handleClearActivities}
      />
    </section>
  );
};

export default MuldersdriftVenues;
