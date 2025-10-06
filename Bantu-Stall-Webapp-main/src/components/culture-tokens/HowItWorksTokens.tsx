
import React from 'react';
import { BookOpen, Star, Share2, Plane, Users, ChefHat } from 'lucide-react';

const steps = [
  {
    icon: <BookOpen className="w-12 h-12 text-bantu-orange" />,
    title: "Share Cultural Stories",
    tokens: "+10 Stamps",
    description: "Document your journey through African traditions, from bustling markets to intimate family meals",
    image: "/lovable-uploads/51765650-ed27-41b0-af2f-334aa8562080.png",
    delay: "0.2s"
  },
  {
    icon: <Star className="w-12 h-12 text-bantu-orange" />,
    title: "Review Local Experiences",
    tokens: "+15 Stamps",
    description: "Help fellow travelers discover authentic African cuisine, crafts, and cultural experiences",
    image: "/lovable-uploads/cca22662-031e-4a58-8a89-d0b6d1fec14f.png",
    delay: "0.4s"
  },
  {
    icon: <Share2 className="w-12 h-12 text-bantu-orange" />,
    title: "Amplify African Voices",
    tokens: "+5–10 Stamps",
    description: "Share the stories of local artisans, musicians, and cultural keepers on social platforms",
    image: "/lovable-uploads/11a1368a-560d-4bb1-92ea-5789adb56330.png",
    delay: "0.6s"
  },
  {
    icon: <Plane className="w-12 h-12 text-bantu-orange" />,
    title: "Travel with Purpose",
    tokens: "+50–100 Stamps",
    description: "Experience the continent authentically while directly supporting local communities and economies",
    image: "/lovable-uploads/5f4658ed-6a9d-4465-9246-215adef2d821.png",
    delay: "0.8s"
  }
];

const HowItWorksTokens: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Cultural Engagement Works</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every interaction with African culture becomes a meaningful exchange that benefits both travelers and local communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-in"
              style={{ animationDelay: step.delay }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 h-80 flex flex-col justify-end text-white">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="inline-block px-4 py-2 bg-bantu-yellow/90 rounded-full text-bantu-orange font-bold text-sm mb-4">
                    {step.tokens}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cultural Impact Statement */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-bantu-orange/10 to-bantu-yellow/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cultural Impact</h3>
            <p className="text-gray-700 leading-relaxed">
              Your stamps represent more than rewards—they're a testament to meaningful cultural exchange. 
              Each stamp collected supports local artisans, preserves traditional practices, and builds bridges 
              between communities across Africa and the diaspora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTokens;
