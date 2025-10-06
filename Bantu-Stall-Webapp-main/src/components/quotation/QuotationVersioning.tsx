import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  History, GitBranch, Eye, Download, Copy, 
  ArrowRight, Calendar, User, FileText, 
  GitCompare as Compare, RotateCcw as Restore, AlertTriangle, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Types
interface QuotationVersion {
  id: string;
  quotation_id: string;
  version_number: number;
  title: string;
  description?: string;
  data: any;
  created_by: string;
  created_at: string;
  is_current: boolean;
  change_summary: string[];
}

interface VersionComparison {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'removed' | 'modified';
}

export const QuotationVersioning: React.FC = () => {
  const { user } = useAuth();
  
  const [quotations, setQuotations] = useState<any[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<string>('');
  const [versions, setVersions] = useState<QuotationVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [comparison, setComparison] = useState<VersionComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');

  // Load quotations on mount
  useEffect(() => {
    loadQuotations();
  }, []);

  // Load versions when quotation is selected
  useEffect(() => {
    if (selectedQuotation) {
      loadVersions(selectedQuotation);
    }
  }, [selectedQuotation]);

  const loadQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('id, quote_reference, company_name, contact_name')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
      toast.error('Failed to load quotations');
    }
  };

  const loadVersions = async (quotationId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('quotation_versions')
        .select(`
          *,
          profiles!quotation_versions_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('quotation_id', quotationId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      const formattedVersions: QuotationVersion[] = data?.map((item: any) => ({
        id: item.id,
        quotation_id: item.quotation_id,
        version_number: item.version_number,
        title: item.title,
        description: item.description,
        data: item.data,
        created_by: item.created_by,
        created_at: item.created_at,
        is_current: item.is_current,
        change_summary: item.change_summary || []
      })) || [];

      setVersions(formattedVersions);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load versions');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewVersion = async () => {
    if (!selectedQuotation || !newVersionTitle.trim()) {
      toast.error('Please select a quotation and provide a version title');
      return;
    }

    try {
      // Get current quotation data
      const { data: currentData, error: fetchError } = await supabase
        .from('quotation_requests')
        .select('*')
        .eq('id', selectedQuotation)
        .single();

      if (fetchError) throw fetchError;

      // Get next version number
      const nextVersion = versions.length > 0 ? Math.max(...versions.map(v => v.version_number)) + 1 : 1;

      // Create version record
      const { error: insertError } = await (supabase as any)
        .from('quotation_versions')
        .insert([{
          quotation_id: selectedQuotation,
          version_number: nextVersion,
          title: newVersionTitle.trim(),
          description: newVersionDescription.trim() || null,
          data: currentData,
          created_by: user?.id,
          is_current: true,
          change_summary: generateChangeSummary(versions[0]?.data, currentData)
        }]);

      if (insertError) throw insertError;

      // Mark other versions as not current
      const { error: updateError } = await (supabase as any)
        .from('quotation_versions')
        .update({ is_current: false })
        .eq('quotation_id', selectedQuotation)
        .neq('version_number', nextVersion);

      if (updateError) throw updateError;

      toast.success('New version created successfully');
      setNewVersionTitle('');
      setNewVersionDescription('');
      loadVersions(selectedQuotation);
    } catch (error) {
      console.error('Error creating version:', error);
      toast.error('Failed to create version');
    }
  };

  const restoreVersion = async (version: QuotationVersion) => {
    try {
      // Update quotation with version data
      const { error: updateError } = await supabase
        .from('quotation_requests')
        .update({
          ...version.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuotation);

      if (updateError) throw updateError;

      // Mark this version as current
      const { error: versionError } = await (supabase as any)
        .from('quotation_versions')
        .update({ is_current: false })
        .eq('quotation_id', selectedQuotation);

      if (versionError) throw versionError;

      const { error: currentError } = await (supabase as any)
        .from('quotation_versions')
        .update({ is_current: true })
        .eq('id', version.id);

      if (currentError) throw currentError;

      toast.success(`Restored to version ${version.version_number}`);
      loadVersions(selectedQuotation);
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    }
  };

  const compareVersions = () => {
    if (selectedVersions.length !== 2) {
      toast.error('Please select exactly 2 versions to compare');
      return;
    }

    const version1 = versions.find(v => v.id === selectedVersions[0]);
    const version2 = versions.find(v => v.id === selectedVersions[1]);

    if (!version1 || !version2) return;

    const comparisons = generateComparison(version1.data, version2.data);
    setComparison(comparisons);
  };

  const generateChangeSummary = (oldData: any, newData: any): string[] => {
    if (!oldData) return ['Initial version'];

    const changes: string[] = [];
    
    // Compare key fields
    const fieldsToCompare = [
      'total_amount', 'attendee_count', 'event_duration', 
      'selected_services', 'budget_range', 'special_requirements'
    ];

    fieldsToCompare.forEach(field => {
      if (oldData[field] !== newData[field]) {
        changes.push(`Modified ${field.replace('_', ' ')}`);
      }
    });

    return changes.length > 0 ? changes : ['Minor updates'];
  };

  const generateComparison = (data1: any, data2: any): VersionComparison[] => {
    const comparisons: VersionComparison[] = [];
    const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);

    allKeys.forEach(key => {
      const value1 = data1[key];
      const value2 = data2[key];

      if (value1 !== value2) {
        let changeType: 'added' | 'removed' | 'modified' = 'modified';
        
        if (value1 === undefined) changeType = 'added';
        else if (value2 === undefined) changeType = 'removed';

        comparisons.push({
          field: key.replace('_', ' ').toUpperCase(),
          oldValue: value1,
          newValue: value2,
          changeType
        });
      }
    });

    return comparisons;
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'added': return 'text-green-600 bg-green-50';
      case 'removed': return 'text-red-600 bg-red-50';
      case 'modified': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Document Versioning</h2>
        <p className="text-muted-foreground">
          Track changes, compare versions, and restore previous states of your quotations
        </p>
      </div>

      {/* Quotation Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Quotation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedQuotation} onValueChange={setSelectedQuotation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a quotation to view versions..." />
            </SelectTrigger>
            <SelectContent>
              {quotations.map((quotation) => (
                <SelectItem key={quotation.id} value={quotation.id}>
                  {quotation.quote_reference || `QUO-${quotation.id.slice(0, 8)}`} - {quotation.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedQuotation && (
        <>
          {/* Create New Version */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Create New Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Version Title</label>
                  <Input
                    placeholder="e.g., Updated pricing, Added services..."
                    value={newVersionTitle}
                    onChange={(e) => setNewVersionTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Describe the changes made in this version..."
                    value={newVersionDescription}
                    onChange={(e) => setNewVersionDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <Button onClick={createNewVersion} className="mt-4">
                <GitBranch className="mr-2 h-4 w-4" />
                Create Version
              </Button>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Version History ({versions.length})
                </CardTitle>
                {selectedVersions.length === 2 && (
                  <Button onClick={compareVersions} variant="outline">
                    <Compare className="mr-2 h-4 w-4" />
                    Compare Selected
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Versions Found</h3>
                  <p className="text-muted-foreground">
                    Create your first version to start tracking changes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        version.is_current ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedVersions.includes(version.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedVersions.length < 2) {
                                  setSelectedVersions([...selectedVersions, version.id]);
                                }
                              } else {
                                setSelectedVersions(selectedVersions.filter(id => id !== version.id));
                              }
                            }}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">
                                Version {version.version_number}: {version.title}
                              </h4>
                              {version.is_current && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Current
                                </Badge>
                              )}
                            </div>
                            
                            {version.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {version.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(version.created_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                System User
                              </div>
                            </div>
                            
                            {version.change_summary.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {version.change_summary.map((change, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {change}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                          {!version.is_current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreVersion(version)}
                            >
                              <Restore className="mr-2 h-4 w-4" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version Comparison */}
          {comparison.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compare className="h-5 w-5" />
                  Version Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparison.map((diff, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{diff.field}</h4>
                        <Badge className={getChangeTypeColor(diff.changeType)}>
                          {diff.changeType}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded border">
                          <label className="text-sm font-medium text-red-700">Before</label>
                          <p className="text-sm">{JSON.stringify(diff.oldValue) || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded border">
                          <label className="text-sm font-medium text-green-700">After</label>
                          <p className="text-sm">{JSON.stringify(diff.newValue) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setComparison([])}
                  className="mt-4"
                >
                  Close Comparison
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};