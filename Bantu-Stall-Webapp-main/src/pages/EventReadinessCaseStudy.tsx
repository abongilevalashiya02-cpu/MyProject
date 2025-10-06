import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EventReadinessCaseStudy = () => {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/case-studies" 
              className="text-primary hover:underline mb-8 inline-block"
            >
              ← Back to Case Studies
            </Link>
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Solving for Experience: A Case Study in Event Readiness
              </h1>
              <p className="text-xl text-muted-foreground">
                An analysis of the 2022 Forbes Under 30 Summit in Botswana reveals critical gaps in operational readiness for international events, and how Bantu Stall's strategic blueprint addresses these challenges.
              </p>
            </div>

            <div className="mb-8">
              <img 
                src="/images/forbes-under-30-botswana.jpg" 
                alt="Forbes Under 30 Summit Africa welcome sign in Botswana showing event branding and preparation" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                The success of any international summit or conference is measured not only by its content but by the experience of its guests. When guests from around the globe converge on a host city, every detail—from the ease of a transaction to the warmth of a welcome—becomes a reflection of the host nation's brand.
              </p>
              
              <p className="text-muted-foreground mb-6">
                The 2022 Forbes Under 30 Summit in Botswana provided a valuable case study in the challenges that can arise when a host ecosystem is not fully prepared for a sophisticated international audience. The issues, while seemingly minor, collectively represented a profound gap in operational readiness.
              </p>

              <h2 className="text-3xl font-semibold text-foreground mb-6 mt-12">
                The Challenge: A Breakdown in the Guest Journey
              </h2>

              <div className="space-y-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Digital Disconnect</h3>
                  <p className="text-muted-foreground">
                    Guests found that local businesses closed too early and their online information, particularly on platforms like Google, was outdated. This led to frustration and a sense of being disconnected from the local economy.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Human Capital Gaps</h3>
                  <p className="text-muted-foreground">
                    A discernible accent barrier and the absence of a clear protocol for escalating queries left guests feeling their concerns were not being addressed with the genuine care they expected.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Financial Friction</h3>
                  <p className="text-muted-foreground">
                    A significant number of local vendors were unable to accept card payments, a fundamental expectation for modern international travelers. This resulted in a direct loss of revenue for local businesses and a major inconvenience for guests.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-8">
                These problems pointed to a clear need for a strategic, high-touch solution that could bridge the gap between a host city's potential and its operational reality.
              </p>

              <h2 className="text-3xl font-semibold text-foreground mb-6 mt-12">
                The Bantu Stall Solution: A Strategic Blueprint for Seamless Hospitality
              </h2>

              <p className="text-muted-foreground mb-6">
                Bantu Stall's mission-driven platform is purpose-built to solve these very challenges, transforming event-based risks into opportunities for excellence. Our model moves beyond mere logistics to provide a curated, human-powered concierge service that ensures every aspect of the guest experience is flawless.
              </p>

              <p className="text-muted-foreground mb-8">
                Our solution is a three-pillar ecosystem, designed to address the specific pain points of the Gaborone summit:
              </p>

              <div className="space-y-8 mb-8">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Horo (The Bespoke Concierge Service)
                  </h3>
                  <p className="text-muted-foreground">
                    To counter the lack of a clear escalation protocol and the human capital gaps, our Horo platform provides a high-touch, human-powered concierge service. We manage all aspects of a delegation's or individual's visit, from custom itineraries to executive transport, ensuring a single, trusted point of contact for all needs. This high-touch approach eliminates communication barriers and provides guests with the confidence that their needs are being met with meticulous care and professionalism.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Musika (The Curated Digital Marketplace)
                  </h3>
                  <p className="text-muted-foreground">
                    We address the digital and financial friction head-on. Our online marketplace, Musika, is a single, trusted hub where a "curated and verified" selection of African experiences, venues, and service providers are brought to life. This solves the problem of outdated online business information by providing a central, meticulously vetted resource. Furthermore, all bookings and transactions are facilitated through a modern, centralized digital payment gateway, ensuring seamless, cashless transactions for all guests and eliminating lost revenue opportunities for vendors.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Watu (The Community and Empowerment Hub)
                  </h3>
                  <p className="text-muted-foreground">
                    Our "Gigpreneur" network of local hosts, curators, and storytellers is not only vetted for quality but also trained to a high standard of professional service delivery. This focus on a culture of hospitality and empowerment directly solves for the problem of personnel unprepared to handle problems. The Stamps loyalty program further cultivates this ecosystem by creating a network that extends beyond a single trip, encouraging lasting connections and repeat business within the community of local African businesses.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-8">
                By leveraging a service-first approach, we prioritize building a trusted network of relationships over speculative technology. The core of our product is not an application, but a vetted database of exceptional partners, ready to deliver authentic, high-quality experiences.
              </p>

              <h2 className="text-3xl font-semibold text-foreground mb-6 mt-12">
                The Result: A Legacy of Excellence
              </h2>

              <p className="text-muted-foreground mb-8">
                By partnering with Bantu Stall, event hosts can transform a potential logistical liability into a generational opportunity to showcase a world-class, authentic, and economically impactful brand. We fill the critical service gap between standard logistics and deeply curated experiences, ensuring that every guest's journey is not just a visit, but a transformative and memorable connection to the host continent.
              </p>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 mt-12">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Ready to Transform Your Event Experience?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Learn how Bantu Stall can help you deliver world-class hospitality and create lasting impressions for your international guests.
                </p>
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Get Started Today
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default EventReadinessCaseStudy;