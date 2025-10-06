
import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">Bantu Stall</h3>
      <p className="text-gray-400 mb-4">
        Connecting travelers with authentic African experiences for personal and business growth.
      </p>
      <Link 
        to="/about" 
        className="text-bantu-orange hover:text-bantu-orange/80 transition-colors"
        onClick={() => window.scrollTo(0, 0)}
      >
        Learn more about us →
      </Link>
    </div>
  );
};

export default AboutSection;
