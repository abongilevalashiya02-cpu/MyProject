import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Upload, Download, Copy } from 'lucide-react';

interface FloatingActionMenuProps {
  onAction: (action: string) => void;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'new', label: 'New Quotation', icon: FileText, color: 'bg-blue-500' },
    { id: 'template', label: 'From Template', icon: Copy, color: 'bg-green-500' },
    { id: 'upload', label: 'Import', icon: Upload, color: 'bg-purple-500' },
    { id: 'export', label: 'Export All', icon: Download, color: 'bg-orange-500' },
  ];

  const handleAction = (actionId: string) => {
    onAction(actionId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0, 
                  y: 20,
                  transition: { delay: (actions.length - index - 1) * 0.05 }
                }}
                onClick={() => handleAction(action.id)}
                className={`${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group flex items-center space-x-2 min-w-max`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium pr-1">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-bantu-orange text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
};
