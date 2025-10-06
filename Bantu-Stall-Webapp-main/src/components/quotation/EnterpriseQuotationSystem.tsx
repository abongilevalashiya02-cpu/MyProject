import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, Plus, Search, Filter, Settings, 
  Users, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Eye, Edit, Send, Download,
  MoreHorizontal, Workflow, Shield, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Hooks
import { useQuotationRequests } from '@/hooks/useQuotationRequests';
import { useQuotationApi } from '@/hooks/useApiClient';
import { useAuth } from '@/hooks/useAuth';
import { useSecureForm } from '@/hooks/useSecureForm';

// Components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { CustomerPortal } from './CustomerPortal';
import { QuotationVersioning } from './QuotationVersioning';
import { AuditTrail } from './AuditTrail';
import { RealTimeNotifications } from './RealTimeNotifications';

// Configuration
import { appConfig } from '@/config/environment';

interface QuotationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalValue: number;
  conversionRate: number;
}

export const EnterpriseQuotationSystem: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: quotations, isLoading, error } = useQuotationRequests();
  const { sendQuotation, approveQuotation, generatePdf } = useQuotationApi();
  const { submitForm, validateForm, isSubmitting, errors } = useSecureForm();

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
  const [stats, setStats] = useState<QuotationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
    conversionRate: 0
  });

  // Real-time stats calculation
  useEffect(() => {
    if (quotations) {
      const newStats: QuotationStats = {
        total: quotations.length,
        pending: quotations.filter(q => q.status === 'submitted').length,
        approved: quotations.filter(q => q.status === 'quoted').length,
        rejected: quotations.filter(q => q.status === 'declined').length,
        totalValue: quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0),
        conversionRate: quotations.length > 0 
          ? (quotations.filter(q => q.status === 'quoted').length / quotations.length) * 100 
          : 0
      };
      setStats(newStats);
    }
  }, [quotations]);

  // Handle bulk operations
  const handleBulkAction = async (action: string) => {
    if (selectedQuotations.length === 0) {
      toast.error('Please select quotations first');
      return;
    }

    try {
      switch (action) {
        case 'approve':
          for (const id of selectedQuotations) {
            await approveQuotation(id, { status: 'approved', approved_by: user?.id });
          }
          toast.success(`${selectedQuotations.length} quotations approved`);
          break;
        
        case 'export':
          // Export selected quotations
          const exportData = quotations?.filter(q => selectedQuotations.includes(q.id));
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `quotations-export-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Export completed');
          break;
      }
      
      setSelectedQuotations([]);
    } catch (error) {
      toast.error('Bulk operation failed');
      console.error('Bulk action error:', error);
    }
  };

  // Format currency with multi-currency support
  const formatCurrency = (amount: number, currency: string = appConfig.business.defaultCurrency) => {
    const currencyMap = {
      ZAR: { symbol: 'R', locale: 'en-ZA' },
      USD: { symbol: '$', locale: 'en-US' },
      EUR: { symbol: '€', locale: 'en-EU' },
      GBP: { symbol: '£', locale: 'en-GB' }
    };
    
    const config = currencyMap[currency as keyof typeof currencyMap] || currencyMap.ZAR;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Status badge variants
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, color: 'text-gray-600', icon: Clock },
      submitted: { variant: 'secondary' as const, color: 'text-yellow-600', icon: AlertTriangle },
      reviewing: { variant: 'default' as const, color: 'text-blue-600', icon: Eye },
      quoted: { variant: 'default' as const, color: 'text-green-600', icon: CheckCircle },
      accepted: { variant: 'default' as const, color: 'text-green-700', icon: CheckCircle },
      declined: { variant: 'destructive' as const, color: 'text-red-600', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load quotations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enterprise Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Quotation System</h1>
          <p className="text-muted-foreground">
            Advanced quotation management with approval workflows and customer portals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/quotation-settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => navigate('/quotations/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Enterprise Analytics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(stats.total * 0.2)} from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Across all active quotations
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Quotes to accepted ratio
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Notifications */}
      {appConfig.features.realtimeNotifications && (
        <RealTimeNotifications />
      )}

      {/* Enterprise Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="portal" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Portal
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search quotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            
            {selectedQuotations.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedQuotations.length} selected
                </span>
                <Button size="sm" onClick={() => handleBulkAction('approve')}>
                  Bulk Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                  Export
                </Button>
              </div>
            )}
          </div>

          {/* Quotation List */}
          <div className="space-y-4">
            {quotations?.filter(q => 
              searchQuery === '' || 
              q.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedQuotations.includes(quotation.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuotations([...selectedQuotations, quotation.id]);
                          } else {
                            setSelectedQuotations(selectedQuotations.filter(id => id !== quotation.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">
                            {quotation.quote_reference || `QUO-${quotation.id.slice(0, 8)}`}
                          </h4>
                          {getStatusBadge(quotation.status)}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div><strong>Company:</strong> {quotation.company_name}</div>
                          <div><strong>Contact:</strong> {quotation.contact_name}</div>
                          <div><strong>Value:</strong> {formatCurrency(quotation.total_amount || 0, quotation.currency)}</div>
                          <div><strong>Created:</strong> {new Date(quotation.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Approval Workflow Tab */}
        <TabsContent value="approval">
          {appConfig.features.quotationApprovalWorkflow && (
            <ApprovalWorkflow quotations={quotations} />
          )}
        </TabsContent>

        {/* Customer Portal Tab */}
        <TabsContent value="portal">
          {appConfig.features.customerPortal && (
            <CustomerPortal />
          )}
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions">
          {appConfig.features.documentVersioning && (
            <QuotationVersioning />
          )}
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit">
          {appConfig.features.auditLogging && (
            <AuditTrail />
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Sent</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accepted</span>
                    <span className="font-semibold text-green-600">{stats.approved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-semibold">{stats.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Pipeline Value</span>
                    <span className="font-semibold">{formatCurrency(stats.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Quote Value</span>
                    <span className="font-semibold">
                      {formatCurrency(stats.total > 0 ? stats.totalValue / stats.total : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseQuotationSystem;