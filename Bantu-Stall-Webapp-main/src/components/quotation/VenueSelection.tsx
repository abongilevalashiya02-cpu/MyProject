import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Star, MapPin, Users, Leaf, Crown, Building, TreePine, Check } from 'lucide-react';
import { getAllVenues } from '@/data/venues';
import { VenueType } from '@/types/venues';
import { fetchPropertyListingsByVenueType } from '@/integrations/supabase/queries/propertyListingsWithVenueType';
import { VENUE_TYPE_LABELS, DEFAULT_ROOM_RATES } from '@/utils/venuePricingUtils';
import { cn } from '@/lib/utils';
import EnhancedVenueCard from './EnhancedVenueCard';

interface VenueSelectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

const VenueSelection: React.FC<VenueSelectionProps> = ({ formData, setFormData, formatCurrency }) => {
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<VenueType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    ecoFriendly: false,
    luxury: false,
    csrAlignment: false,
    location: 'all'
  });

  useEffect(() => {
    const loadVenues = async () => {
      try {
        // Load hardcoded venues
        const hardcodedVenues = await getAllVenues();
        
        // Filter by venue type if specified
        let filteredHardcoded = hardcodedVenues;
        if (formData.venue_type) {
          filteredHardcoded = hardcodedVenues.filter(v => v.venueType === formData.venue_type);
        }
        
        // Load database venues filtered by venue type
        let dbVenues: any[] = [];
        if (formData.venue_type) {
          try {
            const propertyListings = await fetchPropertyListingsByVenueType(formData.venue_type);
            // Convert property listings to VenueType format
            dbVenues = propertyListings.map(listing => ({
              id: listing.id,
              name: listing.property_name,
              venueType: listing.venueType,
              summary: listing.description,
              bantuRating: 4,
              coverImage: listing.media_urls?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
              pricingSnapshot: listing.price_range_zar || "Contact for pricing",
              activities: listing.activities ? listing.activities.split(',').map((a: string) => a.trim()) : [],
              location: {
                city: listing.location,
                area: listing.area,
                proximityToSandton: listing.proximity_to_landmark,
                coordinates: undefined
              },
              contact: {
                phone: "Book with us for exclusive rates",
                email: "Book with us for exclusive rates",
                address: listing.location
              },
              capacity: {
                min: listing.min_capacity,
                max: listing.max_capacity
              },
              features: {
                ecoFriendly: listing.eco_friendly,
                luxury: listing.luxury,
                indoorFocus: listing.indoor_focus,
                outdoorFocus: listing.outdoor_focus
              },
              csrAlignment: listing.csr_alignment,
              popularity: 70
            }));
          } catch (error) {
            console.error('Error loading database venues:', error);
          }
        }
        
        // Combine and deduplicate by name
        const combined = [...filteredHardcoded, ...dbVenues];
        const uniqueVenues = combined.filter((venue, index, self) =>
          index === self.findIndex(v => v.name === venue.name)
        );
        
        setVenues(uniqueVenues);
        setLoading(false);
      } catch (error) {
        console.error('Error loading venues:', error);
        setLoading(false);
      }
    };
    loadVenues();
  }, [formData.venue_type]);

  useEffect(() => {
    if (venues.length === 0) return;

    let curated = [...venues];

    // STRICT filtering - only show venues that specifically meet their needs
    
    // Must accommodate attendee count (required)
    if (formData.attendee_count) {
      curated = curated.filter(venue => 
        venue.capacity.min <= formData.attendee_count && 
        venue.capacity.max >= formData.attendee_count
      );
    }

    // Must fit within budget range (required)
    if (formData.budget_range) {
      const budgetNum = parseBudgetRange(formData.budget_range);
      if (budgetNum) {
        curated = curated.filter(venue => {
          const venuePrice = extractVenuePricing(venue.pricingSnapshot);
          return venuePrice <= budgetNum.max && venuePrice >= budgetNum.min * 0.7; // Within reasonable range
        });
      }
    }

    // Curate based on event objectives and outcomes
    if (formData.event_objectives?.length > 0) {
      const hasESGObjective = formData.event_objectives.includes('ESG + CSR Initiative');
      const hasCultureBuilding = formData.event_objectives.includes('Culture Building');
      const hasThoughtLeadership = formData.event_objectives.includes('Showcasing Thought Leadership');
      
      if (hasESGObjective) {
        curated = curated.filter(venue => venue.csrAlignment || venue.features.ecoFriendly);
      }
      if (hasCultureBuilding || hasThoughtLeadership) {
        curated = curated.filter(venue => venue.features.luxury || venue.bantuRating >= 4);
      }
    }

    // Apply user-selected filters on top of curation
    if (selectedFilters.ecoFriendly) {
      curated = curated.filter(venue => venue.features.ecoFriendly);
    }
    if (selectedFilters.luxury) {
      curated = curated.filter(venue => venue.features.luxury);
    }
    if (selectedFilters.csrAlignment) {
      curated = curated.filter(venue => venue.csrAlignment);
    }
    if (selectedFilters.location !== 'all') {
      curated = curated.filter(venue => 
        venue.location.area.toLowerCase() === selectedFilters.location.toLowerCase()
      );
    }

    // Sort by best match (rating + popularity + features alignment)
    curated.sort((a, b) => {
      const scoreA = calculateVenueScore(a);
      const scoreB = calculateVenueScore(b);
      return scoreB - scoreA;
    });

    // Limit to top 6-8 most suitable venues for better curation
    setFilteredVenues(curated.slice(0, 8));
  }, [venues, formData.attendee_count, formData.budget_range, formData.event_objectives, selectedFilters]);

  const calculateVenueScore = (venue: VenueType): number => {
    let score = venue.bantuRating * 20 + venue.popularity * 10;
    
    // Bonus points for features that match objectives
    if (formData.event_objectives?.includes('ESG + CSR Initiative')) {
      if (venue.csrAlignment) score += 25;
      if (venue.features.ecoFriendly) score += 20;
    }
    if (formData.event_objectives?.includes('Culture Building') || 
        formData.event_objectives?.includes('Showcasing Thought Leadership')) {
      if (venue.features.luxury) score += 15;
    }
    
    return score;
  };

  const parseBudgetRange = (budgetRange: string) => {
    // Handle different budget formats for different currencies
    if (budgetRange.includes('Less than')) {
      const amount = budgetRange.match(/\d+/g)?.[0];
      return amount ? { min: 0, max: parseInt(amount) } : { min: 0, max: 50000 };
    }
    
    // For range formats like "R50,000-R100,000"
    const amounts = budgetRange.match(/[\d,]+/g);
    if (amounts && amounts.length >= 2) {
      const min = parseInt(amounts[0].replace(/,/g, ''));
      const max = parseInt(amounts[1].replace(/,/g, ''));
      return { min, max };
    }
    
    // For plus formats like "R500,000+"
    if (budgetRange.includes('+')) {
      const amount = budgetRange.match(/[\d,]+/g)?.[0];
      const min = amount ? parseInt(amount.replace(/,/g, '')) : 500000;
      return { min, max: min * 2 };
    }
    
    return { min: 0, max: 1000000 }; // Default fallback
  };

  const extractVenuePricing = (pricingSnapshot: string): number => {
    // Extract maximum price from pricing snapshot for comparison
    const matches = pricingSnapshot.match(/R([\d,]+)/g);
    if (matches) {
      const prices = matches.map(match => parseInt(match.replace(/[R,]/g, '')));
      return Math.max(...prices) * (formData.attendee_count || 50); // Rough estimate per person
    }
    return 100000; // Default fallback
  };


  const handleVenueSelect = (venue: VenueType) => {
    setFormData(prev => ({
      ...prev,
      selected_venue_id: venue.id,
      location_preference: venue.location.area,
      venue_preferences: `${venue.name} - ${venue.summary}`,
      selected_venue: venue // Store full venue object for pricing calculations
    }));
  };

  const selectedVenue = venues.find(v => v.id === formData.selected_venue_id);
  const roomRates = formData.venue_type ? DEFAULT_ROOM_RATES[formData.venue_type] : DEFAULT_ROOM_RATES['corporate-hotel'];

  const getUniqueAreas = () => {
    const areas = [...new Set(venues.map(venue => venue.location.area))];
    return areas.sort();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading venues that match your requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="location-filter">Location</Label>
              <Select 
                value={selectedFilters.location} 
                onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {getUniqueAreas().map(area => (
                    <SelectItem key={area} value={area.toLowerCase()}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eco-friendly"
                checked={selectedFilters.ecoFriendly}
                onCheckedChange={(checked) => 
                  setSelectedFilters(prev => ({ ...prev, ecoFriendly: checked as boolean }))
                }
              />
              <Label htmlFor="eco-friendly" className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                Eco-Friendly
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="luxury"
                checked={selectedFilters.luxury}
                onCheckedChange={(checked) => 
                  setSelectedFilters(prev => ({ ...prev, luxury: checked as boolean }))
                }
              />
              <Label htmlFor="luxury" className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                Luxury
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="csr-alignment"
                checked={selectedFilters.csrAlignment}
                onCheckedChange={(checked) => 
                  setSelectedFilters(prev => ({ ...prev, csrAlignment: checked as boolean }))
                }
              />
              <Label htmlFor="csr-alignment" className="flex items-center gap-2">
                <TreePine className="h-4 w-4 text-blue-600" />
                CSR Aligned
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Found {filteredVenues.length} venues matching your requirements
        {formData.attendee_count && ` for ${formData.attendee_count} attendees`}
        {formData.budget_range && ` within ${formData.budget_range} budget`}
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVenues.map((venue) => (
          <EnhancedVenueCard
            key={venue.id}
            venue={venue}
            isSelected={formData.selected_venue_id === venue.id}
            onSelect={handleVenueSelect}
          />
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Perfect Matches Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find venues that exactly match all your criteria. Here are our closest recommendations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {venues.slice(0, 4).map((venue) => (
                <Card key={venue.id} className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{venue.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{venue.location.area}</p>
                    <p className="text-xs mb-2">{venue.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{venue.pricingSnapshot.split(' - ')[0]}</span>
                      <Button size="sm" variant="outline" onClick={() => handleVenueSelect(venue)}>
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSelectedFilters({ ecoFriendly: false, luxury: false, csrAlignment: false, location: 'all' })}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Accommodation Section - Shows after venue selection */}
      {selectedVenue && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Accommodation Requirements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure accommodation for {selectedVenue.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                Do you require accommodation?
              </Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    requires_accommodation: true 
                  }))}
                  className={cn(
                    "flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    formData.requires_accommodation
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    requires_accommodation: false,
                    standard_rooms: null,
                    executive_rooms: null,
                    presidential_rooms: null
                  }))}
                  className={cn(
                    "flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    !formData.requires_accommodation
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  )}
                >
                  No
                </button>
              </div>
            </div>

            {formData.requires_accommodation && (
              <div className="space-y-4 p-4 rounded-lg border-2 border-border bg-muted/30">
                <Label className="text-base font-semibold">Room Requirements</Label>
                <p className="text-sm text-muted-foreground">Specify the number of rooms needed by type</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="standard_rooms" className="text-sm mb-2 block">
                      Standard Rooms
                    </Label>
                    <Input
                      id="standard_rooms"
                      type="number"
                      min="0"
                      value={formData.standard_rooms || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        standard_rooms: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      R{roomRates.standard.toLocaleString()}/room/night
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="executive_rooms" className="text-sm mb-2 block">
                      Executive Rooms
                    </Label>
                    <Input
                      id="executive_rooms"
                      type="number"
                      min="0"
                      value={formData.executive_rooms || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        executive_rooms: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      R{roomRates.executive.toLocaleString()}/room/night
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="presidential_rooms" className="text-sm mb-2 block">
                      Presidential Suites
                    </Label>
                    <Input
                      id="presidential_rooms"
                      type="number"
                      min="0"
                      value={formData.presidential_rooms || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        presidential_rooms: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      R{roomRates.presidential.toLocaleString()}/room/night
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Venue Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.venue_preferences}
            onChange={(e) => setFormData(prev => ({ ...prev, venue_preferences: e.target.value }))}
            placeholder="Any specific venue requirements or preferences? (e.g., specific facilities, accessibility needs, etc.)"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueSelection;