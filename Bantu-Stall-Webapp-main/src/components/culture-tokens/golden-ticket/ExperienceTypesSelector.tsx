
import React from 'react';
import { experienceTypes, ExperienceType } from './constants';

interface ExperienceTypesSelectorProps {
  value: string;
  onSelect: (value: string) => void;
}

const ExperienceTypesSelector: React.FC<ExperienceTypesSelectorProps> = ({ value, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
      {experienceTypes.map((type: ExperienceType) => (
        <div
          key={type.id}
          className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
            value === type.id
              ? "border-bantu-orange bg-bantu-orange/10"
              : "border-gray-200 hover:border-bantu-orange/50"
          }`}
          onClick={() => onSelect(type.id)}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            {type.icon}
          </div>
          <span className="font-medium">{type.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ExperienceTypesSelector;
