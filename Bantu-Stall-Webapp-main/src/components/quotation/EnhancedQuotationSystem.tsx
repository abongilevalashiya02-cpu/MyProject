import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DollarSign,
  FileText,
  Calendar,
  MapPin,
  Users,
  Clock,
  Download,
  Send,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'accommodation' | 'meals' | 'activities' | 'transport' | 'extras';
}

interface QuotationData {
  id?: string;
  clientName: string;
  clientEmail: string;
  retreatName: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: number;
  items: QuotationItem[];
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  notes?: string;
  terms?: string;
}

interface EnhancedQuotationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  quotation?: QuotationData;
  mode: 'create' | 'edit' | 'view';
  onSave: (quotation: QuotationData) => Promise<void>;
}

const EnhancedQuotationSystem: React.FC<EnhancedQuotationSystemProps> = ({
  isOpen,
  onClose,
  quotation,
  mode,
  onSave
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<QuotationData>({
    clientName: '',
    clientEmail: '',
    retreatName: '',
    location: '',
    startDate: '',
    endDate: '',
    participants: 0,
    items: [],
    subtotal: 0,
    taxes: 0,
    discount: 0,
    total: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    notes: '',
    terms: 'Payment terms: 50% deposit required upon booking confirmation. Full payment due 30 days before retreat start date.'
  });

  const [newItemForm, setNewItemForm] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    category: 'accommodation' as QuotationItem['category']
  });

  useEffect(() => {
    if (quotation) {
      setCurrentQuotation(quotation);
    }
  }, [quotation]);

  useEffect(() => {
    const subtotal = currentQuotation.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * currentQuotation.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxes = taxableAmount * 0.15; // 15% VAT
    const total = taxableAmount + taxes;

    setCurrentQuotation(prev => ({
      ...prev,
      subtotal,
      taxes,
      total
    }));
  }, [currentQuotation.items, currentQuotation.discount]);

  const calculateTotals = () => {
    const subtotal = currentQuotation.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * currentQuotation.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxes = taxableAmount * 0.15; // 15% VAT
    const total = taxableAmount + taxes;

    setCurrentQuotation(prev => ({
      ...prev,
      subtotal,
      taxes,
      total
    }));
  };

  const addItem = () => {
    if (!newItemForm.description || newItemForm.unitPrice <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please provide description and valid unit price.",
        variant: "destructive"
      });
      return;
    }

    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: newItemForm.description,
      quantity: newItemForm.quantity,
      unitPrice: newItemForm.unitPrice,
      total: newItemForm.quantity * newItemForm.unitPrice,
      category: newItemForm.category
    };

    setCurrentQuotation(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setNewItemForm({
      description: '',
      quantity: 1,
      unitPrice: 0,
      category: 'accommodation'
    });
  };

  const removeItem = (id: string) => {
    setCurrentQuotation(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSave = async () => {
    if (!currentQuotation.clientName || !currentQuotation.clientEmail || currentQuotation.items.length === 0) {
      toast({
        title: "Incomplete Quotation",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(currentQuotation);
      toast({
        title: "Quotation Saved",
        description: "Your quotation has been saved successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quotation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendQuotation = async () => {
    await handleSave();
    setCurrentQuotation(prev => ({ ...prev, status: 'sent' }));
    toast({
      title: "Quotation Sent",
      description: `Quotation has been sent to ${currentQuotation.clientEmail}`,
    });
  };

  const getStatusColor = (status: QuotationData['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: QuotationItem['category']) => {
    switch (category) {
      case 'accommodation': return '🏨';
      case 'meals': return '🍽️';
      case 'activities': return '🎯';
      case 'transport': return '🚌';
      case 'extras': return '⭐';
      default: return '📦';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-bantu-orange to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                {mode === 'create' ? 'Create New Quotation' : mode === 'edit' ? 'Edit Quotation' : 'View Quotation'}
              </h2>
              {currentQuotation.id && (
                <p className="text-orange-100 mt-1">Quote #{currentQuotation.id}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(currentQuotation.status)} text-white`}>
                {currentQuotation.status.toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Client & Retreat Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Client Name</label>
                      <Input
                        value={currentQuotation.clientName}
                        onChange={(e) => setCurrentQuotation(prev => ({
                          ...prev,
                          clientName: e.target.value
                        }))}
                        disabled={mode === 'view'}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        value={currentQuotation.clientEmail}
                        onChange={(e) => setCurrentQuotation(prev => ({
                          ...prev,
                          clientEmail: e.target.value
                        }))}
                        disabled={mode === 'view'}
                        placeholder="client@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Retreat Name</label>
                    <Input
                      value={currentQuotation.retreatName}
                      onChange={(e) => setCurrentQuotation(prev => ({
                        ...prev,
                        retreatName: e.target.value
                      }))}
                      disabled={mode === 'view'}
                      placeholder="Annual Leadership Retreat 2024"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={currentQuotation.location}
                        onChange={(e) => setCurrentQuotation(prev => ({
                          ...prev,
                          location: e.target.value
                        }))}
                        disabled={mode === 'view'}
                        placeholder="Cape Town, SA"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={currentQuotation.startDate}
                        onChange={(e) => setCurrentQuotation(prev => ({
                          ...prev,
                          startDate: e.target.value
                        }))}
                        disabled={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={currentQuotation.endDate}
                        onChange={(e) => setCurrentQuotation(prev => ({
                          ...prev,
                          endDate: e.target.value
                        }))}
                        disabled={mode === 'view'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Number of Participants</label>
                    <Input
                      type="number"
                      value={currentQuotation.participants}
                      onChange={(e) => setCurrentQuotation(prev => ({
                        ...prev,
                        participants: parseInt(e.target.value) || 0
                      }))}
                      disabled={mode === 'view'}
                      placeholder="25"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quotation Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Quotation Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mode !== 'view' && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                      <Input
                        placeholder="Item description"
                        value={newItemForm.description}
                        onChange={(e) => setNewItemForm(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={newItemForm.quantity}
                        onChange={(e) => setNewItemForm(prev => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 1
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        value={newItemForm.unitPrice}
                        onChange={(e) => setNewItemForm(prev => ({
                          ...prev,
                          unitPrice: parseFloat(e.target.value) || 0
                        }))}
                      />
                      <Select
                        value={newItemForm.category}
                        onValueChange={(value: QuotationItem['category']) => 
                          setNewItemForm(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accommodation">🏨 Accommodation</SelectItem>
                          <SelectItem value="meals">🍽️ Meals</SelectItem>
                          <SelectItem value="activities">🎯 Activities</SelectItem>
                          <SelectItem value="transport">🚌 Transport</SelectItem>
                          <SelectItem value="extras">⭐ Extras</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addItem} className="bg-bantu-orange hover:bg-orange-600">
                        Add Item
                      </Button>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        {mode !== 'view' && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentQuotation.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{getCategoryIcon(item.category)}</span>
                              {item.description}
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>${item.total.toLocaleString()}</TableCell>
                          {mode !== 'view' && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quote Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${currentQuotation.subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Discount:</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={currentQuotation.discount}
                          onChange={(e) => setCurrentQuotation(prev => ({
                            ...prev,
                            discount: parseFloat(e.target.value) || 0
                          }))}
                          disabled={mode === 'view'}
                          className="w-16 h-6 text-xs"
                          min="0"
                          max="100"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>VAT (15%):</span>
                      <span>${currentQuotation.taxes.toLocaleString()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${currentQuotation.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Valid Until</label>
                    <Input
                      type="date"
                      value={currentQuotation.validUntil}
                      onChange={(e) => setCurrentQuotation(prev => ({
                        ...prev,
                        validUntil: e.target.value
                      }))}
                      disabled={mode === 'view'}
                    />
                  </div>
                </CardContent>
              </Card>

              {mode !== 'view' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full bg-bantu-orange hover:bg-orange-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Quote
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleSendQuotation}
                      disabled={isLoading || !currentQuotation.clientEmail}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to Client
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Quote Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Per Person:</span>
                    <span>${currentQuotation.participants > 0 ? (currentQuotation.total / currentQuotation.participants).toFixed(0) : '0'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Per Day:</span>
                    <span>${currentQuotation.startDate && currentQuotation.endDate ? 
                      (currentQuotation.total / Math.max(1, Math.ceil((new Date(currentQuotation.endDate).getTime() - new Date(currentQuotation.startDate).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(0) 
                      : '0'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profit Margin:</span>
                    <span className="text-green-600">25%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedQuotationSystem;
