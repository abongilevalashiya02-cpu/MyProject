import React from 'react';

interface PillarProps {
  number: string;
  title: string;
  description: string;
}

const Pillar: React.FC<PillarProps> = ({ number, title, description }) => (
  <div className="glass rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-sm border border-white/10 hover:border-bantu-yellow/30 transition-all duration-300">
    <div className="text-4xl md:text-5xl font-bold text-bantu-yellow mb-4">{number}</div>
    <h3 className="text-xl md:text-2xl font-semibold text-black mb-4">{title}</h3>
    <p className="text-black leading-relaxed">{description}</p>
  </div>
);

const PillarsSection: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-bantu-yellow mb-8 md:mb-12 text-center">
        Four Pillars of the African Corporate Travel Revolution
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
        <Pillar
          number="01"
          title="Authentic Cultural Integration"
          description="Corporate events that meaningfully engage with Africa's rich cultural heritage, fostering genuine cross-cultural competence and global leadership capabilities."
        />
        <Pillar
          number="02"
          title="Superior Value Proposition"
          description="Premium experiences at 45-60% lower costs than comparable European/Asian destinations, without compromising on quality, service, or facilities."
        />
        <Pillar
          number="03"
          title="Measurable Community Impact"
          description="Events designed around the regenerative travel model, ensuring 85%+ of spend flows to local communities while creating lasting economic and social benefits."
        />
        <Pillar
          number="04"
          title="World-Class Infrastructure"
          description="Modern MICE facilities, reliable connectivity, and professional service standards that meet or exceed international corporate requirements across 15+ Southern African destinations."
        />
      </div>
    </div>
  );
};

export default PillarsSection;