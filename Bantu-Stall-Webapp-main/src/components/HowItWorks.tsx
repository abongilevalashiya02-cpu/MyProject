import React from 'react';
import { BookOpen, Users, Calendar, Gift } from 'lucide-react';

const steps = [
  {
    icon: <BookOpen className="w-12 h-12 text-bantu-orange" />,
    title: "Learn & Discover",
    description: "Explore African destinations through Horo courses and browse curated experiences in our marketplace",
    delay: "0.2s"
  },
  {
    icon: <Calendar className="w-12 h-12 text-bantu-orange" />,
    title: "Plan & Book",
    description: "Use our retreat planning tools for corporate trips or book individual experiences with local providers",
    delay: "0.4s"
  },
  {
    icon: <Users className="w-12 h-12 text-bantu-orange" />,
    title: "Connect & Share",
    description: "Join the Watu community, share your experiences, and network with fellow African travel enthusiasts",
    delay: "0.6s"
  },
  {
    icon: <Gift className="w-12 h-12 text-bantu-orange" />,
    title: "Earn & Redeem",
    description: "Collect Stamps for your engagement and redeem them for exclusive travel perks and experiences",
    delay: "0.8s"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your complete journey through Africa's business and leisure travel ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center opacity-0 animate-fade-in"
              style={{ animationDelay: step.delay }}
            >
              <div className="w-24 h-24 rounded-2xl bg-gray-50 shadow-sm flex items-center justify-center mb-6 card-hover">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-6">{step.description}</p>
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full bg-bantu-orange/10 text-bantu-orange flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block h-0.5 w-12 bg-gray-200 ml-4"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
