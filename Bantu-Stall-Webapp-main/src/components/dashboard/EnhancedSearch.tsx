import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  X, 
  CalendarIcon, 
  DollarSign, 
  Building, 
  User, 
  MapPin, 
  Tag,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface SortOption {
  field: string;
  label: string;
  direction: 'asc' | 'desc';
}

interface EnhancedSearchProps {
  data: any[];
  onFilter: (filteredData: any[]) => void;
  onExport?: (filteredData: any[]) => void;
  searchableFields: string[];
  filters?: SearchFilter[];
  sortOptions?: SortOption[];
  placeholder?: string;
  enableExport?: boolean;
  enableBulkActions?: boolean;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
}

interface ActiveFilter {
  filterId: string;
  value: any;
  label: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  data,
  onFilter,
  onExport,
  searchableFields,
  filters = [],
  sortOptions = [],
  placeholder = 'Search...',
  enableExport = false,
  enableBulkActions = false,
  onBulkAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeFilters, sortBy, sortDirection, dateRange]);

  // Apply all filters and sorting
  const applyFilters = useCallback(() => {
    let filteredData = [...data];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(item =>
        searchableFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply active filters
    activeFilters.forEach(filter => {
      const filterConfig = filters.find(f => f.id === filter.filterId);
      if (!filterConfig) return;

      filteredData = filteredData.filter(item => {
        const value = getNestedValue(item, filter.filterId);
        
        switch (filterConfig.type) {
          case 'text':
            return value && value.toString().toLowerCase().includes(filter.value.toLowerCase());
          case 'select':
            return value === filter.value;
          case 'boolean':
            return Boolean(value) === filter.value;
          case 'number':
            return Number(value) === Number(filter.value);
          case 'date':
            if (dateRange?.from && dateRange?.to) {
              const itemDate = new Date(value);
              return itemDate >= dateRange.from && itemDate <= dateRange.to;
            }
            return true;
          default:
            return true;
        }
      });
    });

    // Apply sorting
    if (sortBy) {
      filteredData.sort((a, b) => {
        const aValue = getNestedValue(a, sortBy);
        const bValue = getNestedValue(b, sortBy);
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    onFilter(filteredData);
  }, [data, searchQuery, activeFilters, sortBy, sortDirection, dateRange, searchableFields, filters, onFilter]);

  // Helper function to get nested object values
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Add filter
  const addFilter = (filterId: string, value: any, label: string) => {
    setActiveFilters(prev => {
      const existing = prev.find(f => f.filterId === filterId);
      if (existing) {
        return prev.map(f => 
          f.filterId === filterId 
            ? { ...f, value, label } 
            : f
        );
      }
      return [...prev, { filterId, value, label }];
    });
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.filterId !== filterId));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilters([]);
    setSortBy('');
    setDateRange(undefined);
    setSelectedItems([]);
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Export filtered data
  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  // Render filter controls
  const renderFilterControl = (filter: SearchFilter) => {
    const activeFilter = activeFilters.find(f => f.filterId === filter.id);

    switch (filter.type) {
      case 'select':
        return (
          <Select
            onValueChange={(value) => {
              const option = filter.options?.find(opt => opt.value === value);
              addFilter(filter.id, value, option?.label || value);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={activeFilter?.value || ''}
            onChange={(e) => addFilter(filter.id, e.target.value, e.target.value)}
            className="w-48"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={filter.id}
              checked={activeFilter?.value || false}
              onCheckedChange={(checked) => 
                addFilter(filter.id, checked, checked ? 'Yes' : 'No')
              }
            />
            <Label htmlFor={filter.id}>{filter.label}</Label>
          </div>
        );

      default:
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={activeFilter?.value || ''}
            onChange={(e) => addFilter(filter.id, e.target.value, e.target.value)}
            className="w-48"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>

          {sortOptions.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <Command>
                  <CommandInput placeholder="Search sort options..." />
                  <CommandEmpty>No sort options found.</CommandEmpty>
                  <CommandGroup>
                    {sortOptions.map((option) => (
                      <CommandItem
                        key={option.field}
                        onSelect={() => toggleSort(option.field)}
                        className="flex items-center justify-between"
                      >
                        {option.label}
                        {sortBy === option.field && (
                          <Badge variant="secondary">
                            {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {enableExport && (
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}

          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && filters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Advanced Filters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(filter => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="text-sm font-medium">{filter.label}</Label>
                    {renderFilterControl(filter)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => {
            const filterConfig = filters.find(f => f.id === filter.filterId);
            return (
              <Badge
                key={filter.filterId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filterConfig?.label}: {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter.filterId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Bulk Actions */}
      {enableBulkActions && selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedItems.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkAction?.('export', selectedItems)}
            >
              Export Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkAction?.('delete', selectedItems)}
              className="text-red-600 hover:text-red-700"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      {enableBulkActions && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Checkbox
            checked={selectedItems.length === data.length && data.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <span>Select all ({data.length} items)</span>
        </div>
      )}
    </div>
  );
};

// Helper component for individual search result highlighting
export const HighlightText: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight
}) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};