import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CaseStudies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our detailed case study showcasing how Bantu Stall curated a personalized luxury experience for an American couple at a health resort in Johannesburg's prestigious Houghton neighborhood.
            </p>
          </motion.div>

          {/* Featured Case Study */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="h-64 lg:h-auto">
            <img 
              src="/lovable-uploads/57e47bec-3316-4e9c-aa82-9b15cf607324.png" 
              alt="Luxury health resort with pool and stone architecture" 
              className="w-full h-full object-cover"
            />
              </div>
              <div className="p-8">
                <div className="text-sm text-primary font-medium mb-2">Nov 28 – Dec 5, 2024</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Curating Personalized Luxury Experiences at a Health Resort
                </h3>
                <p className="text-muted-foreground mb-6">
                  An interracial couple from the United States experienced their most unique and customized journey in South Africa through our luxury health resort partnership in Johannesburg's prestigious Houghton neighborhood.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Cultural Immersion</h4>
                      <p className="text-sm text-muted-foreground">Visited Igugu Primary School in Soweto and dined at Native Rebel restaurant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Wellness & Luxury</h4>
                      <p className="text-sm text-muted-foreground">Personalized concierge service, custom culinary experiences, and holistic treatments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Unique Experiences</h4>
                      <p className="text-sm text-muted-foreground">Highest Bar in Africa, TEDx Event, and startup networking opportunities</p>
                    </div>
                  </div>
                </div>
                <a 
                  href="/case-study/luxury-health-resort"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
                >
                  Read Full Case Study
                </a>
              </div>
            </div>
          </motion.div>

          {/* Second Case Study */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="h-64 lg:h-auto">
                <img 
                  src="/images/forbes-under-30-botswana.jpg" 
                  alt="Forbes Under 30 Summit Africa welcome sign in Botswana showing event branding and preparation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="text-sm text-primary font-medium mb-2">2022 Case Study Analysis</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Solving for Experience: A Case Study in Event Readiness
                </h3>
                <p className="text-muted-foreground mb-6">
                  An analysis of the 2022 Forbes Under 30 Summit in Botswana reveals critical gaps in operational readiness for international events, and how Bantu Stall's strategic blueprint addresses these challenges.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Horo Concierge Service</h4>
                      <p className="text-sm text-muted-foreground">High-touch, human-powered concierge eliminating communication barriers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Musika Digital Marketplace</h4>
                      <p className="text-sm text-muted-foreground">Curated platform with centralized payment gateway for seamless transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-foreground">Watu Community Network</h4>
                      <p className="text-sm text-muted-foreground">Vetted Gigpreneur network trained for professional service delivery</p>
                    </div>
                  </div>
                </div>
                <a 
                  href="/case-study/event-readiness"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
                >
                  Read Full Case Study
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Ready to Create Your Own Success Story?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of individuals and organizations who have transformed their approach to African cultural engagement and business development.
              </p>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Get Started Today
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default CaseStudies;