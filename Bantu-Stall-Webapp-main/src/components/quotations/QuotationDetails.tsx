import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSendQuotation, useDeleteQuotation } from '@/hooks/useQuotations';
import { 
  Edit, 
  Send, 
  Download, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface QuotationDetailsProps {
  quotation: any;
  onClose: () => void;
  onEdit: (quotation: any) => void;
  isOpen: boolean;
  isAdmin: boolean;
}

export const QuotationDetails: React.FC<QuotationDetailsProps> = ({
  quotation,
  onClose,
  onEdit,
  isOpen,
  isAdmin
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const sendQuotation = useSendQuotation();
  const deleteQuotation = useDeleteQuotation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
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

  const formatCurrency = (amount: number, currency?: string) => {
    const curr = currency || quotation?.currency || 'ZAR';
    const locale = curr === 'USD' ? 'en-US' : 'en-ZA';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSend = async () => {
    try {
      await sendQuotation.mutateAsync(quotation.id);
      toast.success('Quotation sent successfully');
    } catch (error) {
      toast.error('Failed to send quotation');
    }
  };

  const handleDelete = async () => {
    if (quotation.status === 'accepted' || quotation.status === 'expired') {
      toast.error('You cannot delete a locked quotation');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteQuotation.mutateAsync(quotation.id);
      toast.success('Quotation deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete quotation');
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = quotation.status !== 'accepted' && quotation.status !== 'expired';
  const canDelete = quotation.status !== 'accepted' && quotation.status !== 'expired';
  const canSend = quotation.status === 'draft';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quotation {quotation.quotation_number}
            </DialogTitle>
            <Badge 
              variant={getStatusColor(quotation.status)}
              className="flex items-center gap-1"
            >
              {getStatusIcon(quotation.status)}
              <span className="capitalize">{quotation.status}</span>
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{quotation.client?.name}</span>
                    </div>
                    {quotation.client?.company_name && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.client.company_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{quotation.client?.email}</span>
                    </div>
                    {quotation.client?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.client.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Issue Date: {formatDate(quotation.issue_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due Date: {formatDate(quotation.due_date)}</span>
                    </div>
                    {quotation.sent_at && (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-muted-foreground" />
                        <span>Sent: {formatDate(quotation.sent_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotation.line_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start p-3 border rounded">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.item_name}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <div className="text-sm text-muted-foreground mt-1">
                          Qty: {item.quantity} × {formatCurrency(item.unit_price)} 
                          {item.tax_rate > 0 && ` (+${item.tax_rate}% tax)`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(item.line_total)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{quotation.subtotal ? formatCurrency(quotation.subtotal) : 'No subtotal set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{quotation.tax_amount ? formatCurrency(quotation.tax_amount) : 'No tax set'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{quotation.total_amount ? formatCurrency(quotation.total_amount) : 'No total set'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes and Terms */}
            {(quotation.client_notes || quotation.terms_conditions) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quotation.client_notes && (
                    <div>
                      <h4 className="font-medium mb-2">Client Notes</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {quotation.client_notes}
                      </p>
                    </div>
                  )}
                  {quotation.terms_conditions && (
                    <div>
                      <h4 className="font-medium mb-2">Terms & Conditions</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {quotation.terms_conditions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      Created on {formatDate(quotation.created_at)}
                    </span>
                  </div>
                  {quotation.sent_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Sent to client on {formatDate(quotation.sent_at)}
                      </span>
                    </div>
                  )}
                  {quotation.viewed_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">
                        Viewed by client on {formatDate(quotation.viewed_at)}
                      </span>
                    </div>
                  )}
                  {quotation.accepted_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">
                        Accepted on {formatDate(quotation.accepted_at)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {canEdit && (
              <Button variant="outline" onClick={() => onEdit(quotation)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canSend && (
              <Button onClick={handleSend} disabled={sendQuotation.isPending}>
                <Send className="h-4 w-4 mr-2" />
                Send Quotation
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};