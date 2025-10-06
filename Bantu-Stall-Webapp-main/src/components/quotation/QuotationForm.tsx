import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  FileText, 
  User, 
  Calendar,
  DollarSign,
  MessageSquare,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { 
  useCreateQuotation, 
  useUpdateQuotation, 
  useQuotation,
  useClients, 
  useCreateClient,
  useQuotationTemplates,
  useUpdateLineItems
} from "@/hooks/useQuotations";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  vat_id: z.string().optional(),
  company_name: z.string().optional(),
});

const lineItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Price must be positive"),
  tax_rate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
});

const quotationSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  template_id: z.string().optional(),
  issue_date: z.string(),
  due_date: z.string(),
  client_notes: z.string().optional(),
  terms_conditions: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

type QuotationFormData = z.infer<typeof quotationSchema>;
type ClientFormData = z.infer<typeof clientSchema>;

const QuotationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const FORM_KEY = isEditing ? `quotation-form-${id}` : 'quotation-form-new';
  
  const defaultFormValues: QuotationFormData = {
    client_id: "",
    template_id: "",
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    client_notes: "",
    terms_conditions: "Payment is due within 30 days of quotation acceptance.",
    line_items: [
      {
        item_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: 15,
      }
    ],
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );
  
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quotation } = useQuotation(id || "");
  const { data: clients = [] } = useClients();
  const { data: templates = [] } = useQuotationTemplates();
  
  const createQuotation = useCreateQuotation();
  const updateQuotation = useUpdateQuotation();
  const createClient = useCreateClient();
  const updateLineItems = useUpdateLineItems();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: isEditing ? defaultFormValues : loadInitialData(),
  });

  // Auto-save form data whenever it changes (only if not editing existing quotation)
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, undefined, isEditing ? [] : []);

  const clientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      vat_id: "",
      company_name: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  });

  // Load quotation data for editing
  useEffect(() => {
    if (quotation && isEditing) {
      form.reset({
        client_id: quotation.client_id,
        template_id: quotation.template_id || "",
        issue_date: quotation.issue_date,
        due_date: quotation.due_date,
        client_notes: quotation.client_notes || "",
        terms_conditions: quotation.terms_conditions || "",
        line_items: quotation.line_items?.map(item => ({
          item_name: item.item_name,
          description: item.description || "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
        })) || [],
      });
    }
  }, [quotation, isEditing, form]);

  // Calculate totals
  const lineItems = form.watch("line_items");
  const totals = React.useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.unit_price || 0);
    }, 0);
    
    const tax = lineItems.reduce((sum, item) => {
      const lineSubtotal = (item.quantity || 0) * (item.unit_price || 0);
      return sum + (lineSubtotal * (item.tax_rate || 0) / 100);
    }, 0);
    
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [lineItems]);

  const onCreateClient = async (data: ClientFormData) => {
    try {
      const newClient = await createClient.mutateAsync(data);
      form.setValue("client_id", newClient.id);
      setShowClientDialog(false);
      clientForm.reset();
      toast.success("Client created successfully");
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const onSubmit = async (data: QuotationFormData, isDraft = true) => {
    setIsSubmitting(true);
    try {
      const quotationData = {
        ...data,
        status: isDraft ? 'draft' : 'sent',
        subtotal: totals.subtotal,
        tax_amount: totals.tax,
        total_amount: totals.total,
      };

      let quotationId: string;

      if (isEditing) {
        const updatedQuotation = await updateQuotation.mutateAsync({
          id: id!,
          client_id: data.client_id,
          template_id: data.template_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          client_notes: data.client_notes,
          terms_conditions: data.terms_conditions,
          status: quotationData.status as "draft" | "paid" | "sent" | "expired" | "declined" | "viewed" | "accepted",
          subtotal: quotationData.subtotal,
          tax_amount: quotationData.tax_amount,
          total_amount: quotationData.total_amount,
        });
        quotationId = updatedQuotation.id;
      } else {
        const newQuotation = await createQuotation.mutateAsync({
          client_id: data.client_id,
          template_id: data.template_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          client_notes: data.client_notes,
          terms_conditions: data.terms_conditions,
          status: quotationData.status as "draft" | "paid" | "sent" | "expired" | "declined" | "viewed" | "accepted",
          subtotal: quotationData.subtotal,
          tax_amount: quotationData.tax_amount,
          total_amount: quotationData.total_amount,
        });
        quotationId = newQuotation.id;
      }

      // Update line items
      await updateLineItems.mutateAsync({
        quotationId,
        lineItems: data.line_items.map((item, index) => ({
          ...item,
          sort_order: index,
          line_total: item.quantity * item.unit_price * (1 + item.tax_rate / 100),
        })),
      });

      toast.success(
        isDraft 
          ? `Quotation ${isEditing ? 'updated' : 'created'} successfully`
          : "Quotation sent successfully"
      );
      
      if (!isEditing) {
        clearData(); // Clear persisted data on successful creation (but not when editing)
      }
      
      navigate('/quotations/list');
    } catch (error) {
      console.error("Error saving quotation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLineItem = () => {
    append({
      item_name: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      tax_rate: 15,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Quotation' : 'Create Quotation'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update quotation details' : 'Fill out the form to create a new quotation'}
          </p>
        </div>
        {isEditing && quotation && (
          <Badge variant="outline" className="text-lg px-3 py-1">
            {quotation.quotation_number}
          </Badge>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))} className="space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>Quotation Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle>Client Information</CardTitle>
                </div>
                <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <Form {...clientForm}>
                      <form onSubmit={clientForm.handleSubmit(onCreateClient)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={clientForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={clientForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={clientForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={clientForm.control}
                            name="company_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={clientForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={clientForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={clientForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={clientForm.control}
                          name="vat_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>VAT/Tax ID</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowClientDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Client</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{client.name}</span>
                                <span className="text-sm text-muted-foreground">{client.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Line Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <CardTitle>Quotation Line Items</CardTitle>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-12 gap-4 p-4 border rounded-lg"
                    >
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.item_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Service/Product name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Brief description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.unit_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.tax_rate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax %</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">R{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-medium">R{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">R{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes & Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>Notes & Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="client_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Thank you for your business! We look forward to working with you."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Payment is due within 30 days. Valid for 7 days."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end space-x-4 pt-6"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/quotations/list')}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/quotations/preview/${id || 'new'}`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              type="button"
              onClick={form.handleSubmit((data) => onSubmit(data, false))}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Quotation
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default QuotationForm;