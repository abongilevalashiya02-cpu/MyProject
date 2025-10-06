
import React from 'react';

interface PackageHighlightProps {
  title: string;
  description: string;
}

const PackageHighlight: React.FC<PackageHighlightProps> = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-bantu-orange">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default PackageHighlight;
