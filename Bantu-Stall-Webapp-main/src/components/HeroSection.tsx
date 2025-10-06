import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import AnimatedTagline from './AnimatedTagline';
const HeroSection = () => {
  return <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Background Image with Modern Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="African landscape" className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-[10000ms]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bantu-orange/20 to-transparent z-0"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-5">
        <motion.div className="absolute top-20 left-10 w-2 h-2 bg-bantu-orange rounded-full" animate={{
        y: [0, -20, 0]
      }} transition={{
        duration: 3,
        repeat: Infinity
      }} />
        <motion.div className="absolute top-40 right-16 w-3 h-3 bg-white/30 rounded-full" animate={{
        y: [0, 15, 0]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        delay: 1
      }} />
        <motion.div className="absolute bottom-32 left-20 w-4 h-4 bg-bantu-orange/50 rounded-full" animate={{
        y: [0, -25, 0]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        delay: 2
      }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        {/* Logo with Enhanced Animation */}
        <motion.div className="mb-8" initial={{
        opacity: 0,
        scale: 0.5,
        rotate: -10
      }} animate={{
        opacity: 1,
        scale: 1,
        rotate: 0
      }} transition={{
        duration: 1,
        type: "spring",
        bounce: 0.5
      }}>
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg p-8 mx-auto border border-white/30 shadow-2xl">
              <img src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" alt="Bantu Stall Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            {/* Rotating Ring */}
            <motion.div className="absolute inset-0 rounded-full border-2 border-bantu-orange/30" animate={{
            rotate: 360
          }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }} />
          </div>
        </motion.div>

        {/* Enhanced Animated Tagline */}
        <div className="mb-6">
          <AnimatedTagline />
        </div>
        
        
        <motion.p className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl leading-relaxed" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1,
        duration: 0.8
      }}>Bantu Stall is a pan-African experiential learning and wellness platform that blends retreats with indigenous healing and corporate wellness. Discover curated excursions or create your own in under 3 minutes.</motion.p>

      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{
      y: [0, 10, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity
    }}>
        <div className="w-8 h-14 rounded-full border-2 border-white/40 flex justify-center backdrop-blur-sm bg-white/10">
          <motion.div className="w-1 h-3 bg-bantu-orange rounded-full mt-2" animate={{
          y: [0, 20, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }} />
        </div>
      </motion.div>
    </section>;
};
export default HeroSection;