
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight,
  Heart,
  Rocket
} from 'lucide-react';

const AboutCTA = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Header */}
          <motion.div 
            className="relative z-10 mb-16"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-lg font-medium text-white">Join the Movement</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Shape the Future of
              <span className="block text-yellow-300">
                African Tourism
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              Whether you're a traveler, gigpreneur, or business leader, Bantu Stall welcomes you 
              to create, connect, and explore—one authentic experience at a time.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="relative z-10 space-y-6"
            variants={itemVariants}
          >
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button 
                  asChild 
                  className="w-full h-auto p-8 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-2xl transition-all duration-300"
                >
                  <Link to="/musika" className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-1">Explore Musika</div>
                      <div className="text-sm text-white/80">Discover authentic experiences</div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button 
                  asChild 
                  className="w-full h-auto p-8 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-2xl transition-all duration-300"
                >
                  <Link to="/abantu" className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-1">Join Watu</div>
                      <div className="text-sm text-white/80">Connect with our community</div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button 
                  asChild 
                  className="w-full h-auto p-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-xl transition-all duration-300"
                >
                  <Link to="/culture-tokens" className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-1">Golden Ticket</div>
                      <div className="text-sm text-white/90">Claim your free experience</div>
                    </div>
                    <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div 
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {[
                { number: "50K+", label: "Community Members" },
                { number: "1000+", label: "Experiences Created" },
                { number: "24", label: "African Countries" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCTA;
