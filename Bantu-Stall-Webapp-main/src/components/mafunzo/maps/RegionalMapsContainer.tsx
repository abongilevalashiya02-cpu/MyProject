
import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegionalMapFilters from "./RegionalMapFilters";
import RegionalMapDisplay from "./RegionalMapDisplay";
import RegionalMobileInfoPanel from "./RegionalMobileInfoPanel";
import { MapPin, Map, Compass, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Shared data types
export type DestinationType = 'Nature' | 'Culture' | 'Adventure' | 'Retreat';
export interface Destination {
  id: string;
  name: string;
  country: string;
  type: DestinationType;
  description: string;
  coordinates: [number, number]; // [lng, lat]
}
export interface Route {
  id: string;
  name: string;
  description: string;
  destinations: string[];
  coordinates: [number, number][];
}
// Helpers shared by filters, display, and mobile info
export const getDestinationColor = (type: DestinationType): string => {
  switch (type) {
    case "Culture": return "#e45325";
    case "Nature": return "#fbb040";
    case "Adventure": return "#e76f51";
    case "Retreat": return "#2a9d8f";
    default: return "#666666";
  }
};

// Sample data: destinations and routes
import { destinations, routes } from "./regionalMapsData";

export type ViewMode = "country" | "theme";
export type MapFilter = "all" | DestinationType | string;

const RegionalMapsContainer: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("country");
  const [filter, setFilter] = useState<MapFilter>("all");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const isMobile = useIsMobile();

  // For mobile panel
  const handleDestinationClick = (dest: Destination) => {
    setSelectedDestination(dest);
    if (isMobile) setShowMobileInfo(true);
  };

  // Get countries for filter display
  const countries = [...new Set(destinations.map((d) => d.country))].sort();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold">Regional Maps Collection</h2>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="country" className="flex items-center gap-1">
                  <Map className="h-4 w-4" />
                  <span>By Country</span>
                </TabsTrigger>
                <TabsTrigger value="theme" className="flex items-center gap-1">
                  <Compass className="h-4 w-4" />
                  <span>By Theme</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <RegionalMapFilters
              viewMode={viewMode}
              filter={filter}
              setFilter={setFilter}
              countries={countries}
              getDestinationColor={getDestinationColor}
              routes={routes}
            />
            <div className="col-span-1 lg:col-span-3 border rounded-md overflow-hidden relative">
              <RegionalMapDisplay
                viewMode={viewMode}
                filter={filter}
                onDestinationClick={handleDestinationClick}
                getDestinationColor={getDestinationColor}
                destinations={destinations}
                routes={routes}
              />
              {isMobile && (
                <div className="absolute bottom-4 left-0 right-0 mx-auto w-[90%] bg-white p-3 rounded-lg shadow-md text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-bantu-orange" />
                    Tap on destinations to explore details
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {showMobileInfo && selectedDestination && (
        <RegionalMobileInfoPanel
          destination={selectedDestination}
          onClose={() => { setShowMobileInfo(false); setSelectedDestination(null); }}
          getDestinationColor={getDestinationColor}
        />
      )}
    </div>
  );
};

export default RegionalMapsContainer;
