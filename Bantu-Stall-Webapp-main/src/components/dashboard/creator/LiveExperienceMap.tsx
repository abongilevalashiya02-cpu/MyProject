
import React from 'react';
import { MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LiveExperienceMap = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Live Experience Map</h3>
        <MapPin className="h-5 w-5 text-bantu-orange" />
      </div>
      
      <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
        <div className="text-center px-4">
          <MapPin className="h-10 w-10 mx-auto text-bantu-orange mb-2" />
          <p className="text-gray-600">Interactive map of experiences across Africa</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="kenya">Kenya</SelectItem>
            <SelectItem value="south-africa">South Africa</SelectItem>
            <SelectItem value="morocco">Morocco</SelectItem>
            <SelectItem value="ghana">Ghana</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food & Cuisine</SelectItem>
            <SelectItem value="culture">Cultural</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="wildlife">Wildlife</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
    </div>
  );
};

export default LiveExperienceMap;
