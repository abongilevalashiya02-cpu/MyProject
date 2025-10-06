import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Zap, Network, Star, ArrowRight, CheckCircle, Quote, Heart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Abantu = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    // In a real app, this would open an application form
    alert('Application form would open here');
  };

  const handleLogin = () => {
    // For demo purposes, navigate to the dashboard directly
    navigate('/abantu/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-bantu-orange/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
               }}></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid-pattern"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
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
                  <Users className="w-4 h-4 mr-2" />
                  Exclusive Community
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="font-bold text-5xl md:text-7xl text-white mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Watu Community
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                An invite-only network for validated business owners, traders, and travelers across Africa. Connect, collaborate, and grow together.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button 
                  onClick={handleApply}
                  className="group bg-gradient-to-r from-bantu-orange to-bantu-yellow hover:from-bantu-orange/90 hover:to-bantu-yellow/90 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply to Join
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={handleLogin}
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg py-6 px-8"
                >
                  Log In
                </Button>
              </motion.div>

              {/* Community Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {[
                  { number: "2,500+", label: "Active Members" },
                  { number: "54", label: "African Countries" },
                  { number: "15K+", label: "Business Connections" },
                  { number: "98%", label: "Trust Rating" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-white">{stat.number}</div>
                    <div className="text-sm opacity-80 text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float-delayed"></div>
        </section>

        {/* Benefits Section */}
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
              <Badge className="mb-4 bg-blue-50 text-blue-600 border-none px-4 py-2">
                Community Benefits
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Join Watu
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Experience the power of authentic connections across Africa's most dynamic business community.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Trusted Connections",
                  description: "Connect with verified business owners, travelers, and trade experts across Africa.",
                  icon: <Shield className="h-12 w-12 text-blue-600" />,
                  color: "from-blue-500/10 to-cyan-500/10",
                  iconBg: "bg-blue-500/10"
                },
                {
                  title: "Unique Opportunities",
                  description: "Access exclusive events, business deals, and cross-border trade networks.",
                  icon: <Zap className="h-12 w-12 text-emerald-600" />,
                  color: "from-emerald-500/10 to-teal-500/10",
                  iconBg: "bg-emerald-500/10"
                },
                {
                  title: "Knowledge Sharing",
                  description: "Gain insights from themed discussion groups and expert-led workshops.",
                  icon: <Network className="h-12 w-12 text-purple-600" />,
                  color: "from-purple-500/10 to-pink-500/10",
                  iconBg: "bg-purple-500/10"
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className={`card-hover h-full bg-gradient-to-br ${benefit.color} border-0 shadow-lg hover:shadow-xl transition-all duration-500`}>
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <div className={`${benefit.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {benefit.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 flex-grow leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-none px-4 py-2">
                Member Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Hear From Our Members
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Real stories from entrepreneurs and travelers who've found success through the Watu community.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "Abantu has transformed how I do business across borders. The connections I've made are invaluable.",
                  author: "Amara Okafor",
                  role: "Fashion Entrepreneur, Nigeria",
                  rating: 5,
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: "The themed discussion groups provide insights I couldn't find anywhere else. It's like having mentors from all over Africa.",
                  author: "David Mwangi",
                  role: "Tech Startup Founder, Kenya",
                  rating: 5,
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-6">
                        <Quote className="h-8 w-8 text-blue-500 mr-3" />
                        <div className="flex">
                          {Array.from({ length: testimonial.rating }).map((_, j) => (
                            <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{testimonial.author}</p>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-purple-50 text-purple-600 border-none px-4 py-2">
                Common Questions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Everything you need to know about joining and participating in the Watu community.
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              {[
                {
                  question: "How do I qualify to join Abantu?",
                  answer: "Abantu is open to verified business owners, professional traders, and frequent travelers across Africa. Our application process verifies your identity and professional background.",
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  question: "Is there a membership fee?",
                  answer: "We offer tiered membership options, including a basic free membership and premium tiers with advanced networking features.",
                  icon: <Heart className="h-6 w-6 text-red-500" />
                },
                {
                  question: "How are members vetted?",
                  answer: "We use a combination of identity verification, professional recommendations, and background checks to ensure our community remains trusted and valuable.",
                  icon: <Shield className="h-6 w-6 text-blue-500" />
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                >
                  <Card className="mb-6 border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-gray-50 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          {faq.icon}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleApply}
                  className="group bg-gradient-to-r from-bantu-orange to-bantu-yellow hover:from-bantu-orange/90 hover:to-bantu-yellow/90 px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply to Join
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Abantu;
