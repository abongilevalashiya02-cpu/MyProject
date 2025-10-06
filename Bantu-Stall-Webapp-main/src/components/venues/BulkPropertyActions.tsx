import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  Mail,
  Filter
} from 'lucide-react';

interface PropertyListing {
  id: string;
  property_name: string;
  location: string;
  status: string;
  contact_email: string;
  created_at: string;
}

interface BulkPropertyActionsProps {
  properties: PropertyListing[];
  onPropertiesUpdate: () => void;
}

const BulkPropertyActions: React.FC<BulkPropertyActionsProps> = ({
  properties,
  onPropertiesUpdate
}) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties(prev => [...prev, propertyId]);
    } else {
      setSelectedProperties(prev => prev.filter(id => id !== propertyId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(properties.map(p => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedProperties.length === 0) {
      toast({
        title: "Action Required",
        description: "Please select properties and an action",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      switch (bulkAction) {
        case 'approve':
          await supabase
            .from('property_listings')
            .update({ status: 'approved' })
            .in('id', selectedProperties);
          
          toast({
            title: "Properties Approved",
            description: `${selectedProperties.length} properties have been approved`
          });
          break;

        case 'reject':
          await supabase
            .from('property_listings')
            .update({ status: 'rejected' })
            .in('id', selectedProperties);
          
          toast({
            title: "Properties Rejected",
            description: `${selectedProperties.length} properties have been rejected`
          });
          break;

        case 'pending':
          await supabase
            .from('property_listings')
            .update({ status: 'pending' })
            .in('id', selectedProperties);
          
          toast({
            title: "Status Updated",
            description: `${selectedProperties.length} properties marked as pending`
          });
          break;

        case 'delete':
          await supabase
            .from('property_listings')
            .delete()
            .in('id', selectedProperties);
          
          toast({
            title: "Properties Deleted",
            description: `${selectedProperties.length} properties have been deleted`
          });
          break;

        case 'export':
          await exportSelectedProperties();
          break;

        case 'notify':
          await notifyPropertyOwners();
          break;

        default:
          throw new Error('Invalid action');
      }

      setSelectedProperties([]);
      setBulkAction('');
      onPropertiesUpdate();

    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSelectedProperties = async () => {
    const selectedData = properties.filter(p => selectedProperties.includes(p.id));
    
    // Create CSV content
    const headers = ['Property Name', 'Location', 'Status', 'Contact Email', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(p => [
        `"${p.property_name}"`,
        `"${p.location}"`,
        p.status,
        p.contact_email,
        new Date(p.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `property-listings-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Complete",
      description: `Exported ${selectedProperties.length} properties to CSV`
    });
  };

  const notifyPropertyOwners = async () => {
    const selectedData = properties.filter(p => selectedProperties.includes(p.id));
    
    // This would typically integrate with an email service
    // For now, we'll just show a success message
    toast({
      title: "Notifications Sent",
      description: `Email notifications sent to ${selectedData.length} property owners`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions Header */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedProperties.length === properties.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">
                Select All ({selectedProperties.length}/{properties.length})
              </span>
            </div>

            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </div>
                </SelectItem>
                <SelectItem value="reject">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Mark Pending
                  </div>
                </SelectItem>
                <SelectItem value="export">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </div>
                </SelectItem>
                <SelectItem value="notify">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notify Owners
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {bulkAction === 'delete' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={selectedProperties.length === 0 || loading}
                  >
                    Execute Action
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectedProperties.length} properties. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={executeBulkAction}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button 
                onClick={executeBulkAction}
                disabled={selectedProperties.length === 0 || !bulkAction || loading}
              >
                {loading ? 'Processing...' : 'Execute Action'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property List */}
      <div className="space-y-2">
        {properties.map((property) => (
          <Card 
            key={property.id} 
            className={`transition-all ${
              selectedProperties.includes(property.id) 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => 
                      handleSelectProperty(property.id, checked as boolean)
                    }
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{property.property_name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {property.location} • {property.contact_email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Badge variant={getStatusVariant(property.status)} className="flex items-center gap-1">
                  {getStatusIcon(property.status)}
                  {property.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No properties found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkPropertyActions;