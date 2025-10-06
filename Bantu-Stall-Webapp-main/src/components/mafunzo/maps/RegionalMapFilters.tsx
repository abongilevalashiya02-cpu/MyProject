
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DestinationType, MapFilter, ViewMode, Route } from "./RegionalMapsContainer";

interface Props {
  viewMode: ViewMode;
  filter: MapFilter;
  setFilter: (f: MapFilter) => void;
  countries: string[];
  getDestinationColor: (type: DestinationType) => string;
  routes: Route[];
}

const RegionalMapFilters: React.FC<Props> = ({
  viewMode,
  filter,
  setFilter,
  countries,
  getDestinationColor,
  routes,
}) => (
  <div className="col-span-1 border rounded-md p-3 h-[500px] overflow-y-auto">
    <div className="flex items-center gap-2 mb-3">
      <Filter className="h-4 w-4 text-bantu-orange" />
      <h3 className="font-semibold">
        {viewMode === "country" ? "Countries" : "Experience Types"}
      </h3>
    </div>
    <div className="space-y-1">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        className="w-full justify-start text-left"
        onClick={() => setFilter("all")}
      >
        All
      </Button>
      {viewMode === "country"
        ? countries.map((country) => (
            <Button
              key={country}
              variant={filter === country ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => setFilter(country)}
            >
              {country}
            </Button>
          ))
        : (["Nature", "Culture", "Adventure", "Retreat"] as DestinationType[]).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => setFilter(type)}
              style={{
                backgroundColor: filter === type ? getDestinationColor(type) : undefined,
              }}
            >
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: getDestinationColor(type) }}
              ></div>
              {type}
            </Button>
          ))}
    </div>
    {/* Legend */}
    <div className="mt-6 pt-4 border-t">
      <h3 className="font-semibold mb-2">Map Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#e45325] mr-2"></div>
          <span className="text-sm">Culture</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#fbb040] mr-2"></div>
          <span className="text-sm">Nature</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#e76f51] mr-2"></div>
          <span className="text-sm">Adventure</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#2a9d8f] mr-2"></div>
          <span className="text-sm">Retreat/Wellness</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-5 h-0 border-b-2 border-dashed border-[#3887be] mr-2"></div>
          <span className="text-sm">Tourism Routes</span>
        </div>
      </div>
    </div>
    {/* Famous Routes */}
    <div className="mt-6 pt-4 border-t">
      <h3 className="font-semibold mb-2">Famous Routes</h3>
      <div className="space-y-2">
        {routes.map((route) => (
          <div key={route.id} className="text-sm">
            <div className="font-medium">{route.name}</div>
            <div className="text-gray-500 text-xs">{route.description}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RegionalMapFilters;
