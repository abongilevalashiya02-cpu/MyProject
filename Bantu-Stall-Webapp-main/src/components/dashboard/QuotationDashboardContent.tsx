import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FileText, Plus, Search, Filter, Calendar, 
  DollarSign, CheckCircle, Clock, AlertCircle, 
  Eye, Edit, Share, Trash2, Download, MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const QuotationDashboardContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [quotationStats, setQuotationStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    quoted: 0,
    totalValue: 0
  });

  // Fetch quotations from database
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotation_requests')
        .select(`
          *,
          quotation_request_line_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotations(data || []);
      
      // Calculate stats
      const stats = {
        total: data?.length || 0,
        draft: data?.filter(q => q.status === 'draft').length || 0,
        submitted: data?.filter(q => q.status === 'submitted').length || 0,
        quoted: data?.filter(q => q.status === 'quoted').length || 0,
        totalValue: data?.reduce((sum, q) => sum + (q.total_amount || 0), 0) || 0
      };
      setQuotationStats(stats);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('quotation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotation_requests'
        },
        () => {
          fetchQuotations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleView = (quotation: any) => {
    navigate(`/quotations/${quotation.id}`);
  };

  const handleEdit = (quotation: any) => {
    navigate(`/quotations/${quotation.id}/edit`);
  };

  const handleShare = async (quotation: any) => {
    try {
      // Generate shareable link or send email
      const { data, error } = await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quote_share',
          quotation_id: quotation.id,
          quote_data: quotation
        }
      });

      if (error) throw error;

      toast.success('Quotation shared successfully!');
    } catch (error) {
      console.error('Error sharing quotation:', error);
      toast.error('Failed to share quotation');
    }
  };

  const handleDelete = async (quotation: any) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .delete()
        .eq('id', quotation.id);

      if (error) throw error;
      
      toast.success('Quotation deleted successfully');
      fetchQuotations(); // Refresh list
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast.error('Failed to delete quotation');
    }
  };

  const handleDownload = async (quotation: any) => {
    try {
      // Call edge function to generate and download PDF
      const { data, error } = await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quote_download',
          quotation_id: quotation.id,
          quote_data: quotation
        }
      });

      if (error) throw error;

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${quotation.quote_reference || quotation.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Quotation downloaded successfully!');
    } catch (error) {
      console.error('Error downloading quotation:', error);
      toast.error('Failed to download quotation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quoted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'quoted':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'ZAR') => {
    const symbols = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[currency as keyof typeof symbols] || 'R';
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesTab = activeTab === 'all' || quote.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      quote.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.quote_reference?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const statsCards = [
    { 
      label: 'Total Quotes', 
      value: quotationStats.total.toString(), 
      trend: `+${Math.floor(quotationStats.total * 0.2)} this month`, 
      icon: FileText 
    },
    { 
      label: 'Submitted', 
      value: quotationStats.submitted.toString(), 
      trend: `+${Math.floor(quotationStats.submitted * 0.3)} pending`, 
      icon: Clock 
    },
    { 
      label: 'Quoted', 
      value: quotationStats.quoted.toString(), 
      trend: `+${Math.floor(quotationStats.quoted * 0.1)} completed`, 
      icon: CheckCircle 
    },
    { 
      label: 'Total Value', 
      value: formatCurrency(quotationStats.totalValue), 
      trend: `+${formatCurrency(quotationStats.totalValue * 0.15)} this month`, 
      icon: DollarSign 
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quotation Management</h2>
          <p className="text-muted-foreground">Create and manage service quotations</p>
        </div>
        <Button onClick={() => navigate('/quotations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
      </div>

      {/* Quotation Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => navigate('/quotations/new')}>
              <Plus className="h-6 w-6" />
              <span>Create Quote</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Quote Templates</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Search className="h-6 w-6" />
              <span>Search Quotes</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Pricing Calculator</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Quotes</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="quoted">Quoted</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search quotations..." 
                className="max-w-md" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              Export
            </Button>
          </div>
          
          <div className="space-y-4">
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(quotation.status)}
                          <h4 className="font-semibold">{quotation.quote_reference || `QUO-${quotation.id.slice(0, 8)}`}</h4>
                          <Badge variant={getStatusBadgeVariant(quotation.status)}>
                            {quotation.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div><strong>Client:</strong> {quotation.company_name}</div>
                          <div><strong>Contact:</strong> {quotation.contact_name}</div>
                          <div><strong>Attendees:</strong> {quotation.attendee_count || 'TBD'}</div>
                          <div className="flex items-center gap-4">
                            <span><strong>Created:</strong> {new Date(quotation.created_at).toLocaleDateString()}</span>
                            {quotation.quote_valid_until && (
                              <span><strong>Valid until:</strong> {new Date(quotation.quote_valid_until).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {quotation.total_amount ? formatCurrency(quotation.total_amount, quotation.currency) : 'TBD'}
                          </div>
                          <div className="text-sm text-muted-foreground">Quote Value</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(quotation)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(quotation)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(quotation)}>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(quotation)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(quotation)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No {activeTab === 'all' ? '' : activeTab} quotations found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'all' 
                      ? 'Get started by creating your first quotation'
                      : `No quotations with ${activeTab} status`
                    }
                  </p>
                  <Button onClick={() => navigate('/quotations/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Quotation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quotations.slice(0, 3).map((quotation, index) => (
              <div key={quotation.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {getStatusIcon(quotation.status)}
                <div className="flex-1">
                  <p className="font-medium">
                    {quotation.status === 'submitted' ? 'New quotation request' : 
                     quotation.status === 'quoted' ? 'Quotation sent' : 
                     'Quotation updated'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {quotation.company_name} - {quotation.contact_name}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(quotation.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {quotations.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationDashboardContent;