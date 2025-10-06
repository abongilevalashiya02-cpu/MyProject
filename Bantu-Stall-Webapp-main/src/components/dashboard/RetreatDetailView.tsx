
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar, Eye, Edit, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Retreat, QuotationRequest } from '@/types/retreats';

interface RetreatDetailViewProps {
  retreat: Retreat;
  onBack: () => void;
}

const RetreatDetailView: React.FC<RetreatDetailViewProps> = ({ retreat, onBack }) => {
  const [quotationRequests, setQuotationRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotationRequests();
  }, [retreat.id]);

  const fetchQuotationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          clients!inner(name, email)
        `)
        .eq('user_id', retreat.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure data matches our interface
      setQuotationRequests((data || []) as any[]);
    } catch (error: any) {
      console.error('Error fetching quotation requests:', error);
      toast({
        title: "Error",
        description: "Failed to load retreat details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'quotation_sent': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'venue': return 'Venue';
      case 'shuttle': return 'Shuttle Service';
      case 'photographer': return 'Photographer';
      case 'videographer': return 'Videographer';
      case 'facilitator': return 'Team Facilitator';
      case 'catering': return 'Catering';
      case 'coordinator': return 'Event Coordinator';
      case 'av_equipment': return 'AV Equipment';
      case 'wellness': return 'Wellness Services';
      default: return 'Service';
    }
  };

  const venueRequests = quotationRequests.filter(req => req.service_type === 'venue');
  const addonRequests = quotationRequests.filter(req => req.service_type !== 'venue');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Retreats
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{retreat.name}</h1>
          {retreat.description && (
            <p className="text-gray-600 mt-1">{retreat.description}</p>
          )}
        </div>
      </div>

      {/* Retreat Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="mt-1">
                <Badge className={getStatusColor(retreat.status)}>
                  {retreat.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            {retreat.trip_dates && (
              <div>
                <span className="text-sm font-medium text-gray-500">Trip Dates</span>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{retreat.trip_dates}</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Total RFQs</span>
              <div className="mt-1">
                <span className="text-lg font-semibold">{quotationRequests.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Venue RFQs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Venue Quotation Requests</h2>
          <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Venue RFQ
          </Button>
        </div>
        
        {venueRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <p className="text-gray-600 mb-4">No venue requests yet for this retreat</p>
              <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Add First Venue Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {venueRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{request.venue_name}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{request.retreat_goal}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Group: {request.attendee_count}</span>
                        <span>Dates: {request.preferred_dates}</span>
                        {request.budget_range && <span>Budget: {request.budget_range}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add-on Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add-on Services</h2>
          <Button variant="outline" className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
        
        {addonRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-6">
              <p className="text-gray-600 mb-4">No additional services requested yet</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <Button variant="outline" size="sm">Shuttle</Button>
                <Button variant="outline" size="sm">Photographer</Button>
                <Button variant="outline" size="sm">Facilitator</Button>
                <Button variant="outline" size="sm">Catering</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addonRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{getServiceTypeLabel(request.service_type)}</h4>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{request.description}</p>
                  {request.budget_range && (
                    <p className="text-xs text-gray-500 mt-1">Budget: {request.budget_range}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 border-bantu-orange/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-bantu-orange mb-2">Need planning assistance?</h3>
            <p className="text-sm text-gray-600 mb-3">Book a free consultation with our retreat specialists</p>
            <Button variant="outline" className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10">
              <Phone className="h-4 w-4 mr-2" />
              Book Planning Call
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-green-700 mb-2">Share retreat plan</h3>
            <p className="text-sm text-gray-600 mb-3">Export or send summary to your team members</p>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Share Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetreatDetailView;
