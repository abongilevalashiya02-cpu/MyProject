
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CultureTokensHero from '../components/culture-tokens/CultureTokensHero';
import HowItWorksTokens from '../components/culture-tokens/HowItWorksTokens';
import RedeemTokens from '../components/culture-tokens/RedeemTokens';
import FeaturedTravelers from '../components/culture-tokens/FeaturedTravelers';
import VendorCTA from '../components/culture-tokens/VendorCTA';
import TokensFAQ from '../components/culture-tokens/TokensFAQ';
import GoldenTicket from '../components/culture-tokens/GoldenTicket';

const CultureTokens: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CultureTokensHero />
        <HowItWorksTokens />
        <RedeemTokens />
        <GoldenTicket />
        <FeaturedTravelers />
        <VendorCTA />
        <TokensFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default CultureTokens;
