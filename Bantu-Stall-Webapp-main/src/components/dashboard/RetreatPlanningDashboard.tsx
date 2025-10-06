
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MessageSquare, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { Retreat } from '@/types/retreats';
import CreateRetreatModal from './CreateRetreatModal';
import RetreatCard from './RetreatCard';
import RetreatDetailView from './RetreatDetailView';
import QuotationManager from './QuotationManager';
import MusikaDashboardWidget from './MusikaDashboardWidget';

const RetreatPlanningDashboard: React.FC = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [rfqCounts, setRfqCounts] = useState<Record<string, number>>({});
  const [quotationStats, setQuotationStats] = useState({ total: 0, pending: 0, approved: 0, inReview: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRetreat, setSelectedRetreat] = useState<Retreat | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRetreats = React.useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: retreatsData, error: retreatsError } = await supabase
        .from('retreats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (retreatsError) throw retreatsError;

      const { data: rfqData, error: rfqError } = await supabase
        .from('quotations')
        .select('id')
        .eq('user_id', user.id);

      if (rfqError) throw rfqError;

      // Get all quotations for stats
      const { data: allQuotations, error: quotationsError } = await supabase
        .from('quotations')
        .select('status')
        .eq('user_id', user.id);

      if (quotationsError) throw quotationsError;

      // Count RFQs per retreat
      const counts: Record<string, number> = {};
      rfqData?.forEach(rfq => {
        if (rfq.id) {
          counts[rfq.id] = (counts[rfq.id] || 0) + 1;
        }
      });

      // Calculate quotation stats
      const stats = {
        total: allQuotations?.length || 0,
        pending: allQuotations?.filter(q => q.status === 'pending').length || 0,
        approved: allQuotations?.filter(q => q.status === 'approved').length || 0,
        inReview: allQuotations?.filter(q => q.status === 'in_review').length || 0
      };

      // Type assertion to ensure retreats match our interface
      setRetreats((retreatsData || []) as Retreat[]);
      setRfqCounts(counts);
      setQuotationStats(stats);
    } catch (error: unknown) {
      console.error('Error fetching retreats:', error);
      toast({
        title: "Error",
        description: "Failed to load your retreats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchRetreats();
    }
  }, [user, fetchRetreats]);

  const filteredRetreats = retreats.filter(retreat => {
    const matchesSearch = retreat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retreat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || retreat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewRetreat = (retreat: Retreat) => {
    setSelectedRetreat(retreat);
  };

  const handleBackToOverview = () => {
    setSelectedRetreat(null);
    fetchRetreats(); // Refresh data when returning to overview
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-orange"></div>
      </div>
    );
  }

  // Show detailed retreat view if a retreat is selected
  if (selectedRetreat) {
    return <RetreatDetailView retreat={selectedRetreat} onBack={handleBackToOverview} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-bantu-orange via-orange-500 to-bantu-yellow relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Retreat Planning Dashboard
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Organize, track, and manage your corporate retreat plans with powerful tools
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate('/musika')}
                className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-bantu-orange backdrop-blur-sm"
              >
                Browse Venues
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-bantu-orange hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Retreat
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{retreats.length}</div>
            <div className="text-sm text-gray-600">Total Retreats</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{quotationStats.total}</div>
            <div className="text-sm text-gray-600">Quotation Requests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{quotationStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{quotationStats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Retreat Overview</TabsTrigger>
          <TabsTrigger value="quotations">Quotation Management</TabsTrigger>
          <TabsTrigger value="musika">Musika Market</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search retreats by name or description..."
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
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="quotation_review">Quotation Review</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Retreats Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Retreats</h2>
            {filteredRetreats.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {retreats.length === 0 ? "No retreats yet" : "No retreats match your filters"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {retreats.length === 0 
                      ? "Start planning your first corporate retreat experience"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {retreats.length === 0 && (
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Retreat
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRetreats.map((retreat) => (
                  <RetreatCard
                    key={retreat.id}
                    retreat={retreat}
                    rfqCount={rfqCounts[retreat.id] || 0}
                    onViewRetreat={handleViewRetreat}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Global CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 border-bantu-orange/20">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-bantu-orange mb-2">Start New RFQ</h3>
                <p className="text-sm text-gray-600 mb-3">Browse venues and request quotations</p>
                <Button 
                  variant="outline" 
                  className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10"
                  onClick={() => navigate('/musika')}
                >
                  Browse Venues
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-green-700 mb-2">Planning Support</h3>
                <p className="text-sm text-gray-600 mb-3">Book a free consultation call</p>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Book Free Call
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-purple-700 mb-2">Quotation History</h3>
                <p className="text-sm text-gray-600 mb-3">View all your quotation requests</p>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => setActiveTab('quotations')}
                >
                  View Quotations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quotations">
          <QuotationManager onNavigateToMusika={() => navigate('/musika')} />
        </TabsContent>
        
        <TabsContent value="musika">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MusikaDashboardWidget 
                onNavigateToVenue={(venueName) => {
                  if (venueName) {
                    // Navigate to specific venue (you could implement venue-specific routing)
                    navigate('/musika', { state: { searchVenue: venueName } });
                  } else {
                    navigate('/musika');
                  }
                }} 
              />
            </div>
            
            <div className="space-y-6">
              {/* Market Insights Sidebar */}
              <Card className="bg-gradient-to-br from-bantu-orange/10 to-bantu-yellow/10">
                <CardHeader>
                  <CardTitle className="text-lg">Market Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Real-time venue insights</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Live quotation activity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Popular booking times</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span>Trending venues</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
                    onClick={() => navigate('/musika')}
                  >
                    Explore Musika Marketplace
                  </Button>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">New quotation request</p>
                        <p className="text-gray-600">Glenburn Lodge - 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Venue trending up</p>
                        <p className="text-gray-600">Cradle Moon - 4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Quotation approved</p>
                        <p className="text-gray-600">Valley Lodge - 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateRetreatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRetreatCreated={fetchRetreats}
      />
      </div>
    </div>
  );
};

export default RetreatPlanningDashboard;
