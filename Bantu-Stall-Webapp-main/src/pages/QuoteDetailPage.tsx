import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Calendar, Users, Building2, Mail, Phone, 
  MapPin, FileText, DollarSign, Clock, MessageCircle,
  Edit, Trash2, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { QuotationRequest } from '@/types/retreats';

const QuoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useRequireAuth('/login');
  const { toast } = useToast();
  
  const [quote, setQuote] = useState<QuotationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchQuoteDetails();
    }
  }, [id, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuoteDetails = async () => {
    if (!id || !user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        toast({
          title: "Error",
          description: "Failed to load quote details",
          variant: "destructive",
        });
        navigate('/retreat-dashboard');
        return;
      }

      setQuote(data as unknown as QuotationRequest);
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast({
        title: "Error",
        description: "Failed to load quote details",
        variant: "destructive",
      });
      navigate('/retreat-dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuoteStatus = async (newStatus: string) => {
    if (!quote || !user) return;

    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('quotations')
        .update({ 
          status: newStatus as "draft" | "paid" | "sent" | "expired" | "declined" | "viewed" | "accepted",
          updated_at: new Date().toISOString()
        })
        .eq('id', quote.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setQuote(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: "Success",
        description: `Quote status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteQuote = async () => {
    if (!quote || !user) return;

    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', quote.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      
      navigate('/retreat-dashboard');
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quotation_sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'quotation_sent':
        return <FileText className="h-4 w-4" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatServiceType = (serviceType: string) => {
    return serviceType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bantu-orange"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quote) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/retreat-dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-bantu-orange via-orange-500 to-bantu-yellow relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/retreat-dashboard')}
                    className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-bantu-orange backdrop-blur-sm"
                  >
                    ← Back to Dashboard
                  </Button>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Quote Details
                </h1>
                <p className="text-xl text-white/90">
                  Venue: {quote.venue_name}
                </p>
                
                <div className="flex justify-center mt-6">
                  <Badge className={`${getStatusColor(quote.status)} border px-4 py-2 text-base`}>
                    {getStatusIcon(quote.status)}
                    <span className="ml-2">{quote.status.replace('_', ' ').toUpperCase()}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quote Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Quote Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Type</label>
                      <p className="text-gray-900">{formatServiceType(quote.service_type)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Retreat Goal</label>
                      <p className="text-gray-900">{quote.retreat_goal}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Attendee Count</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quote.attendee_count}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking Type</label>
                      <p className="text-gray-900">{quote.booking_type}</p>
                    </div>
                  </div>

                  {quote.custom_goal && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Custom Goal</label>
                      <p className="text-gray-900">{quote.custom_goal}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Dates</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {quote.preferred_dates}
                    </p>
                  </div>

                  {quote.budget_range && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Budget Range</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {quote.budget_range}
                      </p>
                    </div>
                  )}

                  {quote.add_on_services && quote.add_on_services.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Add-on Services</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {quote.add_on_services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {quote.special_requests && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Special Requests</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {quote.special_requests}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Name</label>
                      <p className="text-gray-900">{quote.contact_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {quote.contact_email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quote.status === 'pending' && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateQuoteStatus('in_review')}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Mark as In Review
                    </Button>
                  )}
                  
                  {quote.status === 'quotation_sent' && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => updateQuoteStatus('approved')}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Quote
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => updateQuoteStatus('declined')}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline Quote
                      </Button>
                    </>
                  )}

                  <Separator />
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={deleteQuote}
                    disabled={isUpdating}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Quote
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quote Submitted</p>
                        <p className="text-xs text-gray-500">
                          {new Date(quote.submitted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {quote.updated_at !== quote.submitted_at && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-xs text-gray-500">
                            {new Date(quote.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quote Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quote ID:</span>
                      <span className="font-mono text-xs">{quote.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Venue:</span>
                      <span className="text-right">{quote.venue_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service:</span>
                      <span>{formatServiceType(quote.service_type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="capitalize">{quote.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuoteDetailPage;
