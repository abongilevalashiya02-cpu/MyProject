import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Filter, TrendingUp } from 'lucide-react';
interface VenueHeaderProps {
  selectedActivityCategories: string[];
  onActivityFilterOpen: () => void;
}
const VenueHeader: React.FC<VenueHeaderProps> = ({
  selectedActivityCategories,
  onActivityFilterOpen
}) => {
  return <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Top-Rated Venues</h2>
      <p className="text-base text-gray-600 max-w-3xl mx-auto mb-6">
        Ready to plan your next offsite? Scroll through curated retreat spaces designed for productivity, connection, and recharge. From boardroom-ready lodges to scenic hideaways — your ideal venue starts here.
      </p>
      
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Sorted by popularity (most quotation requests)</span>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onActivityFilterOpen} className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          <Filter className="mr-3 h-5 w-5" />
          Filter Venues by Activity
          {selectedActivityCategories.length > 0 && <span className="ml-3 bg-white text-bantu-orange text-sm px-3 py-1 rounded-full font-bold">
              {selectedActivityCategories.length}
            </span>}
        </Button>
      </div>
    </div>;
};
export default VenueHeader;