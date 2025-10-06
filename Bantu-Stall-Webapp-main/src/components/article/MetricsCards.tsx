import React from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, description }) => (
  <div className="glass rounded-xl p-6 shadow-lg backdrop-blur-sm border border-white/10">
    <div className="text-3xl md:text-4xl font-bold text-bantu-yellow mb-2">{value}</div>
    <div className="text-lg md:text-xl font-semibold text-bantu-orange mb-2">{label}</div>
    <div className="text-black text-sm">{description}</div>
  </div>
);

const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center mb-16 md:mb-24">
      <MetricCard
        value="$6.6B"
        label="South Africa's MICE Sector Value"
        description="MICE sector value (2023)"
      />
      <MetricCard
        value="<50%"
        label="Event Cost Compared to Europe/Asia"
        description="significant cost savings without quality compromise"
      />
      <MetricCard
        value="90.5%"
        label="CTICC's Local Procurement Spend"
        description="of event budget flows directly into local communities"
      />
    </div>
  );
};

export default MetricsCards;