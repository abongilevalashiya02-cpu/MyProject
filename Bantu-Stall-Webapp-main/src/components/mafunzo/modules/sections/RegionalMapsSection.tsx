
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RegionalMapsContainer from '@/components/mafunzo/maps/RegionalMapsContainer';

const RegionalMapsSection = () => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Regional Maps Collection</h2>
          <p className="text-gray-600">
            Explore major tourist routes and top destinations across the 16 SADC countries through our 
            interactive map collection. Toggle between country and theme views to discover the rich 
            diversity of Southern Africa's tourism offerings.
          </p>
        </div>
        
        <RegionalMapsContainer />
        
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-bold mb-2">How to Use This Resource</h3>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Switch between <strong>Country</strong> and <strong>Theme</strong> views using the tabs at the top</li>
            <li>Filter destinations by selecting a specific country or experience type</li>
            <li>Hover over (or tap on mobile) destination markers to see details</li>
            <li>View famous tourism routes connecting multiple destinations</li>
            <li>Use the map controls to zoom in/out and navigate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalMapsSection;
