import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection'; 
import IntroVideo from '../components/IntroVideo';
import WhyBantuStall from '../components/WhyBantuStall';
import ThreePathways from '../components/ThreePathways';
import ImpactMetrics from '../components/ImpactMetrics';
import NewsAndEvents from '../components/NewsAndEvents';
import EnhancedSEO from '../components/EnhancedSEO';
import { PerformanceOptimizer } from '../components/PerformanceOptimizer';
import { useAuth } from '@/hooks/useAuth';

const Index: React.FC = () => {
  // Use loading state from auth to prevent rendering before auth is initialized
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedSEO />
      <PerformanceOptimizer />
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <IntroVideo />
        <ThreePathways />
        <WhyBantuStall />
        <ImpactMetrics />
        <NewsAndEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
