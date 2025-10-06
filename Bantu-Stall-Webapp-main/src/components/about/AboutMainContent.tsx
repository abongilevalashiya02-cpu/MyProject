import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, Store, GraduationCap, Users, ArrowRight, Star } from 'lucide-react';
import RatingsExplanation from '../ratings/RatingsExplanation';

const AboutMainContent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Statement */}
          <motion.div 
            className="text-center mb-20"
            variants={itemVariants}
          >
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium text-primary">Our Story</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1]">
                More Than a Travel Platform—
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mt-2">
                  It's a Movement
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                We are building Africa's first experiential learning, tourism, and networking hub, 
                designed to ignite trade between travel agencies, hosts, and independent service 
                providers across the continent.
              </p>
            </div>
          </motion.div>

          {/* Vision Section */}
          <motion.div 
            className="mb-24"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl"></div>
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardContent className="p-12 lg:p-16">
                  <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                          <Globe className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold">Our Vision</h2>
                      </div>
                      
                      <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8">
                        We believe that Africa's tourism potential lies in its people—the entrepreneurs, 
                        creatives, and culture bearers shaping authentic experiences. Through Bantu Stall, 
                        we are bridging travelers with Africa's vibrant culture & energy.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          "Authentic Experiences",
                          "Local Entrepreneurs", 
                          "Cultural Connection",
                          "Vibrant Communities"
                        ].map((item, index) => (
                          <div key={index} className="text-center p-4 bg-white/60 rounded-xl border border-muted/30">
                            <div className="text-2xl font-bold text-primary mb-1">{index + 1}K+</div>
                            <div className="text-sm font-medium text-muted-foreground">{item}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-20 blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
                          <div className="text-center space-y-4">
                            <div className="text-4xl font-bold text-primary">500+</div>
                            <div className="text-lg font-medium">Experiences Created</div>
                            <div className="text-4xl font-bold text-secondary">24</div>
                            <div className="text-lg font-medium">African Countries</div>
                            <div className="text-4xl font-bold text-primary">95%</div>
                            <div className="text-lg font-medium">Satisfaction Rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Three powerful platforms working together to transform how you experience Africa
            </p>
          </motion.div>

          {/* Platform Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: Store,
                number: "01",
                title: "Musika",
                subtitle: "Experience Marketplace",
                description: "Where Africa's experiences, venues, and service providers come alive through curated marketplaces and authentic connections.",
                features: [
                  "Ready-to-host venues",
                  "Curated service providers",
                  "Immersive experiences",
                  "Cultural storytellers"
                ],
                gradient: "from-emerald-400 to-teal-600",
                bgGradient: "from-emerald-50 to-teal-50"
              },
              {
                icon: GraduationCap,
                number: "02", 
                title: "Horo",
                subtitle: "Learning Hub",
                description: "Custom learning meets curated travel through transformative journeys designed for personal and professional growth.",
                features: [
                  "Leadership journeys",
                  "Custom team retreats",
                  "Cultural intelligence",
                  "Wellness outcomes"
                ],
                gradient: "from-blue-400 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50"
              },
              {
                icon: Users,
                number: "03",
                title: "Watu", 
                subtitle: "Community Hub",
                description: "Where connections continue beyond the retreat through AI-powered networking and exclusive member experiences.",
                features: [
                  "AI accountability",
                  "Member events",
                  "Exclusive gatherings",
                  "Business networking"
                ],
                gradient: "from-purple-400 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              }
            ].map((platform, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="relative h-full border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.bgGradient} opacity-50`}></div>
                  <CardContent className="relative p-8 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-r ${platform.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <platform.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className={`text-6xl font-black bg-gradient-to-r ${platform.gradient} bg-clip-text text-transparent opacity-30`}>
                        {platform.number}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{platform.title}</h3>
                    <p className={`text-lg font-semibold bg-gradient-to-r ${platform.gradient} bg-clip-text text-transparent mb-4`}>
                      {platform.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                      {platform.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`w-2 h-2 bg-gradient-to-r ${platform.gradient} rounded-full`}></div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                      <span>Explore {platform.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Ratings Section */}
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={itemVariants}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Rating System</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Our unique 5-point rating system helps you understand exactly what to expect from your African journey. 
                Each experience is evaluated across multiple dimensions for complete transparency.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              {/* Example Rating Display */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold mb-8 text-center">Example Rating</h3>
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                  <div className="flex items-center justify-center gap-3 text-3xl font-mono font-bold">
                    <span>5⭐</span>
                    <span>3💰</span>
                    <span className="text-muted-foreground">|</span>
                    <span>3🍃</span>
                    <span>3🛡️</span>
                    <span>4🛋️</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    This rating shows a luxury experience (5⭐) that's moderately priced (3💰) with good 
                    eco-friendliness (3🍃), authentic cultural depth (3🛡️), and high comfort (4🛋️).
                  </p>
                </div>
              </div>

              {/* Rating Explanation Grid */}
              <div className="space-y-6">
                {[
                  {
                    icon: "⭐",
                    title: "Luxury Rating",
                    description: "Premium experience level with finer amenities and personalized services",
                    color: "from-yellow-400 to-orange-500"
                  },
                  {
                    icon: "💰",
                    title: "Budget-Friendly",
                    description: "Value for money rating - higher numbers mean more affordable options",
                    color: "from-green-400 to-emerald-500"
                  },
                  {
                    icon: "🍃",
                    title: "Eco-Friendly",
                    description: "Environmental sustainability and responsible tourism practices",
                    color: "from-green-500 to-teal-600"
                  },
                  {
                    icon: "🛡️",
                    title: "Cultural Depth",
                    description: "Authenticity and cultural immersion level of the experience",
                    color: "from-blue-400 to-indigo-600"
                  },
                  {
                    icon: "🛋️",
                    title: "Comfort Level",
                    description: "Physical comfort and convenience throughout your journey",
                    color: "from-purple-400 to-pink-600"
                  }
                ].map((rating, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-r ${rating.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {rating.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-2">{rating.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{rating.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Guidelines */}
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center">How to Use Our Ratings</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    number: "1-2",
                    label: "Basic",
                    description: "Entry-level experience with essential features"
                  },
                  {
                    number: "3",
                    label: "Good",
                    description: "Well-balanced experience meeting expectations"
                  },
                  {
                    number: "4",
                    label: "Excellent",
                    description: "Above-average quality with notable highlights"
                  },
                  {
                    number: "5",
                    label: "Outstanding",
                    description: "Premium, exceptional experience in this category"
                  }
                ].map((guide, index) => (
                  <div key={index} className="text-center p-6 bg-white/80 rounded-2xl">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                      {guide.number}
                    </div>
                    <h4 className="font-bold mb-2">{guide.label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guide.description}</p>
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

export default AboutMainContent;