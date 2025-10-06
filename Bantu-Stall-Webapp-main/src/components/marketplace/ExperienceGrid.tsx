
import React from 'react';
import ExperienceCard from './ExperienceCard';
import { ExperienceType } from '../../types/marketplace';

interface ExperienceGridProps {
  experiences: ExperienceType[];
}

const ExperienceGrid = ({ experiences }: ExperienceGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiences.length > 0 ? (
        experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))
      ) : (
        <div className="col-span-full py-12 text-center">
          <h3 className="text-xl font-medium text-gray-500">No experiences match your filters</h3>
          <p className="mt-2 text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceGrid;
