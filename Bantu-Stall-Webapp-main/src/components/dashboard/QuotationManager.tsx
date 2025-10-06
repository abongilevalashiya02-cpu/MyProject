import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  RefreshCw,
  Bell,
  MessageSquare,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { QuotationRequest } from '@/types/retreats';

interface QuotationManagerProps {
  onNavigateToMusika: () => void;
}

const QuotationManager: React.FC<QuotationManagerProps> = ({ onNavigateToMusika }) => {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [editingQuotation, setEditingQuotation] = useState<QuotationRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<QuotationRequest | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuotations = useCallback(async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          clients!inner(name, email)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setQuotations(data as any[]);
      toast({
        title: "Quotations loaded",
        description: `Found ${data?.length || 0} quotation requests`,
      });
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast({
        title: "Error",
        description: "Failed to load quotations",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [user, toast]);

  const setupRealTimeSubscription = useCallback(() => {
    const channel = supabase
      .channel('quotation_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'quotations',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          // Handle real-time quotation updates
          
          if (payload.eventType === 'INSERT') {
            setRealTimeUpdates(prev => [...prev, `New quotation request created for ${payload.new.venue_name}`]);
            fetchQuotations(); // Refresh data
          } else if (payload.eventType === 'UPDATE') {
            setRealTimeUpdates(prev => [...prev, `Quotation for ${payload.new.venue_name} has been updated`]);
            fetchQuotations(); // Refresh data
          } else if (payload.eventType === 'DELETE') {
            setRealTimeUpdates(prev => [...prev, `Quotation request has been removed`]);
            fetchQuotations(); // Refresh data
          }
          
          // Clear notification after 5 seconds
          setTimeout(() => {
            setRealTimeUpdates(prev => prev.slice(1));
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchQuotations]);

  useEffect(() => {
    if (user) {
      fetchQuotations();
      setupRealTimeSubscription();
    }
    return () => {
      // Cleanup subscription on unmount
      supabase.removeAllChannels();
    };
  }, [user, fetchQuotations, setupRealTimeSubscription]);

  const filterQuotations = useCallback(() => {
    let filtered = quotations;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.retreat_goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    setFilteredQuotations(filtered);
  }, [quotations, searchTerm, statusFilter]);

  useEffect(() => {
    filterQuotations();
  }, [filterQuotations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'quotation_sent': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_review': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'declined': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'quotation_sent': return <MessageSquare className="h-3 w-3" />;
      case 'in_review': return <Eye className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'declined': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleEditQuotation = async (updatedQuotation: Partial<QuotationRequest>) => {
    if (!editingQuotation) return;

    try {
      const { error } = await supabase
        .from('quotations')
        .update({
          status: 'draft'
        })
        .eq('id', editingQuotation.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quotation updated successfully",
      });

      setEditingQuotation(null);
      fetchQuotations();
    } catch (error) {
      console.error('Error updating quotation:', error);
      toast({
        title: "Error",
        description: "Failed to update quotation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuotation = async () => {
    if (!quotationToDelete) return;

    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', quotationToDelete.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });

      setDeleteDialogOpen(false);
      setQuotationToDelete(null);
      fetchQuotations();
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  const getQuotationStats = () => {
    const total = quotations.length;
    const pending = quotations.filter(q => q.status === 'pending').length;
    const approved = quotations.filter(q => q.status === 'approved').length;
    const inReview = quotations.filter(q => q.status === 'in_review').length;
    
    return { total, pending, approved, inReview };
  };

  const stats = getQuotationStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Notifications */}
      {realTimeUpdates.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {realTimeUpdates.map((update, index) => (
            <Card key={index} className="bg-green-50 border-green-200 shadow-lg">
              <CardContent className="p-3 flex items-center space-x-2">
                <Bell className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800">{update}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotation Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all your venue quotation requests</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => {
              setRefreshing(true);
              fetchQuotations();
            }}
            disabled={refreshing}
            className="border-gray-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={onNavigateToMusika}
            className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Browse Venues
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.inReview}</div>
            <div className="text-sm text-gray-600">In Review</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by venue name, goal, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quotation_sent">Quotation Sent</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {filteredQuotations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {quotations.length === 0 ? "No quotations yet" : "No quotations match your filters"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {quotations.length === 0 
                    ? "Start by browsing venues and requesting quotations"
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
                {quotations.length === 0 && (
                  <Button 
                    onClick={onNavigateToMusika}
                    className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
                  >
                    Browse Venues
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuotations.map((quotation) => (
                <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {quotation.venue_name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{quotation.retreat_goal}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{quotation.attendee_count} attendees</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{quotation.preferred_dates}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(quotation.status)} flex items-center gap-1`}>
                            {getStatusIcon(quotation.status)}
                            <span className="capitalize">{quotation.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Contact:</strong> {quotation.contact_name} ({quotation.contact_email})</p>
                          <p><strong>Booking Type:</strong> {quotation.booking_type}</p>
                          {quotation.special_requests && (
                            <p><strong>Special Requests:</strong> {quotation.special_requests}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuotation(quotation)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingQuotation(quotation)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuotationToDelete(quotation);
                            setDeleteDialogOpen(true);
                          }}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      Submitted: {new Date(quotation.submitted_at).toLocaleDateString()} at {new Date(quotation.submitted_at).toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotations.map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{quotation.venue_name}</CardTitle>
                    <Badge className={`${getStatusColor(quotation.status)} flex items-center gap-1`}>
                      {getStatusIcon(quotation.status)}
                      <span className="capitalize">{quotation.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{quotation.retreat_goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{quotation.attendee_count} attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{quotation.preferred_dates}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuotation(quotation)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuotation(quotation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuotationToDelete(quotation);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Quotation Dialog */}
      <Dialog open={!!selectedQuotation} onOpenChange={() => setSelectedQuotation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
            <DialogDescription>
              View complete quotation request information
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Venue</Label>
                  <p className="text-sm">{selectedQuotation.venue_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`${getStatusColor(selectedQuotation.status)} mt-1`}>
                    {selectedQuotation.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Retreat Goal</Label>
                  <p className="text-sm">{selectedQuotation.retreat_goal}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Attendee Count</Label>
                  <p className="text-sm">{selectedQuotation.attendee_count}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Booking Type</Label>
                  <p className="text-sm">{selectedQuotation.booking_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Preferred Dates</Label>
                  <p className="text-sm">{selectedQuotation.preferred_dates}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Name</Label>
                  <p className="text-sm">{selectedQuotation.contact_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Email</Label>
                  <p className="text-sm">{selectedQuotation.contact_email}</p>
                </div>
              </div>
              
              {selectedQuotation.add_on_services && selectedQuotation.add_on_services.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Add-on Services</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedQuotation.add_on_services.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedQuotation.special_requests && (
                <div>
                  <Label className="text-sm font-medium">Special Requests</Label>
                  <p className="text-sm mt-1">{selectedQuotation.special_requests}</p>
                </div>
              )}
              
              <div className="pt-4 border-t text-sm text-gray-600">
                <p>Submitted: {new Date(selectedQuotation.submitted_at).toLocaleString()}</p>
                <p>Last Updated: {new Date(selectedQuotation.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Quotation Dialog */}
      <Dialog open={!!editingQuotation} onOpenChange={() => setEditingQuotation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quotation Request</DialogTitle>
            <DialogDescription>
              Update your quotation request details
            </DialogDescription>
          </DialogHeader>
          
          {editingQuotation && <EditQuotationForm quotation={editingQuotation} onSave={handleEditQuotation} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quotation Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quotation request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuotation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit Form Component
const EditQuotationForm: React.FC<{
  quotation: QuotationRequest;
  onSave: (updated: Partial<QuotationRequest>) => void;
}> = ({ quotation, onSave }) => {
  const [formData, setFormData] = useState({
    retreat_goal: quotation.retreat_goal,
    attendee_count: quotation.attendee_count,
    booking_type: quotation.booking_type,
    preferred_dates: quotation.preferred_dates,
    special_requests: quotation.special_requests || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="retreat_goal">Retreat Goal</Label>
          <Input
            id="retreat_goal"
            value={formData.retreat_goal}
            onChange={(e) => setFormData(prev => ({ ...prev, retreat_goal: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="attendee_count">Attendee Count</Label>
          <Input
            id="attendee_count"
            value={formData.attendee_count}
            onChange={(e) => setFormData(prev => ({ ...prev, attendee_count: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="booking_type">Booking Type</Label>
          <Select value={formData.booking_type} onValueChange={(value) => setFormData(prev => ({ ...prev, booking_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="half-day">Half-Day</SelectItem>
              <SelectItem value="full-day">Full-Day</SelectItem>
              <SelectItem value="overnight">Overnight</SelectItem>
              <SelectItem value="multi-day">Multi-Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preferred_dates">Preferred Dates</Label>
          <Input
            id="preferred_dates"
            value={formData.preferred_dates}
            onChange={(e) => setFormData(prev => ({ ...prev, preferred_dates: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
          rows={3}
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" className="bg-bantu-orange hover:bg-bantu-orange/90">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
};

export default QuotationManager;
