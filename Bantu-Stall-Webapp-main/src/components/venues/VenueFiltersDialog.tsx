
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ActivityFilter from './ActivityFilter';

interface VenueFiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActivityCategories: string[];
  onActivityToggle: (activityId: string) => void;
  onClearActivities: () => void;
}

const VenueFiltersDialog: React.FC<VenueFiltersDialogProps> = ({
  isOpen,
  onClose,
  selectedActivityCategories,
  onActivityToggle,
  onClearActivities
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter by Activity Categories</DialogTitle>
        </DialogHeader>
        <ActivityFilter
          selectedActivities={selectedActivityCategories}
          onActivityToggle={onActivityToggle}
          onClearAll={onClearActivities}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VenueFiltersDialog;
