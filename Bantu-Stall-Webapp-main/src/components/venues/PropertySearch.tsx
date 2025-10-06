import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  MapPin, 
  Users, 
  Filter, 
  X, 
  SlidersHorizontal,
  Building,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell
} from 'lucide-react';
import { PublicPropertyListing } from '@/integrations/supabase/queries/propertyListings';

interface PropertySearchProps {
  onSearchResults: (properties: PublicPropertyListing[]) => void;
  properties: PublicPropertyListing[];
}

interface SearchFilters {
  location: string;
  propertyType: string;
  minCapacity: number;
  maxCapacity: number;
  priceRange: [number, number];
  amenities: string[];
  features: {
    ecoFriendly: boolean;
    luxury: boolean;
    indoorFocus: boolean;
    outdoorFocus: boolean;
    csrAlignment: boolean;
  };
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearchResults, properties }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    minCapacity: 1,
    maxCapacity: 500,
    priceRange: [0, 10000],
    amenities: [],
    features: {
      ecoFriendly: false,
      luxury: false,
      indoorFocus: false,
      outdoorFocus: false,
      csrAlignment: false,
    },
  });

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Coffee },
    { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
    { id: 'spa', label: 'Spa Services', icon: Star },
    { id: 'pool', label: 'Swimming Pool', icon: Building },
  ];

  const propertyTypes = [
    'Hotel', 'Resort', 'Lodge', 'Conference Center', 'Retreat Center', 
    'Game Reserve', 'Boutique Hotel', 'Guest House', 'Corporate Venue'
  ];

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters, properties]);

  const performSearch = () => {
    let filtered = [...properties];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.property_name.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.area.toLowerCase().includes(query) ||
        property.activities.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.area.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.property_type === filters.propertyType
      );
    }

    // Capacity filter
    filtered = filtered.filter(property =>
      property.max_capacity >= filters.minCapacity &&
      property.min_capacity <= filters.maxCapacity
    );

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.some(amenity =>
          property.amenities.some(propAmenity =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    // Features filter
    if (filters.features.ecoFriendly) {
      filtered = filtered.filter(property => property.eco_friendly);
    }
    if (filters.features.luxury) {
      filtered = filtered.filter(property => property.luxury);
    }
    if (filters.features.indoorFocus) {
      filtered = filtered.filter(property => property.indoor_focus);
    }
    if (filters.features.outdoorFocus) {
      filtered = filtered.filter(property => property.outdoor_focus);
    }
    if (filters.features.csrAlignment) {
      filtered = filtered.filter(property => property.csr_alignment);
    }

    onSearchResults(filtered);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      minCapacity: 1,
      maxCapacity: 500,
      priceRange: [0, 10000],
      amenities: [],
      features: {
        ecoFriendly: false,
        luxury: false,
        indoorFocus: false,
        outdoorFocus: false,
        csrAlignment: false,
      },
    });
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filters.location,
    filters.propertyType,
    ...filters.amenities,
    ...Object.values(filters.features).filter(Boolean),
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, locations, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="City or area..."
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Capacity Range */}
              <div className="space-y-2">
                <Label>Group Size</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minCapacity}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        minCapacity: parseInt(e.target.value) || 1 
                      }))}
                      className="pl-10"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxCapacity}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxCapacity: parseInt(e.target.value) || 500 
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {amenityOptions.map(({ id, label, icon: Icon }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={filters.amenities.includes(id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({ 
                            ...prev, 
                            amenities: [...prev.amenities, id] 
                          }));
                        } else {
                          setFilters(prev => ({ 
                            ...prev, 
                            amenities: prev.amenities.filter(a => a !== id) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={id} className="flex items-center gap-1 text-xs">
                      <Icon className="h-3 w-3" />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label>Special Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries({
                  ecoFriendly: 'Eco-Friendly',
                  luxury: 'Luxury',
                  indoorFocus: 'Indoor Focus',
                  outdoorFocus: 'Outdoor Focus',
                  csrAlignment: 'CSR Aligned',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={filters.features[key as keyof typeof filters.features]}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({
                          ...prev,
                          features: {
                            ...prev.features,
                            [key]: checked
                          }
                        }));
                      }}
                    />
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
              />
            </Badge>
          )}
          {filters.propertyType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.propertyType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
              />
            </Badge>
          )}
          {filters.amenities.map(amenity => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              {amenityOptions.find(a => a.id === amenity)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  amenities: prev.amenities.filter(a => a !== amenity) 
                }))}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertySearch;