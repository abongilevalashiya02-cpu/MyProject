import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, XCircle, Clock, User, MessageSquare, 
  FileText, ArrowRight, AlertTriangle, History,
  Mail, Calendar, DollarSign, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useQuotationApi } from '@/hooks/useApiClient';
import { supabase } from '@/integrations/supabase/client';

// Types
import { QuotationRequest } from '@/hooks/useQuotationRequests';

interface ApprovalWorkflowProps {
  quotations?: QuotationRequest[];
}

interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  required_role: string;
  order: number;
  auto_approve_threshold?: number;
}

interface ApprovalHistory {
  id: string;
  quotation_id: string;
  step_id: string;
  approver_id: string;
  approver_name: string;
  action: 'approved' | 'rejected' | 'requested_changes';
  comments?: string;
  created_at: string;
}

const DEFAULT_APPROVAL_STEPS: ApprovalStep[] = [
  {
    id: 'sales_review',
    name: 'Sales Review',
    description: 'Initial sales team review for completeness and accuracy',
    required_role: 'sales',
    order: 1,
    auto_approve_threshold: 50000
  },
  {
    id: 'financial_review',
    name: 'Financial Review', 
    description: 'Finance team review for pricing and profitability',
    required_role: 'finance',
    order: 2,
    auto_approve_threshold: 100000
  },
  {
    id: 'management_approval',
    name: 'Management Approval',
    description: 'Senior management approval for high-value quotations',
    required_role: 'manager',
    order: 3
  }
];

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ quotations = [] }) => {
  const { user } = useAuth();
  const { approveQuotation } = useQuotationApi();
  
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>(DEFAULT_APPROVAL_STEPS);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [currentStep, setCurrentStep] = useState<ApprovalStep | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter quotations that need approval
  const pendingQuotations = quotations.filter(q => 
    ['submitted', 'reviewing'].includes(q.status)
  );

  // Load approval history for selected quotation
  useEffect(() => {
    if (selectedQuotation) {
      loadApprovalHistory(selectedQuotation.id);
      determineCurrentStep(selectedQuotation);
    }
  }, [selectedQuotation]);

  const loadApprovalHistory = async (quotationId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('quotation_approvals')
        .select(`
          *,
          profiles!quotation_approvals_approver_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('quotation_id', quotationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory: ApprovalHistory[] = data?.map((item: any) => ({
        id: item.id,
        quotation_id: item.quotation_id,
        step_id: item.step_id,
        approver_id: item.approver_id,
        approver_name: `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''}`.trim(),
        action: item.action,
        comments: item.comments,
        created_at: item.created_at
      })) || [];

      setApprovalHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading approval history:', error);
    }
  };

  const determineCurrentStep = (quotation: QuotationRequest) => {
    // Find the next step that hasn't been completed
    const completedSteps = approvalHistory.map(h => h.step_id);
    const nextStep = approvalSteps.find(step => 
      !completedSteps.includes(step.id)
    );
    
    setCurrentStep(nextStep || null);
  };

  const handleApprovalAction = async (action: 'approved' | 'rejected' | 'requested_changes') => {
    if (!selectedQuotation || !currentStep) return;

    setIsProcessing(true);
    try {
      // Record the approval action
      const { error } = await (supabase as any)
        .from('quotation_approvals')
        .insert([{
          quotation_id: selectedQuotation.id,
          step_id: currentStep.id,
          approver_id: user?.id,
          action,
          comments: comments.trim() || null
        }]);

      if (error) throw error;

      // Update quotation status if needed
      let newStatus = selectedQuotation.status;
      if (action === 'approved') {
        // Check if this was the final step
        const isLastStep = currentStep.order === Math.max(...approvalSteps.map(s => s.order));
        if (isLastStep) {
          newStatus = 'quoted';
        } else {
          newStatus = 'reviewing';
        }
      } else if (action === 'rejected') {
        newStatus = 'declined';
      }

      // Update quotation status
      const { error: updateError } = await supabase
        .from('quotation_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuotation.id);

      if (updateError) throw updateError;

      // Send notification to requester
      await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'approval_update',
          quotation_id: selectedQuotation.id,
          action,
          step_name: currentStep.name,
          comments,
          approver_name: user?.email || 'System'
        }
      });

      toast.success(`Quotation ${action} successfully`);
      setComments('');
      
      // Reload approval history
      await loadApprovalHistory(selectedQuotation.id);
      
      // Clear selection to refresh the list
      setSelectedQuotation(null);

    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Failed to process approval');
    } finally {
      setIsProcessing(false);
    }
  };

  const canUserApprove = (step: ApprovalStep): boolean => {
    // This would check user roles in a real implementation
    // For now, we'll allow all authenticated users
    return !!user;
  };

  const getStepStatus = (step: ApprovalStep): 'completed' | 'current' | 'pending' => {
    const stepHistory = approvalHistory.find(h => h.step_id === step.id);
    if (stepHistory) return 'completed';
    if (currentStep?.id === step.id) return 'current';
    return 'pending';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'requested_changes': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'requested_changes': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Approval Workflow</h2>
        <p className="text-muted-foreground">
          Manage quotation approvals with multi-step workflow process
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Quotations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals ({pendingQuotations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingQuotations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No quotations pending approval
                  </p>
                ) : (
                  pendingQuotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedQuotation?.id === quotation.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedQuotation(quotation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {quotation.quote_reference || `QUO-${quotation.id.slice(0, 8)}`}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {quotation.company_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="text-xs">
                              R{quotation.total_amount?.toLocaleString() || 'TBD'}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {quotation.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Details */}
        <div className="lg:col-span-2">
          {selectedQuotation ? (
            <div className="space-y-6">
              {/* Quotation Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quotation Details</span>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Quote
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium">Company Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Company:</strong> {selectedQuotation.company_name}</p>
                        <p><strong>Contact:</strong> {selectedQuotation.contact_name}</p>
                        <p><strong>Email:</strong> {selectedQuotation.contact_email}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Quote Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Value:</strong> R{selectedQuotation.total_amount?.toLocaleString() || 'TBD'}</p>
                        <p><strong>Attendees:</strong> {selectedQuotation.attendee_count || 'TBD'}</p>
                        <p><strong>Duration:</strong> {selectedQuotation.event_duration || 'TBD'} days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Approval Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {approvalSteps.map((step, index) => {
                      const status = getStepStatus(step);
                      const stepHistory = approvalHistory.find(h => h.step_id === step.id);
                      
                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start gap-4 p-4 rounded-lg border ${
                            status === 'current' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : status === 'current' ? (
                              <Clock className="h-5 w-5 text-blue-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{step.name}</h4>
                              {status === 'completed' && stepHistory && (
                                <Badge 
                                  variant="outline" 
                                  className={getActionColor(stepHistory.action)}
                                >
                                  {stepHistory.action}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            
                            {stepHistory && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-3 w-3" />
                                  <span className="font-medium">{stepHistory.approver_name}</span>
                                  <span className="text-muted-foreground">
                                    {new Date(stepHistory.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {stepHistory.comments && (
                                  <p className="text-muted-foreground">{stepHistory.comments}</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {index < approvalSteps.length - 1 && (
                            <div className="absolute left-8 top-16 w-px h-8 bg-border" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Approval Actions */}
              {currentStep && canUserApprove(currentStep) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Take Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add comments (optional)..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={3}
                      />
                      
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleApprovalAction('approved')}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleApprovalAction('requested_changes')}
                          disabled={isProcessing}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Request Changes
                        </Button>
                        
                        <Button
                          variant="destructive"
                          onClick={() => handleApprovalAction('rejected')}
                          disabled={isProcessing}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Quotation</h3>
                  <p className="text-muted-foreground">
                    Choose a quotation from the list to begin the approval process
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};