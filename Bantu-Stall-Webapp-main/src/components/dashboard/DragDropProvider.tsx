
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { toast } from 'sonner';

export interface DraggableExperience {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  category: string;
  image: string;
}

interface DragDropProviderProps {
  children: React.ReactNode;
  onExperienceDropped: (experience: DraggableExperience, date: string) => void;
}

const DragDropProvider: React.FC<DragDropProviderProps> = ({ children, onExperienceDropped }) => {
  const [draggedExperience, setDraggedExperience] = useState<DraggableExperience | null>(null);

  const onDragStart = (start: any) => {
    // Get the dragged experience data from the draggableId
    const experienceData = start.draggableId.startsWith('experience-') 
      ? JSON.parse(start.draggableId.replace('experience-', ''))
      : null;
    
    if (experienceData) {
      setDraggedExperience(experienceData);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Reset dragged experience
    setDraggedExperience(null);

    // If dropped outside a valid drop zone
    if (!destination) {
      return;
    }

    // If dropped in the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // If dropped on a calendar date
    if (destination.droppableId.startsWith('calendar-')) {
      const dateString = destination.droppableId.replace('calendar-', '');
      
      try {
        const experienceData = JSON.parse(draggableId.replace('experience-', ''));
        onExperienceDropped(experienceData, dateString);
        toast.success(`${experienceData.title} added to ${dateString}`);
      } catch (error) {
        toast.error('Failed to add experience to calendar');
      }
    }
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DragDropProvider;
