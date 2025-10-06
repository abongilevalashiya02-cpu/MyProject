
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Camera, 
  ChefHat, 
  Music, 
  Calendar, 
  Heart, 
  Car, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const GigrepreursSection = () => {
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

  const gigpreneurCategories = [
    {
      icon: Users,
      title: "Tour Guides & Experience Creators",
      description: "Cultural historians, adventure specialists, immersive experience designers, translators",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Music,
      title: "Performers & MCs",
      description: "Gumboots dancers, brass bands, poets & spoken word artists, traditional musicians, cultural choirs",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Calendar,
      title: "Event Planners & Hospitality Experts",
      description: "Wedding coordinators, retreat organizers, bespoke travel concierges",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Camera,
      title: "Photographers & Content Creators",
      description: "Travel documentarians, social media strategists, drone operators",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: ChefHat,
      title: "Culinary Experts",
      description: "Private chefs, food tour guides, mixologists",
      gradient: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Heart,
      title: "Wellness & Lifestyle Professionals",
      description: "Yoga instructors, massage therapists, personal trainers",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Car,
      title: "Transport & Logistics Providers",
      description: "Private drivers, local fixers, unique transport service providers",
      gradient: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-50"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium text-primary">Gigpreneur Network</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Empowering Africa's 
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tourism Entrepreneurs
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              The heart of Bantu Stall is its gigpreneurs—independent professionals who trade their time and 
              skills to craft authentic, local experiences. We're shaping Africa's tourism gig economy.
            </p>
          </motion.div>

          {/* Gigpreneur Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {gigpreneurCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 leading-tight">{category.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">Digital Empowerment Promise</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                We digitally empower these professionals, ensuring they thrive in Africa's tourism industry 
                through booking support, enhanced visibility, and access to a global market of travelers 
                seeking authentic experiences.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { number: "10K+", label: "Active Gigpreneurs" },
                  { number: "50", label: "African Cities" },
                  { number: "95%", label: "Success Rate" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GigrepreursSection;
