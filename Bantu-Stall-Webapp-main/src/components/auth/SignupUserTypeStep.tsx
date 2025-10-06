import React from 'react';
import { motion } from 'framer-motion';

// Simplified signup step without user type selection
const SignupUserTypeStep: React.FC = () => {
  return (
    <section className="py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Welcome to Bantu Stall</h2>
        <p className="text-white/80 mb-6">Complete your registration to get started with your African journey.</p>
      </motion.div>
    </section>
  );
};

export default SignupUserTypeStep;
