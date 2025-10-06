import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteQuotation } from '@/hooks/useQuotations';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface QuotationTableProps {
  quotations: any[];
  onView: (quotation: any) => void;
  onEdit: (quotation: any) => void;
  isAdmin: boolean;
}

export const QuotationTable: React.FC<QuotationTableProps> = ({
  quotations,
  onView,
  onEdit,
  isAdmin
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const deleteQuotation = useDeleteQuotation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'viewed': return 'outline';
      case 'accepted': return 'default';
      case 'declined': return 'destructive';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  const canDelete = (quotation: any) => {
    return quotation.status !== 'accepted' && quotation.status !== 'expired';
  };

  const handleDelete = (quotation: any) => {
    if (!canDelete(quotation)) {
      toast.error('You cannot delete a locked quotation');
      return;
    }
    setQuotationToDelete(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!quotationToDelete) return;
    
    try {
      await deleteQuotation.mutateAsync(quotationToDelete.id);
      setDeleteDialogOpen(false);
      setQuotationToDelete(null);
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'ZAR') => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (quotations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No quotations found</h3>
          <p className="text-muted-foreground">
            Create your first quotation to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {quotation.quotation_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quotation.client?.name}</div>
                        {quotation.client?.company_name && (
                          <div className="text-sm text-muted-foreground">
                            {quotation.client.company_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(quotation.issue_date)}</TableCell>
                    <TableCell>{formatDate(quotation.due_date)}</TableCell>
                    <TableCell className="font-medium">
                      {quotation.total_amount ? formatCurrency(quotation.total_amount, quotation.currency || 'ZAR') : 'No amount set'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusColor(quotation.status)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(quotation.status)}
                        <span className="capitalize">{quotation.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(quotation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(quotation)}
                          disabled={quotation.status === 'accepted' || quotation.status === 'expired'}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(quotation)}
                          disabled={!canDelete(quotation)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quotation {quotationToDelete?.quotation_number}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};