import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CaseStudyDetail = () => {
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
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case Studies
            </Link>

            <div className="mb-8">
              <div className="text-sm text-primary font-medium mb-2">Nov 28 – Dec 5, 2024</div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Curating Personalized Luxury Experiences at a Health Resort Listed on Bantu Stall
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Pertunia Leballo (Article Owner)</span>
                <span>•</span>
                <span>Yolisa Maluleka (Resort Owner - Black Female Leader in Tourism)</span>
              </div>
            </div>

            <div className="mb-8">
              <img 
                src="/lovable-uploads/57e47bec-3316-4e9c-aa82-9b15cf607324.png"
                alt="Luxury health resort with pool and stone architecture"
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-6">
                In collaboration with our service providers, Bantu Stall recently had the privilege of curating a deeply personal and luxurious experience for an interracial couple visiting South Africa for the third time. Previously, they had explored typical tourist attractions in the country, but this experience stood out as the most unique and customized journey of their travels.
              </p>
              <p className="text-muted-foreground mb-8">
                The couple, originally from the United States, had little knowledge of their African roots but were eager to explore and connect with the continent. Their journey began at a health resort listed on Bantu Stall, located in Houghton, one of Johannesburg's most prestigious neighborhoods. This luxurious retreat offers an earthy, African allure with design elements that draw from traditional rock paintings and natural aesthetics, making guests feel at one with the surrounding ecosystem.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Client Profile</h2>
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Background:</strong> The couple is from the United States. The man had little knowledge of his African roots, while his partner, an American, was eager to learn more about Africa, especially its culture and history.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Goals:</strong> Their main objective was to immerse themselves in authentic African culture while enjoying a rejuvenating, luxurious getaway.
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-6">The Experience at the Health Resort</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <img 
                  src="/lovable-uploads/d69c64c4-9058-4ed2-a4ff-cf45ae731d4c.png"
                  alt="Luxury spa wellness area with modern bathtub and ambient lighting"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <img 
                  src="/lovable-uploads/634433e1-adb4-4f0e-8591-628284003043.png"
                  alt="Spa wellness experience with stone wall backdrop"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">Personalized Arrival & Concierge Service</h3>
              <p className="text-muted-foreground mb-6">
                Upon arrival, the couple was welcomed by a personalized concierge service. They were picked up from the airport and transferred to the resort, where every detail was arranged to ensure they felt special from the start. The resort's dedicated team ensured that their stay was seamless, offering comfort and exceptional service from the moment they stepped foot on South African soil.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">Customized Culinary Experience</h3>
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/83ca3e96-48e5-42ce-b9a7-9ecfcf42d908.png"
                  alt="Elegant restaurant dining area"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-muted-foreground">
                  The resort offers personalized chefs who craft meals based on dietary preferences and special requests. For this couple, a welcome dinner was prepared that reflected both their taste preferences and a blend of local South African cuisine. Throughout their stay, their meals were custom-created to suit their tastes, providing a truly personal touch and a culinary journey they could savor.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">Holistic Wellness and Relaxation</h3>
              <p className="text-muted-foreground mb-6">
                One of the resort's standout features is its tuck-in experience, which includes a luxurious milk bath with custom salts designed to enhance relaxation. The couple chose their preferred salts to ensure a soothing and calming experience. After their bath, the couple enjoyed a therapeutic massage, which helped them unwind and prepare for a restful night's sleep.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">Holistic Health and Well-being</h3>
              <p className="text-muted-foreground mb-8">
                During their stay, the woman fell ill with flu-like symptoms. The resort's concierge health service promptly arranged for a doctor to assess her condition and provide the necessary medical attention, ensuring her comfort and peace of mind. The resort's concierge doctors, therapists, and health specialists are available on-call, which ensured that the couple's wellness was never compromised during their stay.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">Cultural Immersion and Unique Experiences</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <img 
                  src="/lovable-uploads/94506cec-cbc4-432c-a596-9fe7488bf874.png"
                  alt="Traditional drumming cultural experience"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <img 
                  src="/lovable-uploads/63c9f44d-de14-4831-807a-f2bbb5926a2b.png"
                  alt="Local community interaction"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground">
                  The couple embarked on a journey to explore Johannesburg and its surrounding areas, visiting all major tourist sites and engaging in unique cultural experiences.
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• They visited Igugu Primary School in Soweto, where Bantu Stall has been involved in refurbishing a library and playground. This impact project allowed the couple to connect with local communities and witness firsthand the positive changes being made.</li>
                  <li>• They dined at Native Rebel, a Black-owned restaurant deep in Soweto, offering an authentic immersion into the vibrant local culture away from tourist hotspots.</li>
                  <li>• The couple also experienced the Highest Bar in Africa, attended a TEDx Event, and participated in a startup meet-up organized by Bantu Stall for the man's app users, providing an opportunity for networking and community building.</li>
                </ul>
              </div>

              <div className="mb-6">
                <img 
                  src="/lovable-uploads/9e012e62-a661-40c0-a428-f0980643b288.png"
                  alt="TEDx MaudeStreet event group photo"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4 mb-8">
                <ul className="text-muted-foreground space-y-2">
                </ul>
              </div>

              <div className="mb-8">
                <img 
                  src="/lovable-uploads/5787d4d5-b5d0-4553-be6a-dda6c40bc68b.png"
                  alt="Luxury pool and relaxation area"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Outcomes and Impact</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Cultural Connection</h3>
                  <p className="text-muted-foreground">
                    The couple left South Africa with a profound connection to both the culture and the rhythm of the continent, particularly through their immersive experiences in Soweto and engagement with local initiatives.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Wellness and Personal Care</h3>
                  <p className="text-muted-foreground">
                    The personalized wellness treatments and prompt medical attention ensured their stay was both relaxing and health-conscious.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Memorable Relaxation</h3>
                  <p className="text-muted-foreground">
                    The customized luxury experience at the health resort, combined with cultural immersion and unique activities, left the couple feeling pampered, rejuvenated, and enriched by their South African adventure.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Conclusion</h2>
              <p className="text-muted-foreground mb-6">
                This case study exemplifies how Bantu Stall's platform enables exceptional, tailored experiences that go beyond standard tourism offerings. From luxurious wellness services and personalized culinary journeys to culturally immersive experiences and impactful community engagements, Bantu Stall helps create unforgettable moments that speak to each guest's unique preferences.
              </p>
              <p className="text-muted-foreground">
                Bantu Stall's commitment to partnering with Black-owned and woman-owned establishments across Africa ensures that travelers receive world-class services while supporting local ownership and sustainable tourism. By validating and promoting these extraordinary experiences, Bantu Stall celebrates native resources and enhances international recognition for these hidden gems in African tourism.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default CaseStudyDetail;
