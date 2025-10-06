import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Users, Heart, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Africa-Centric & Globally Connected",
    description: "We celebrate African entrepreneurship and tourism while making it accessible to the world, bridging cultures and creating meaningful connections.",
    delay: "0.1s"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "People-Driven Experiences",
    description: "Travel isn't just about places; it's about the people who make them memorable. Every journey connects you with authentic local stories.",
    delay: "0.2s"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Empowering Gigpreneurs",
    description: "We don't just promote travel; we build economies by supporting Africa's tourism entrepreneurs and creating sustainable livelihoods.",
    delay: "0.3s"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Rewarding Engagement",
    description: "Earn Stamps for sharing memories, engaging with our platforms, and traveling. Redeem them across African-owned businesses globally.",
    delay: "0.4s"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Trusted & Authentic",
    description: "Every experience is carefully curated and verified, ensuring quality and authenticity in every interaction and booking.",
    delay: "0.5s"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Transformative Journeys",
    description: "More than just trips—we create transformative experiences that foster personal growth, cultural understanding, and lasting memories.",
    delay: "0.6s"
  }
];

const WhyBantuStall = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-bantu-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-orange-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-bantu-orange to-gray-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Bantu Stall?
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            We're not just another travel platform. We're building a movement that celebrates African excellence while creating meaningful opportunities for connection, growth, and economic empowerment.
          </motion.p>
          <motion.div 
            className="w-24 h-1 bg-bantu-orange mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: parseFloat(feature.delay),
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bantu-orange to-orange-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-bantu-orange transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
      </div>
    </section>
  );
};

export default WhyBantuStall;