import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionsProps {
  children: React.ReactNode;
  pageKey: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.5
};

const slideUpVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -30
  }
};

const fadeVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

export const PageTransition: React.FC<PageTransitionsProps> = ({ children, pageKey }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideUpTransition: React.FC<PageTransitionsProps> = ({ children, pageKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideUpVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeTransition: React.FC<PageTransitionsProps> = ({ children, pageKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Staggered container for list items
export const StaggerContainer: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0.1 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Individual item for staggered animations
export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Loading skeleton animation
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 100%"
      }}
    />
  );
};

// Smooth reveal animation for cards
export const CardReveal: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -15,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};
