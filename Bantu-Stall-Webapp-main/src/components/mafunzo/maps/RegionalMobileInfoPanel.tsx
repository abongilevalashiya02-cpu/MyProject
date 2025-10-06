
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Destination, DestinationType } from "./RegionalMapsContainer";

interface Props {
  destination: Destination;
  onClose: () => void;
  getDestinationColor: (type: DestinationType) => string;
}

const RegionalMobileInfoPanel: React.FC<Props> = ({
  destination,
  onClose,
  getDestinationColor,
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
    <div className="bg-white w-full rounded-t-xl p-4 max-h-[60vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{destination.name}</h3>
          <p className="text-sm text-gray-500">{destination.country}</p>
        </div>
        <Button variant="ghost" className="p-1 h-auto" onClick={onClose}>
          &times;
        </Button>
      </div>
      <Badge
        style={{ backgroundColor: getDestinationColor(destination.type) }}
        className="mb-3 text-white border-none"
      >
        {destination.type}
      </Badge>
      <p className="mb-4">{destination.description}</p>
      <Button className="w-full">View Experiences</Button>
    </div>
  </div>
);

export default RegionalMobileInfoPanel;
