
import React, { useState, useEffect } from 'react';

const roles = [
  'Psychological Safety',
  'Rejuvenated Teams',
  'Culture & Reconnection',
  'Traditional Wellness',
  'Impactful Retreats',
  'African Excellence',
  'BBBEE & ESG'
];

const AnimatedTagline: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showRole, setShowRole] = useState(false);

  const baseText = 'Curate experiences that deliver ';

  // Typing animation for the base text
  useEffect(() => {
    if (displayedText.length < baseText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(baseText.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
      setTimeout(() => setShowRole(true), 200);
    }
  }, [displayedText, baseText]);

  // Role rotation animation - updated to 2.5 seconds
  useEffect(() => {
    if (!isTypingComplete) return;

    const interval = setInterval(() => {
      setShowRole(false);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setShowRole(true);
      }, 300);
    }, 2500); // Changed from 2000 to 2500ms

    return () => clearInterval(interval);
  }, [isTypingComplete]);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl animate-slide-down opacity-0 font-avenir text-center" style={{ animationDelay: '0.4s' }}>
      <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        {displayedText}
        {isTypingComplete && (
          <span 
            className={`inline-block transition-all duration-500 ease-in-out relative group cursor-pointer ${
              showRole 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-3'
            }`}
            style={{ minWidth: '250px', textAlign: 'left' }}
          >
            <span className={`relative text-white font-bold ${showRole ? 'animate-pulse' : ''}`}>
              {roles[currentRoleIndex]}
              {/* Glow effect */}
              {showRole && (
                <span className="absolute inset-0 bg-gradient-to-r from-bantu-orange/20 to-bantu-yellow/20 blur-lg rounded-lg -z-10 animate-pulse"></span>
              )}
            </span>
            
            {/* Tooltip */}
            {showRole && (
              <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/80 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                  👉 Discover how we deliver {roles[currentRoleIndex]}
                  <div className="absolute top-0 left-4 -translate-y-1 w-2 h-2 bg-black/80 rotate-45"></div>
                </div>
              </div>
            )}
            
            {/* Underline animation */}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-bantu-orange to-bantu-yellow transition-all duration-500 ${
              showRole ? 'w-full' : 'w-0'
            }`}></span>
          </span>
        )}
        {!isTypingComplete && (
          <span className="animate-pulse text-bantu-orange">|</span>
        )}
      </span>
    </h1>
  );
};

export default AnimatedTagline;
