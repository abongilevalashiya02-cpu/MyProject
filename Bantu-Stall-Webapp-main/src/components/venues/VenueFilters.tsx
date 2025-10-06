
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VenueFilters, SortOption } from '../../types/venues';
import { Filter, X, RefreshCw, MapPin, Users, Leaf, Star } from 'lucide-react';

interface VenueFiltersProps {
  filters: VenueFilters;
  sortBy: SortOption;
  onFiltersChange: (filters: VenueFilters) => void;
  onSortChange: (sort: SortOption) => void;
  isLoading?: boolean;
  totalResults?: number;
}

const VenueFiltersComponent = ({ 
  filters, 
  sortBy, 
  onFiltersChange, 
  onSortChange, 
  isLoading = false,
  totalResults = 0 
}: VenueFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded for better UX
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: Star },
    { value: 'proximity', label: 'Closest to Sandton', icon: MapPin },
    { value: 'rating', label: 'Highest Rated by Bantu Stall', icon: Star },
    { value: 'csr', label: 'CSR-Aligned', icon: Leaf },
    { value: 'nature', label: 'Nature-Immersive', icon: Leaf },
    { value: 'luxury', label: 'Luxurious', icon: Star }
  ];

  // Check if filters are active
  React.useEffect(() => {
    const isActive = 
      filters.budgetRange[0] > 200 || 
      filters.budgetRange[1] < 5000 ||
      filters.groupSize !== 'any' ||
      filters.focus !== 'any' ||
      filters.ecoFriendly;
    setHasActiveFilters(isActive);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    onFiltersChange({
      budgetRange: [200, 5000],
      groupSize: 'any',
      focus: 'any',
      ecoFriendly: false
    });
  }, [onFiltersChange]);

  const formatCurrency = (value: number) => `R${value.toLocaleString()}`;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.budgetRange[0] > 200 || filters.budgetRange[1] < 5000) count++;
    if (filters.groupSize !== 'any') count++;
    if (filters.focus !== 'any') count++;
    if (filters.ecoFriendly) count++;
    return count;
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter Header with Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filter Venues</h2>
          {totalResults > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalResults} results
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {filters.budgetRange[0] > 200 && (
            <Badge variant="secondary" className="text-xs">
              Min: {formatCurrency(filters.budgetRange[0])}
            </Badge>
          )}
          {filters.budgetRange[1] < 5000 && (
            <Badge variant="secondary" className="text-xs">
              Max: {formatCurrency(filters.budgetRange[1])}
            </Badge>
          )}
          {filters.groupSize !== 'any' && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              {filters.groupSize}
            </Badge>
          )}
          {filters.focus !== 'any' && (
            <Badge variant="secondary" className="text-xs">
              {filters.focus} focus
            </Badge>
          )}
          {filters.ecoFriendly && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Eco-Friendly
            </Badge>
          )}
        </motion.div>
      )}

      {/* Sort By Section */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={sortBy} 
            onValueChange={(value) => onSortChange(value as SortOption)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort venues by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="text-base font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="default" className="text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4" />
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CardContent className="pt-0 space-y-6">
            {/* Budget Range - Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Budget Range (per person)
              </Label>
              
              {/* Budget Dropdown */}
              <Select 
                value={`${filters.budgetRange[0]}-${filters.budgetRange[1]}`}
                onValueChange={(value) => {
                  const [min, max] = value.split('-').map(Number);
                  onFiltersChange({ ...filters, budgetRange: [min, max] });
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200-1000">Budget (R200 - R1,000)</SelectItem>
                  <SelectItem value="1000-2000">Mid-Range (R1,000 - R2,000)</SelectItem>
                  <SelectItem value="2000-3000">Premium (R2,000 - R3,000)</SelectItem>
                  <SelectItem value="3000-5000">Luxury (R3,000 - R5,000)</SelectItem>
                  <SelectItem value="200-5000">Any Budget (R200 - R5,000)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Current Selection Display */}
              <div className="text-xs text-muted-foreground text-center">
                Selected: {formatCurrency(filters.budgetRange[0])} - {formatCurrency(filters.budgetRange[1])}
              </div>
            </div>

            {/* Group Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Group Size
              </Label>
              <Select 
                value={filters.groupSize} 
                onValueChange={(value) => onFiltersChange({ ...filters, groupSize: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Size</SelectItem>
                  <SelectItem value="small">Small (1-30 people)</SelectItem>
                  <SelectItem value="medium">Medium (31-100 people)</SelectItem>
                  <SelectItem value="large">Large (100+ people)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Focus */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Focus Area
              </Label>
              <Select 
                value={filters.focus} 
                onValueChange={(value) => onFiltersChange({ ...filters, focus: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Focus</SelectItem>
                  <SelectItem value="indoor">Indoor Focus</SelectItem>
                  <SelectItem value="outdoor">Outdoor Focus</SelectItem>
                  <SelectItem value="mixed">Indoor & Outdoor Mix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Eco-Friendly Toggle */}
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="ecoFriendly"
                checked={filters.ecoFriendly}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, ecoFriendly: checked as boolean })}
                disabled={isLoading}
              />
              <Label 
                htmlFor="ecoFriendly" 
                className="text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-green-600" />
                Eco-Friendly Venues Only
              </Label>
            </div>
          </CardContent>
        </motion.div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <motion.div 
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Filtering venues...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VenueFiltersComponent;
