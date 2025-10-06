
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateRetreatData } from '@/types/retreats';

interface CreateRetreatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetreatCreated: () => void;
}

const CreateRetreatModal: React.FC<CreateRetreatModalProps> = ({ isOpen, onClose, onRetreatCreated }) => {
  const [formData, setFormData] = useState<CreateRetreatData>({
    name: '',
    description: '',
    trip_dates: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('retreats')
        .insert([{
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description?.trim() || null,
          trip_dates: formData.trip_dates?.trim() || null,
          status: 'planning'
        }]);

      if (error) throw error;

      toast({
        title: "Retreat created!",
        description: "Your new retreat plan has been created successfully.",
      });

      onRetreatCreated();
      onClose();
      setFormData({ name: '', description: '', trip_dates: '' });
    } catch (error: any) {
      console.error('Error creating retreat:', error);
      toast({
        title: "Error",
        description: "Failed to create retreat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Retreat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Retreat Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Cape Town Strategy Reset"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trip_dates">Trip Dates (Optional)</Label>
            <Input
              id="trip_dates"
              placeholder="e.g., March 15-17, 2024"
              value={formData.trip_dates || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, trip_dates: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this retreat..."
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 bg-bantu-orange hover:bg-bantu-orange/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Retreat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRetreatModal;
