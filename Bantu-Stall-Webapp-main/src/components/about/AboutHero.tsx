
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Globe, Target } from 'lucide-react';

const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
          alt="African team building" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/70 to-bantu-orange/20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-5">
        <motion.div 
          className="absolute top-20 left-10 w-4 h-4 bg-bantu-orange/40 rounded-full"
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-16 w-3 h-3 bg-white/30 rounded-full"
          animate={{ y: [0, 25, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-5 h-5 bg-bantu-orange/30 rounded-full"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Enhanced Title */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-white via-orange-200 to-bantu-orange bg-clip-text text-transparent">
              About Bantu Stall
            </span>
          </motion.h1>
          
          {/* Enhanced Subtitle */}
          <motion.p 
            className="text-2xl md:text-3xl font-light mb-12 text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Join Our Retreats, Bring Your Team, Build Your Team.
          </motion.p>

          {/* Values Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bantu-orange to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-gray-300">Building lasting connections</p>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Authenticity</h3>
              <p className="text-sm text-gray-300">Genuine cultural experiences</p>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Impact</h3>
              <p className="text-sm text-gray-300">Connecting across continents</p>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Purpose</h3>
              <p className="text-sm text-gray-300">Meaningful business growth</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
