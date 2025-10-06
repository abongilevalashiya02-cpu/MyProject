
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Eye, Edit3 } from 'lucide-react';
import { Retreat } from '@/types/retreats';

interface RetreatCardProps {
  retreat: Retreat;
  rfqCount: number;
  onViewRetreat: (retreat: Retreat) => void;
}

const RetreatCard: React.FC<RetreatCardProps> = ({ retreat, rfqCount, onViewRetreat }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'quotation_review': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'complete': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planning';
      case 'quotation_review': return 'Quotation Review';
      case 'booked': return 'Booked';
      case 'complete': return 'Complete';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewRetreat(retreat)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{retreat.name}</CardTitle>
          <Badge className={getStatusColor(retreat.status)}>
            {getStatusLabel(retreat.status)}
          </Badge>
        </div>
        {retreat.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{retreat.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {retreat.trip_dates && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{retreat.trip_dates}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{rfqCount} {rfqCount === 1 ? 'RFQ' : 'RFQs'} linked</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewRetreat(retreat);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10"
              onClick={(e) => {
                e.stopPropagation();
                onViewRetreat(retreat);
              }}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetreatCard;
