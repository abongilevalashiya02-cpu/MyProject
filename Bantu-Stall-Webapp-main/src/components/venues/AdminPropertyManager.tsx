import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Building, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock, 
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button';

interface PropertyListing {
  id: string;
  property_name: string;
  property_type: string;
  location: string;
  area: string;
  status: string;
  min_capacity: number;
  max_capacity: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  description?: string;
  media_urls?: string[];
}

const AdminPropertyManager: React.FC = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchQuery, statusFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load property listings');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.property_name.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.contact_name.toLowerCase().includes(query) ||
        listing.contact_email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  };

  const updateListingStatus = async (listingId: string, newStatus: string, notes?: string) => {
    setActionLoading(listingId);
    try {
      const { error } = await supabase
        .from('property_listings')
        .update({ 
          status: newStatus,
          ...(notes && { admin_notes: notes })
        })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus }
          : listing
      ));

      toast.success(`Property listing ${newStatus} successfully`);
      setSelectedListing(null);
      setReviewNotes('');
      
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing status');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { variant: 'default' as const, icon: Check, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: X, color: 'text-red-600' },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Property Listings Management</h1>
        <p className="text-muted-foreground">Review and manage property submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, locations, or contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings ({filteredListings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{listing.property_name}</h3>
                      {getStatusBadge(listing.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {listing.property_type}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {listing.location}, {listing.area}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Capacity: {listing.min_capacity} - {listing.max_capacity}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Submitted {new Date(listing.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {listing.contact_email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {listing.contact_phone}
                      </div>
                      <div>Contact: {listing.contact_name}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedListing(listing)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    
                    {listing.status === 'pending' && (
                      <>
                        <LoadingButton
                          size="sm"
                          onClick={() => updateListingStatus(listing.id, 'approved')}
                          loading={actionLoading === listing.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </LoadingButton>
                        <LoadingButton
                          size="sm"
                          variant="destructive"
                          onClick={() => updateListingStatus(listing.id, 'rejected')}
                          loading={actionLoading === listing.id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </LoadingButton>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No property listings have been submitted yet'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Modal/Dialog would go here */}
      {selectedListing && (
        <Card className="fixed inset-4 z-50 bg-background shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Review: {selectedListing.property_name}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedListing(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {selectedListing.description || 'No description provided'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about this listing review..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <LoadingButton
                onClick={() => updateListingStatus(selectedListing.id, 'approved', reviewNotes)}
                loading={actionLoading === selectedListing.id}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </LoadingButton>
              <LoadingButton
                variant="destructive"
                onClick={() => updateListingStatus(selectedListing.id, 'rejected', reviewNotes)}
                loading={actionLoading === selectedListing.id}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </LoadingButton>
              <Button 
                variant="outline"
                onClick={() => setSelectedListing(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPropertyManager;