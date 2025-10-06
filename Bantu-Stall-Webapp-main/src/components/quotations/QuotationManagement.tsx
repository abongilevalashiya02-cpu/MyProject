import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Send
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface Quotation {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  valid_until: string;
  destination: string;
  travel_dates: string;
  guest_count: number;
  quotation_type: 'accommodation' | 'transport' | 'activity' | 'package' | 'custom';
  service_provider?: {
    name: string;
    company: string;
  };
}

const QuotationManagement: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Partial<Quotation>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock data with realistic quotations
      const mockQuotations: Quotation[] = [
        {
          id: '1',
          title: 'Safari Lodge Package - Kruger National Park',
          description: 'Luxury safari experience with accommodation, meals, and game drives',
          status: 'approved',
          total_amount: 3500,
          currency: 'USD',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-16T14:30:00Z',
          valid_until: '2025-02-15T23:59:59Z',
          destination: 'Kruger National Park, South Africa',
          travel_dates: '2025-03-15 to 2025-03-20',
          guest_count: 4,
          quotation_type: 'package',
          service_provider: {
            name: 'John Safari',
            company: 'African Safari Adventures'
          }
        },
        {
          id: '2',
          title: 'Victoria Falls Adventure Tour',
          description: 'Helicopter tour, white water rafting, and luxury accommodation',
          status: 'pending',
          total_amount: 2800,
          currency: 'USD',
          created_at: '2025-01-10T09:00:00Z',
          updated_at: '2025-01-10T09:00:00Z',
          valid_until: '2025-02-10T23:59:59Z',
          destination: 'Victoria Falls, Zimbabwe',
          travel_dates: '2025-04-01 to 2025-04-05',
          guest_count: 2,
          quotation_type: 'activity',
          service_provider: {
            name: 'Sarah Tourism',
            company: 'Falls Adventure Co.'
          }
        },
        {
          id: '3',
          title: 'Cape Town Wine Tour',
          description: 'Premium wine tasting tour with luxury transport',
          status: 'rejected',
          total_amount: 1200,
          currency: 'USD',
          created_at: '2025-01-05T15:00:00Z',
          updated_at: '2025-01-08T11:00:00Z',
          valid_until: '2025-01-20T23:59:59Z',
          destination: 'Cape Town, South Africa',
          travel_dates: '2025-02-20 to 2025-02-22',
          guest_count: 6,
          quotation_type: 'activity',
          service_provider: {
            name: 'David Wine',
            company: 'Cape Wine Experiences'
          }
        },
        {
          id: '4',
          title: 'Zanzibar Beach Resort',
          description: 'All-inclusive beach resort with water sports',
          status: 'expired',
          total_amount: 4200,
          currency: 'USD',
          created_at: '2024-12-20T12:00:00Z',
          updated_at: '2024-12-20T12:00:00Z',
          valid_until: '2025-01-05T23:59:59Z',
          destination: 'Zanzibar, Tanzania',
          travel_dates: '2025-02-10 to 2025-02-17',
          guest_count: 8,
          quotation_type: 'accommodation',
          service_provider: {
            name: 'Ocean Resort',
            company: 'Zanzibar Beach Hotels'
          }
        }
      ];

      setQuotations(mockQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast({
        title: "Error",
        description: "Failed to load quotations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchQuotations();
    }
  }, [user, fetchQuotations]);

  const handleDeleteQuotation = async (quotationId: string) => {
    try {
      // In real implementation, this would call the API
      setQuotations(prev => prev.filter(q => q.id !== quotationId));
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  const handleEditQuotation = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      // In real implementation, this would call the API
      setQuotations(prev => 
        prev.map(q => q.id === editingQuotation.id ? { ...q, ...editingQuotation } : q)
      );
      setIsEditModalOpen(false);
      setEditingQuotation({});
      toast({
        title: "Success",
        description: "Quotation updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quotation",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    const matchesType = typeFilter === 'all' || quotation.quotation_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
          <p className="text-gray-600">Track and manage your travel quotations</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Quotation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">
              {quotations.filter(q => q.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {quotations.filter(q => q.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              ${quotations.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.total_amount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {quotations.filter(q => q.status === 'expired').length}
            </p>
            <p className="text-sm text-gray-600">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="package">Package</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      <div className="space-y-4">
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {quotations.length === 0 ? "No quotations yet" : "No quotations match your filters"}
              </h3>
              <p className="text-gray-600 mb-4">
                {quotations.length === 0 
                  ? "Request your first quotation to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{quotation.title}</h3>
                      <Badge className={`ml-2 ${getStatusColor(quotation.status)} flex items-center gap-1`}>
                        {getStatusIcon(quotation.status)}
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{quotation.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {quotation.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {quotation.travel_dates}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quotation.guest_count} guests
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {quotation.currency} {quotation.total_amount.toLocaleString()}
                      </div>
                    </div>
                    
                    {quotation.service_provider && (
                      <div className="mt-2 text-sm text-gray-600">
                        Provider: {quotation.service_provider.name} ({quotation.service_provider.company})
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Valid until: {format(new Date(quotation.valid_until), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuotation(quotation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {quotation.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuotation(quotation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {quotation.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteQuotation(quotation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingQuotation.title || ''}
                onChange={(e) => setEditingQuotation(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingQuotation.description || ''}
                onChange={(e) => setEditingQuotation(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-destination">Destination</Label>
                <Input
                  id="edit-destination"
                  value={editingQuotation.destination || ''}
                  onChange={(e) => setEditingQuotation(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-guests">Guest Count</Label>
                <Input
                  id="edit-guests"
                  type="number"
                  value={editingQuotation.guest_count || ''}
                  onChange={(e) => setEditingQuotation(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-bantu-orange hover:bg-bantu-orange/90">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationManagement;
