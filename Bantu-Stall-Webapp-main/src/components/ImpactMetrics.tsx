
import React, { useEffect, useRef } from 'react';
import { Building, Globe, User, Award } from 'lucide-react';

const metrics = [
  {
    icon: <Building className="w-14 h-14 text-bantu-orange" />,
    value: 35,
    label: "Businesses Onboarded",
    prefix: "",
    suffix: "+",
    delay: "0.2s"
  },
  {
    icon: <Globe className="w-14 h-14 text-bantu-orange" />,
    value: 16,
    label: "Countries Featured",
    prefix: "",
    suffix: "",
    delay: "0.4s"
  },
  {
    icon: <User className="w-14 h-14 text-bantu-orange" />,
    value: 2000,
    label: "Travelers Connected",
    prefix: "",
    suffix: "+",
    delay: "0.6s"
  },
  {
    icon: <Award className="w-14 h-14 text-bantu-orange" />,
    value: 98,
    label: "Satisfaction Rate",
    prefix: "",
    suffix: "%",
    delay: "0.8s"
  }
];

const CountUpNumber = ({ value, prefix, suffix }: { value: number, prefix: string, suffix: string }) => {
  const [count, setCount] = React.useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const startTimestamp = performance.now();
    
    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      setCount(currentCount);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isVisible, value]);
  
  return (
    <span ref={countRef} className="text-4xl font-bold">
      {prefix}{count}{suffix}
    </span>
  );
};

const ImpactMetrics = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Growing together across the African continent
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-sm text-center card-hover opacity-0 animate-fade-in"
              style={{ animationDelay: metric.delay }}
            >
              <div className="flex justify-center mb-4">
                {metric.icon}
              </div>
              <CountUpNumber 
                value={metric.value} 
                prefix={metric.prefix} 
                suffix={metric.suffix} 
              />
              <p className="text-gray-600 mt-2">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
