import React, { useState } from 'react';
import { motion } from 'framer-motion';

const IntroVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-bantu-orange to-gray-800 bg-clip-text text-transparent">
            What is Bantu Stall?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our introduction to see how Bantu Stall connects you with authentic African experiences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {!isPlaying ? (
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50 cursor-pointer group"
              onClick={handlePlayVideo}
            >
              <img
                src="https://img.youtube.com/vi/EAtnjo_5TzU/maxresdefault.jpg"
                alt="Bantu Stall Introduction Video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-primary ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/EAtnjo_5TzU?autoplay=1&rel=0"
                title="Bantu Stall Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default IntroVideo;