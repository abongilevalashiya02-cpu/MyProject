
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageSEO from '../components/PageSEO';
import AboutHero from '../components/about/AboutHero';
import AboutMainContent from '../components/about/AboutMainContent';
import UserTypeSelector from '../components/UserTypeSelector';
import GigrepreursSection from '../components/about/GigrepreursSection';
import StampsAndFeaturesSection from '../components/about/StampsAndFeaturesSection';
import AboutCTA from '../components/about/AboutCTA';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSEO
        title="About Bantu Stall | Pan-African Travel & Business Platform"
        description="Discover Bantu Stall, the premier platform connecting travelers and businesses with authentic African experiences. From Cape Town to Lagos, Nairobi to Accra, we bridge cultures and create meaningful connections across Africa."
        keywords={[
          'about bantu stall',
          'pan-african travel platform',
          'african business network',
          'authentic african experiences',
          'cape town travel',
          'lagos business',
          'nairobi experiences',
          'accra adventures',
          'african culture connection',
          'cross-border african travel',
          'bantu stall story',
          'african tourism platform'
        ]}
        canonicalUrl="https://bantustall.com/about"
        breadcrumbs={[
          { name: 'Home', url: 'https://bantustall.com/' },
          { name: 'About', url: 'https://bantustall.com/about' }
        ]}
        type="website"
        locale="en"
        region="ZA"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Bantu Stall",
          "alternateName": "Bantu Stall Platform",
          "description": "Pan-African travel and business platform connecting authentic experiences across Africa",
          "url": "https://bantustall.com",
          "logo": "https://bantustall.com/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png",
          "foundingDate": "2023",
          "founder": {
            "@type": "Organization",
            "name": "Bantu Stall Founders"
          },
          "areaServed": [
            {
              "@type": "Country",
              "name": "South Africa"
            },
            {
              "@type": "Country", 
              "name": "Nigeria"
            },
            {
              "@type": "Country",
              "name": "Kenya"
            },
            {
              "@type": "Country",
              "name": "Ghana"
            }
          ],
          "knowsAbout": [
            "African Travel Experiences",
            "Business Networking in Africa",
            "Cultural Tourism",
            "Corporate Retreats",
            "Cross-border African Business"
          ],
          "sameAs": [
            "https://bantustall.com/about"
          ]
        })}
      </script>
      <motion.div 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AboutHero />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AboutMainContent />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <HowItWorks />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <UserTypeSelector />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <GigrepreursSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <StampsAndFeaturesSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FAQ />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AboutCTA />
      </motion.div>
        <Footer />
      </motion.div>
    </>
  );
};

export default About;
