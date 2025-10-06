
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ExpandableSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full justify-between items-center text-left font-medium text-gray-900 hover:text-bantu-orange transition-colors"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isExpanded && (
        <div className="pt-2 pb-3 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
