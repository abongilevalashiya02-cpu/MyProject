
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HRGuideHero from '../components/hr-guide/HRGuideHero';
import BudgetPlanningSection from '../components/hr-guide/BudgetPlanningSection';
import IntroductionSection from '../components/hr-guide/IntroductionSection';
import ChallengesSection from '../components/hr-guide/ChallengesSection';
import SolutionsSection from '../components/hr-guide/SolutionsSection';
import CallToActionSection from '../components/hr-guide/CallToActionSection';

const HRGuide = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HRGuideHero />
        <BudgetPlanningSection />
        <IntroductionSection />
        <ChallengesSection />
        <SolutionsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default HRGuide;
