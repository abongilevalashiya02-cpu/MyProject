
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Filter } from 'lucide-react';
import { FilterProps, FilterValues } from '../../types/marketplace';

const countries = [
  'All',
  'South Africa',
  'Morocco',
  'Kenya',
  'Tanzania',
  'Nigeria',
  'Egypt',
  'Ghana'
];

const themes = [
  'All',
  'Cultural',
  'Culinary',
  'Business',
  'Adventure',
  'Fashion',
  'Historical',
  'Art'
];

const hostTypes = [
  'All',
  'Local Guide',
  'Chef',
  'Entrepreneur',
  'Historian',
  'Artist',
  'Designer',
  'Farmer'
];

const FilterSection = ({ onFilter }: FilterProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [filters, setFilters] = useState<FilterValues>({
    country: 'All',
    theme: 'All',
    hostType: 'All'
  });

  const handleFilterChange = (key: keyof FilterValues, value: string | Date) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center mb-4">
        <Filter className="mr-2 text-bantu-orange" />
        <h2 className="text-xl font-bold">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <Select
            value={filters.country}
            onValueChange={(value) => handleFilterChange('country', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    handleFilterChange('date', newDate);
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <Select
            value={filters.theme}
            onValueChange={(value) => handleFilterChange('theme', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Host Type</label>
          <Select
            value={filters.hostType}
            onValueChange={(value) => handleFilterChange('hostType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select host type" />
            </SelectTrigger>
            <SelectContent>
              {hostTypes.map((hostType) => (
                <SelectItem key={hostType} value={hostType}>
                  {hostType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
