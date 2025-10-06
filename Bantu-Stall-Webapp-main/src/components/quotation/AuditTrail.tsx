import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Search, Filter, Calendar, User, 
  FileText, Eye, Edit, Send, Download, 
  Clock, AlertTriangle, CheckCircle, XCircle,
  MapPin, Globe, Smartphone, Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Types
interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface AuditFilters {
  action: string;
  resource: string;
  user: string;
  dateRange: string;
  search: string;
}

const AUDIT_ACTIONS = [
  'create', 'update', 'delete', 'view', 'send', 'approve', 
  'reject', 'download', 'export', 'login', 'logout'
];

const AUDIT_RESOURCES = [
  'quotation', 'client', 'user', 'setting', 'report', 'template'
];

export const AuditTrail: React.FC = () => {
  const { user } = useAuth();
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    action: '',
    resource: '',
    user: '',
    dateRange: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 20;

  // Load audit logs on mount
  useEffect(() => {
    loadAuditLogs();
  }, [currentPage]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [auditLogs, filters]);

  const loadAuditLogs = async () => {
    try {
      setIsLoading(true);
      
      const startIndex = (currentPage - 1) * logsPerPage;
      const endIndex = startIndex + logsPerPage - 1;

      const { data, error, count } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!audit_logs_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      if (error) throw error;

      const formattedLogs: AuditLog[] = data?.map((log: any) => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        resource: log.resource,
        resource_id: log.resource_id,
        details: log.details || {},
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        created_at: log.created_at,
        user_email: log.profiles?.email,
        user_name: log.profiles ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() : 'System'
      })) || [];

      setAuditLogs(formattedLogs);
      setTotalPages(Math.ceil((count || 0) / logsPerPage));
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = auditLogs;

    // Filter by action
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Filter by resource
    if (filters.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }

    // Filter by user
    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user_email?.toLowerCase().includes(filters.user.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
      }

      if (filters.dateRange !== '') {
        filtered = filtered.filter(log => new Date(log.created_at) >= startDate);
      }
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm) ||
        log.resource.toLowerCase().includes(searchTerm) ||
        log.resource_id.toLowerCase().includes(searchTerm) ||
        log.user_email?.toLowerCase().includes(searchTerm) ||
        log.user_name?.toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.details).toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLogs(filtered);
  };

  const exportAuditLogs = async () => {
    try {
      const csvHeaders = [
        'Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 
        'IP Address', 'User Agent', 'Details'
      ];

      const csvData = filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.user_name || log.user_email || 'System',
        log.action,
        log.resource,
        log.resource_id,
        log.ip_address || 'N/A',
        log.user_agent || 'N/A',
        JSON.stringify(log.details)
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error('Failed to export audit logs');
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'update': return <Edit className="h-4 w-4 text-blue-600" />;
      case 'delete': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'view': return <Eye className="h-4 w-4 text-gray-600" />;
      case 'send': return <Send className="h-4 w-4 text-purple-600" />;
      case 'approve': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'download': return <Download className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const colorMap = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      view: 'bg-gray-100 text-gray-800',
      send: 'bg-purple-100 text-purple-800',
      approve: 'bg-green-100 text-green-800',
      reject: 'bg-red-100 text-red-800',
      download: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colorMap[action as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        {action.toUpperCase()}
      </Badge>
    );
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    
    return <Monitor className="h-4 w-4" />;
  };

  const formatDetails = (details: any) => {
    if (!details || Object.keys(details).length === 0) return 'No additional details';
    
    return Object.entries(details).map(([key, value]) => (
      <div key={key} className="text-xs">
        <span className="font-medium">{key}:</span> {JSON.stringify(value)}
      </div>
    ));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-muted-foreground">
            Comprehensive logging of all system activities and user actions
          </p>
        </div>
        <Button onClick={exportAuditLogs} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Action</label>
              <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  {AUDIT_ACTIONS.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Resource</label>
              <Select value={filters.resource} onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All resources</SelectItem>
                  {AUDIT_RESOURCES.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource.charAt(0).toUpperCase() + resource.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">User</label>
              <Input
                placeholder="Filter by user..."
                value={filters.user}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All time</SelectItem>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setFilters({ action: '', resource: '', user: '', dateRange: '', search: '' })}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(filteredLogs.map(log => log.user_id).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {filteredLogs.filter(log => log.action === 'create').length}
                </p>
                <p className="text-sm text-muted-foreground">Created Items</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(filteredLogs.map(log => log.ip_address).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Unique IPs</p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log ({filteredLogs.length} events)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Audit Logs Found</h3>
              <p className="text-muted-foreground">
                No activity matches your current filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getActionBadge(log.action)}
                          <span className="font-medium">
                            {log.resource.charAt(0).toUpperCase() + log.resource.slice(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ID: {log.resource_id.slice(0, 8)}...
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {log.user_name || log.user_email || 'System'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                            
                            {log.ip_address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{log.ip_address}</span>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            {log.user_agent && (
                              <div className="flex items-center gap-2 mb-1">
                                {getDeviceIcon(log.user_agent)}
                                <span className="truncate">
                                  {log.user_agent.split(' ')[0]} Browser
                                </span>
                              </div>
                            )}
                            
                            <div className="mt-2">
                              <div className="text-xs text-muted-foreground">
                                {formatDetails(log.details)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};