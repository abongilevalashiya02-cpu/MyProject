
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthContainer from '@/components/auth/AuthContainer';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Enhanced Background */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
            alt="African marketplace" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bantu-orange/20 via-black/60 to-black/80"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5">
          <motion.div 
            className="absolute top-20 left-10 w-3 h-3 bg-bantu-orange/60 rounded-full"
            animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-40 right-16 w-2 h-2 bg-white/40 rounded-full"
            animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-32 left-20 w-4 h-4 bg-bantu-orange/40 rounded-full"
            animate={{ y: [0, -25, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Auth Container */}
        <div className="relative z-10">
          <AuthContainer />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
