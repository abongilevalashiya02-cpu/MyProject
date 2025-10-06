import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Target, BookOpen, ArrowRight, Plus, 
  Users, Calendar, MapPin, Star, Bookmark, CheckCircle,
  TrendingUp, Award, Clock, Bell
} from 'lucide-react';

interface AdaptiveDashboardProps {
  userType: 'traveler' | 'corporate' | 'service_provider' | 'property_owner';
  userData: any;
  onboardingData: any;
}

const AdaptiveDashboard: React.FC<AdaptiveDashboardProps> = ({ 
  userType, 
  userData, 
  onboardingData 
}) => {
  const [showOnboardingComplete, setShowOnboardingComplete] = useState(true);
  const [progressLevel, setProgressLevel] = useState(1);

  useEffect(() => {
    // Hide onboarding celebration after 5 seconds
    const timer = setTimeout(() => {
      setShowOnboardingComplete(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getWelcomeMessage = () => {
    const messages = {
      traveler: {
        title: "Your African Adventure Awaits! 🌍",
        subtitle: "Discover personalized experiences based on your interests",
        nextStep: "Browse recommended experiences"
      },
      corporate: {
        title: "Transform Your Team! 🚀",
        subtitle: "Create meaningful corporate experiences that drive results",
        nextStep: "Review your sample estimate"
      },
      service_provider: {
        title: "Share Your Expertise! 🏆",
        subtitle: "Connect with travelers and grow your business",
        nextStep: "Manage your services"
      },
      property_owner: {
        title: "Showcase Your Property! 🏨",
        subtitle: "Welcome travelers to your unique space",
        nextStep: "Manage your listings"
      }
    };

    return messages[userType];
  };

  const getPersonalizedCards = () => {
    switch (userType) {
      case 'traveler':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recommended Experiences */}
            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-bantu-orange/30">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="w-5 h-5 text-bantu-orange mr-2" />
                  For You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Based on your interests: {onboardingData.interests?.slice(0, 2).join(', ')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="Safari" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">Serengeti Safari</h4>
                      <p className="text-xs text-gray-600">3 days • $2,400</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-bantu-orange hover:bg-bantu-orange/90">
                  Explore More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* My Bookmarks */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Bookmark className="w-5 h-5 text-bantu-orange mr-2" />
                  My Bookmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  {onboardingData.completedFirstSuccess ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-4">1 experience bookmarked!</p>
                      <Button variant="outline" size="sm">View Bookmarks</Button>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">No bookmarks yet</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="w-5 h-5 text-bantu-orange mr-2" />
                  Learning Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>African Culture Basics</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-600">Start learning about your destinations</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'corporate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Estimate */}
            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-bantu-orange/30">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 text-bantu-orange mr-2" />
                  Your Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {onboardingData.sampleEstimate ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bantu-orange">
                        ${onboardingData.sampleEstimate.total?.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">{onboardingData.eventType}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>✓ Email copy sent</p>
                      <p>✓ Valid for 30 days</p>
                    </div>
                    <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90">
                      Refine Estimate
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-4">Generate your first estimate</p>
                    <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
                      Create Estimate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Events */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 text-bantu-orange mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">No events scheduled</p>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ROI Tracking */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 text-bantu-orange mr-2" />
                  ROI Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Team Engagement</span>
                    <span className="text-green-600">+0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Productivity</span>
                    <span className="text-green-600">+0%</span>
                  </div>
                  <p className="text-xs text-gray-600">Complete your first event to see metrics</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 text-bantu-orange mr-2" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Get started with our platform</p>
                <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const welcomeMessage = getWelcomeMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Onboarding Success Banner */}
      {showOnboardingComplete && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold">Onboarding Complete! 🎉</h3>
                <p className="text-sm text-green-100">Welcome to your personalized dashboard</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowOnboardingComplete(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-bantu-orange to-gray-900 bg-clip-text text-transparent">
            {welcomeMessage.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{welcomeMessage.subtitle}</p>
          
          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Progress Level {progressLevel}</span>
              <Badge className="bg-bantu-orange text-white">Beginner</Badge>
            </div>
            <Progress value={20} className="h-3" />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-bantu-orange/10 to-orange-100 border-bantu-orange/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-8 h-8 text-bantu-orange mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Ready for your next step?</h3>
                    <p className="text-gray-600">{welcomeMessage.nextStep}</p>
                  </div>
                </div>
                <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personalized Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {getPersonalizedCards()}
        </motion.div>

        {/* Contextual Guidance */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Smart Suggestions Coming Soon
              </h3>
              <p className="text-gray-600 mb-4">
                As you use the platform, we'll provide personalized recommendations and contextual guidance.
              </p>
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                AI-Powered Insights
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdaptiveDashboard;