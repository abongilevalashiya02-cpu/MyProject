import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuotationRequests } from '@/hooks/useQuotationRequests';
import { useConvertRequestToQuotation } from '@/hooks/useQuotationIntegration';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QuotationRequestManagerProps {
  onRequestConverted?: () => void;
}

export const QuotationRequestManager: React.FC<QuotationRequestManagerProps> = ({
  onRequestConverted
}) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const { data: requests = [], isLoading } = useQuotationRequests();
  const convertRequest = useConvertRequestToQuotation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'reviewing': return 'outline';
      case 'quoted': return 'default';
      case 'accepted': return 'default';
      case 'declined': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleConvertRequest = async (request: any) => {
    try {
      await convertRequest.mutateAsync({
        quotationRequestId: request.id,
        quotationRequest: request
      });
      onRequestConverted?.();
    } catch (error) {
      console.error('Failed to convert request:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading quotation requests...</div>;
  }

  const unquotedRequests = requests.filter(req => req.status !== 'quoted');

  if (unquotedRequests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pending quotation requests to convert.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quotation Requests</h3>
          <Badge variant="outline">{unquotedRequests.length} pending</Badge>
        </div>

        <div className="grid gap-4">
          {unquotedRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">
                      {request.company_name || request.contact_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {request.contact_email}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{request.attendee_count || 'TBD'} attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{request.event_duration || 'TBD'} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{request.location_preference || 'Any location'}</span>
                  </div>
                   <div className="text-muted-foreground">
                     Total: {request.total_amount && request.total_amount > 0 ? `${request.currency} ${request.total_amount.toFixed(2)}` : 'No amount set'}
                   </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Submitted {formatDistanceToNow(new Date(request.created_at))} ago
                  </span>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleConvertRequest(request)}
                      disabled={convertRequest.isPending}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Convert to Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p>{selectedRequest.contact_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p>{selectedRequest.contact_email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p>{selectedRequest.contact_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <p>{selectedRequest.company_name || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h4 className="font-medium mb-2">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Objectives:</span>
                    <p>{selectedRequest.event_objectives?.join(', ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Desired Outcomes:</span>
                    <p>{selectedRequest.desired_outcomes?.join(', ') || 'Not specified'}</p>
                  </div>
                  {selectedRequest.additional_goals && (
                    <div>
                      <span className="text-muted-foreground">Additional Goals:</span>
                      <p>{selectedRequest.additional_goals}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Attendees:</span>
                    <p>{selectedRequest.attendee_count || 'TBD'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p>{selectedRequest.event_duration || 'TBD'} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preferred Dates:</span>
                    <p>{selectedRequest.preferred_dates || 'Flexible'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget Range:</span>
                    <p>{selectedRequest.budget_range || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Services & Requirements */}
              <div>
                <h4 className="font-medium mb-2">Services & Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Selected Services:</span>
                    <p>{selectedRequest.selected_services?.join(', ') || 'None specified'}</p>
                  </div>
                  {selectedRequest.catering_requirements && (
                    <div>
                      <span className="text-muted-foreground">Catering:</span>
                      <p>{selectedRequest.catering_requirements}</p>
                    </div>
                  )}
                  {selectedRequest.transportation_needs && (
                    <div>
                      <span className="text-muted-foreground">Transportation:</span>
                      <p>{selectedRequest.transportation_needs}</p>
                    </div>
                  )}
                  {selectedRequest.accommodation_type && (
                    <div>
                      <span className="text-muted-foreground">Accommodation:</span>
                      <p>{selectedRequest.accommodation_type}</p>
                    </div>
                  )}
                  {selectedRequest.special_requirements && (
                    <div>
                      <span className="text-muted-foreground">Special Requirements:</span>
                      <p>{selectedRequest.special_requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-medium mb-2">Pricing</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{selectedRequest.subtotal && selectedRequest.subtotal > 0 ? `${selectedRequest.currency} ${selectedRequest.subtotal.toFixed(2)}` : 'No subtotal set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT:</span>
                    <span>{selectedRequest.vat_amount && selectedRequest.vat_amount > 0 ? `${selectedRequest.currency} ${selectedRequest.vat_amount.toFixed(2)}` : 'No VAT set'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{selectedRequest.total_amount && selectedRequest.total_amount > 0 ? `${selectedRequest.currency} ${selectedRequest.total_amount.toFixed(2)}` : 'No total set'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleConvertRequest(selectedRequest);
                    setViewDialogOpen(false);
                  }}
                  disabled={convertRequest.isPending}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convert to Quotation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};