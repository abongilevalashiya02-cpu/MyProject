
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Share2, 
  Users, 
  MapPin, 
  Star,
  Sparkles,
  Rocket,
  Theater,
  Globe
} from 'lucide-react';

const StampsAndFeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stampActivities = [
    {
      icon: Share2,
      title: "Share Travel Memories",
      description: "Post reviews and share your African experiences",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Social Engagement",
      description: "Connect and engage with our community platforms",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: MapPin,
      title: "Book & Travel",
      description: "Complete journeys through the Bantu Stall platform",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const whyBantuStall = [
    {
      icon: Rocket,
      title: "Africa-Centric & Globally Connected",
      description: "We celebrate African entrepreneurship and tourism while making it accessible to the world.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Theater,
      title: "People-Driven Experiences",
      description: "Travel isn't just about places; it's about the people who make them memorable.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Globe,
      title: "Empowering Gigpreneurs",
      description: "We don't just promote travel; we build economies by supporting Africa's tourism entrepreneurs.",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Stamps Section */}
          <motion.div 
            className="mb-24"
            variants={itemVariants}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
                <Gift className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium text-primary">Rewards Program</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Stamps – Earn While You 
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Experience Africa
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                At Bantu Stall, engagement is rewarding. Our Stamps incentive system lets travelers 
                and gigpreneurs earn rewards for meaningful participation in Africa's tourism ecosystem.
              </p>
            </div>

            {/* Stamps Activities */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {stampActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${activity.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <activity.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">{activity.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stamps Redemption */}
            <motion.div 
              className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 lg:p-12 text-center"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Star className="h-8 w-8 text-primary" />
                <h3 className="text-2xl lg:text-3xl font-bold">Redeem Your Stamps</h3>
                <Star className="h-8 w-8 text-primary" />
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Stamps can be redeemed across African-owned restaurants, bookstores, fashion outlets, 
                and experiences—both on the continent and globally. Supporting African businesses 
                while you explore the world.
              </p>
            </motion.div>
          </motion.div>

          {/* Why Bantu Stall Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium text-primary">Our Mission</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Why Choose 
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bantu Stall?
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {whyBantuStall.map((reason, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${reason.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <reason.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">{reason.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StampsAndFeaturesSection;
