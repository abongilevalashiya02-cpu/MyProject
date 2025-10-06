import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, Download, MessageSquare, CheckCircle, Clock, 
  AlertTriangle, Star, Calendar, DollarSign, FileText,
  Mail, Phone, Building, Users, MapPin, Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useQuotationApi } from '@/hooks/useApiClient';
import { supabase } from '@/integrations/supabase/client';

// Types
interface CustomerQuotation {
  id: string;
  quote_reference: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  quote_valid_until: string;
  attendee_count?: number;
  event_duration?: number;
  event_objectives: string[];
  selected_services: string[];
}

interface CustomerFeedback {
  id: string;
  quotation_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

export const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const { generatePdf } = useQuotationApi();
  
  const [quotations, setQuotations] = useState<CustomerQuotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<CustomerQuotation | null>(null);
  const [feedback, setFeedback] = useState({ rating: 0, comments: '' });
  const [customerMessage, setCustomerMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load customer quotations
  useEffect(() => {
    if (user) {
      loadCustomerQuotations();
    }
  }, [user]);

  const loadCustomerQuotations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptQuotation = async (quotation: CustomerQuotation) => {
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', quotation.id);

      if (error) throw error;

      // Send acceptance notification
      await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quotation_accepted',
          quotation_id: quotation.id,
          customer_name: quotation.contact_name,
          customer_email: quotation.contact_email
        }
      });

      toast.success('Quotation accepted successfully!');
      loadCustomerQuotations();
    } catch (error) {
      console.error('Error accepting quotation:', error);
      toast.error('Failed to accept quotation');
    }
  };

  const handleDeclineQuotation = async (quotation: CustomerQuotation) => {
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('id', quotation.id);

      if (error) throw error;

      // Send decline notification
      await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quotation_declined',
          quotation_id: quotation.id,
          customer_name: quotation.contact_name,
          customer_email: quotation.contact_email,
          reason: customerMessage
        }
      });

      toast.success('Quotation declined');
      setCustomerMessage('');
      loadCustomerQuotations();
    } catch (error) {
      console.error('Error declining quotation:', error);
      toast.error('Failed to decline quotation');
    }
  };

  const handleDownloadPDF = async (quotation: CustomerQuotation) => {
    try {
      const { data, error } = await generatePdf(quotation.id);
      
      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${quotation.quote_reference || quotation.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedQuotation || feedback.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await (supabase as any)
        .from('customer_feedback')
        .insert([{
          quotation_id: selectedQuotation.id,
          customer_id: user?.id,
          rating: feedback.rating,
          comments: feedback.comments.trim() || null
        }]);

      if (error) throw error;

      toast.success('Feedback submitted successfully');
      setFeedback({ rating: 0, comments: '' });
      setSelectedQuotation(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      reviewing: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      quoted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      declined: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'ZAR') => {
    const currencyMap = {
      ZAR: 'R',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    
    const symbol = currencyMap[currency as keyof typeof currencyMap] || 'R';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const isQuotationExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Customer Portal</h2>
        <p className="text-muted-foreground">
          View and manage your quotations, provide feedback, and track progress
        </p>
      </div>

      {/* Quotations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotations.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Quotations Found</h3>
                  <p className="text-muted-foreground">
                    Your quotation requests will appear here once submitted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          quotations.map((quotation) => (
            <motion.div
              key={quotation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {quotation.quote_reference || `QUO-${quotation.id.slice(0, 8)}`}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {quotation.company_name}
                      </p>
                    </div>
                    {getStatusBadge(quotation.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Quote Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {formatCurrency(quotation.total_amount || 0, quotation.currency)}
                      </span>
                    </div>
                    
                    {quotation.attendee_count && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.attendee_count} attendees</span>
                      </div>
                    )}
                    
                    {quotation.event_duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.event_duration} days</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Created: {new Date(quotation.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Validity Warning */}
                  {quotation.quote_valid_until && isQuotationExpired(quotation.quote_valid_until) && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This quotation expired on {new Date(quotation.quote_valid_until).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(quotation)}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    
                    {quotation.status === 'quoted' && !isQuotationExpired(quotation.quote_valid_until) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptQuotation(quotation)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclineQuotation(quotation)}
                          className="flex-1"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {quotation.status === 'accepted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuotation(quotation)}
                        className="w-full"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Leave Feedback
                      </Button>
                    )}
                  </div>

                  {/* Services Preview */}
                  {quotation.selected_services?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Selected Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {quotation.selected_services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {quotation.selected_services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{quotation.selected_services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Decline Message Modal */}
      {customerMessage !== undefined && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Decline Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Please let us know why you're declining this quotation (optional)..."
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCustomerMessage('')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedQuotation && handleDeclineQuotation(selectedQuotation)}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Modal */}
      {selectedQuotation && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Leave Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= feedback.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Comments</label>
                <Textarea
                  placeholder="Share your experience with our service..."
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedQuotation(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || feedback.rating === 0}
                  className="flex-1"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};