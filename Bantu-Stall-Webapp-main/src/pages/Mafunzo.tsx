import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Map, Users, Compass, BookOpen, Award, ArrowRight, Play, Star, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Mafunzo = () => {
  return (
    <div className="min-h-screen bg-[#fef7f4] relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-bantu-orange/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-bantu-yellow/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#9b7540] via-[#d4a861] to-[#e6b873] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern"></div>
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm px-4 py-2 text-sm font-medium">
                <GraduationCap className="w-4 h-4 mr-2" />
                Transform Through Travel
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Horo Learning Hub
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Discover Africa through immersive learning experiences designed to deepen your understanding of culture, develop leadership skills, and build meaningful connections.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button asChild size="lg" className="group bg-white text-[#9b7540] hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/mafunzo/dashboard">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { number: "50+", label: "Courses Available" },
                { number: "10K+", label: "Students Enrolled" },
                { number: "25", label: "Countries Covered" },
                { number: "95%", label: "Completion Rate" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 left-20 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float-delayed"></div>
      </section>

      {/* Learning Themes */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-bantu-orange/10 text-bantu-orange border-none px-4 py-2">
            Core Learning Themes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Transformative Learning Pathways
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Our curriculum is built around three fundamental pillars that will enrich your travel experience and personal growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Cultural Immersion",
              description: "Deepen your understanding of African cultures, traditions, languages, and histories through guided learning.",
              icon: <Compass className="h-12 w-12 mb-6 text-bantu-orange" />,
              features: ["Traditional Arts", "Language Basics", "Historical Context", "Cultural Etiquette"],
              color: "from-orange-500/10 to-amber-500/10",
              iconBg: "bg-orange-500/10"
            },
            {
              title: "Leadership Development",
              description: "Develop cross-cultural leadership skills that help you navigate diverse environments with confidence.",
              icon: <Users className="h-12 w-12 mb-6 text-blue-600" />,
              features: ["Cross-Cultural Communication", "Ethical Leadership", "Conflict Resolution", "Community Engagement"],
              color: "from-blue-500/10 to-cyan-500/10",
              iconBg: "bg-blue-500/10"
            },
            {
              title: "Team Building",
              description: "Learn to create meaningful connections and collaborate effectively across cultural boundaries.",
              icon: <Award className="h-12 w-12 mb-6 text-emerald-600" />,
              features: ["Group Dynamics", "Trust Building", "Collaborative Projects", "Intercultural Teamwork"],
              color: "from-emerald-500/10 to-teal-500/10",
              iconBg: "bg-emerald-500/10"
            }
          ].map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className={`card-hover h-full bg-gradient-to-br ${theme.color} border-0 shadow-lg hover:shadow-xl transition-all duration-500`}>
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`${theme.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {theme.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{theme.title}</h3>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{theme.description}</p>
                  <div className="space-y-3">
                    {theme.features.map((feature, j) => (
                      <motion.div 
                        key={j} 
                        className="flex items-center text-sm font-medium text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i * 0.2) + (j * 0.1), duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid-pattern"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-bantu-yellow/10 text-bantu-yellow border-none px-4 py-2">
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Comprehensive Learning Tools
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Our platform combines interactive learning with practical travel planning to create a seamless experience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-10">
                {[
                  {
                    icon: <BookOpen className="h-7 w-7 text-bantu-orange" />,
                    title: "Interactive Courses",
                    description: "Engage with multimedia content including videos, readings, quizzes, and interactive exercises designed by cultural experts.",
                    color: "bg-orange-500/10 border-orange-200"
                  },
                  {
                    icon: <Map className="h-7 w-7 text-blue-600" />,
                    title: "Itinerary Builder",
                    description: "Create your perfect journey by integrating experiences from our marketplace directly into your customized travel plan.",
                    color: "bg-blue-500/10 border-blue-200"
                  },
                  {
                    icon: <GraduationCap className="h-7 w-7 text-emerald-600" />,
                    title: "Progress Tracking",
                    description: "Monitor your advancement through courses, earn certifications, and showcase your achievements with digital badges.",
                    color: "bg-emerald-500/10 border-emerald-200"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    className="flex gap-6 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <div className={`flex-shrink-0 ${feature.color} p-4 rounded-2xl border transition-all duration-300 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                    alt="Mafunzo Learning Platform" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Progress Card */}
                <motion.div 
                  className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-w-64"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-900">Course Progress</span>
                    <span className="text-bantu-orange font-bold text-lg">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div 
                      className="bg-gradient-to-r from-bantu-orange to-bantu-yellow h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '68%' }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>2 hours remaining</span>
                  </div>
                </motion.div>

                {/* Rating Card */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">4.9</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-bantu-orange/10 via-bantu-yellow/10 to-orange-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-bantu-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-bantu-yellow/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-bantu-orange/20 text-bantu-orange border-none px-4 py-2">
              Begin Your Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Ready to Transform Your Travel Experience Through Learning?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
              Start your learning journey today and discover how cultural understanding can enhance your travels across Africa.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-bantu-orange to-bantu-yellow hover:from-bantu-orange/90 hover:to-bantu-yellow/90 px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link to="/mafunzo/dashboard">
                  Access Learning Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Mafunzo;
