import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Compass, CheckCircle, ArrowRight, ArrowLeft, 
  Plane, Mountain, Camera, Users, Calendar, MapPin,
  Star, Bookmark, Target, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface TravelerOnboardingFlowProps {
  userData: any;
  onComplete: (data: any) => void;
}

const TravelerOnboardingFlow: React.FC<TravelerOnboardingFlowProps> = ({ 
  userData, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    interests: [] as string[],
    travelStyle: '',
    favoriteDestinations: [] as string[],
    duration: '',
    budget: ''
  });
  const [hasCompletedFirstSuccess, setHasCompletedFirstSuccess] = useState(false);

  const totalSteps = 4;

  const interests = [
    { id: 'wildlife', label: 'Wildlife & Safari', icon: '🦁' },
    { id: 'culture', label: 'Cultural Experiences', icon: '🎭' },
    { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
    { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
    { id: 'food', label: 'Local Cuisine', icon: '🍽️' },
    { id: 'history', label: 'History & Museums', icon: '🏛️' },
    { id: 'beach', label: 'Beach & Coast', icon: '🏖️' },
    { id: 'photography', label: 'Photography', icon: '📸' }
  ];

  const travelStyles = [
    { id: 'luxury', label: 'Luxury Explorer', description: 'Premium experiences with comfort' },
    { id: 'adventure', label: 'Adventure Seeker', description: 'Active and thrilling experiences' },
    { id: 'cultural', label: 'Cultural Immersion', description: 'Deep local cultural experiences' },
    { id: 'budget', label: 'Budget Conscious', description: 'Great value experiences' }
  ];

  const destinations = [
    'South Africa', 'Kenya', 'Tanzania', 'Morocco', 'Egypt',
    'Ghana', 'Nigeria', 'Ethiopia', 'Rwanda', 'Botswana',
    'Zimbabwe', 'Zambia', 'Uganda', 'Madagascar', 'Senegal'
  ];

  const durations = ['Weekend (2-3 days)', 'Week (4-7 days)', 'Extended (1-2 weeks)', 'Long-term (3+ weeks)'];
  const budgets = ['Budget ($500-1000)', 'Mid-range ($1000-3000)', 'Premium ($3000-5000)', 'Luxury ($5000+)'];

  // Mock experiences for first success
  const mockExperiences = [
    {
      id: 1,
      title: 'Serengeti Wildlife Safari',
      location: 'Tanzania',
      rating: 4.9,
      price: '$2,400',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'wildlife'
    },
    {
      id: 2,
      title: 'Maasai Cultural Experience',
      location: 'Kenya',
      rating: 4.8,
      price: '$800',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture'
    },
    {
      id: 3,
      title: 'Table Mountain Adventure',
      location: 'South Africa',
      rating: 4.7,
      price: '$450',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure'
    }
  ];

  const updateOnboardingData = (key: string, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interestId: string) => {
    const currentInterests = onboardingData.interests;
    if (currentInterests.includes(interestId)) {
      updateOnboardingData('interests', currentInterests.filter(id => id !== interestId));
    } else {
      updateOnboardingData('interests', [...currentInterests, interestId]);
    }
  };

  const toggleDestination = (destination: string) => {
    const current = onboardingData.favoriteDestinations;
    if (current.includes(destination)) {
      updateOnboardingData('favoriteDestinations', current.filter(d => d !== destination));
    } else if (current.length < 3) {
      updateOnboardingData('favoriteDestinations', [...current, destination]);
    }
  };

  const handleBookmarkExperience = (experienceId: number) => {
    setHasCompletedFirstSuccess(true);
    toast.success('Experience bookmarked! 🎉 Great choice for your first save.');
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      ...userData,
      ...onboardingData,
      completedFirstSuccess: hasCompletedFirstSuccess,
      onboardingCompleted: true
    });
    toast.success('Welcome to Bantu Stall! Your personalized journey begins now.');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader className="text-center">
              <Compass className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Welcome, Explorer! 🌍</CardTitle>
              <p className="text-gray-600">Let's discover what makes your heart race in Africa</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-4">What interests you most? (Select all that apply)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={onboardingData.interests.includes(interest.id) ? "default" : "outline"}
                        className={`w-full h-auto p-4 justify-start ${
                          onboardingData.interests.includes(interest.id) 
                            ? 'bg-bantu-orange border-bantu-orange text-white' 
                            : 'hover:border-bantu-orange hover:text-bantu-orange'
                        }`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        <span className="text-xl mr-3">{interest.icon}</span>
                        <span className="text-sm font-medium">{interest.label}</span>
                        {onboardingData.interests.includes(interest.id) && (
                          <CheckCircle className="w-4 h-4 ml-auto" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <div></div>
                <Button 
                  className="bg-bantu-orange hover:bg-bantu-orange/90"
                  onClick={handleNext}
                  disabled={onboardingData.interests.length === 0}
                >
                  Next: Travel Style
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader className="text-center">
              <Plane className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Your Travel Style ✈️</CardTitle>
              <p className="text-gray-600">How do you like to experience new places?</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {travelStyles.map((style) => (
                  <motion.div
                    key={style.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant={onboardingData.travelStyle === style.id ? "default" : "outline"}
                      className={`w-full p-6 h-auto justify-start text-left ${
                        onboardingData.travelStyle === style.id 
                          ? 'bg-bantu-orange border-bantu-orange text-white' 
                          : 'hover:border-bantu-orange hover:text-bantu-orange'
                      }`}
                      onClick={() => updateOnboardingData('travelStyle', style.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium mb-1">{style.label}</div>
                        <div className="text-sm opacity-80">{style.description}</div>
                      </div>
                      {onboardingData.travelStyle === style.id && (
                        <CheckCircle className="w-5 h-5 ml-4" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-bantu-orange hover:bg-bantu-orange/90"
                  onClick={handleNext}
                  disabled={!onboardingData.travelStyle}
                >
                  Next: Destinations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Dream Destinations 🗺️</CardTitle>
              <p className="text-gray-600">Choose up to 3 African countries that call to you</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                {destinations.map((destination) => (
                  <motion.div
                    key={destination}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={onboardingData.favoriteDestinations.includes(destination) ? "default" : "outline"}
                      size="sm"
                      className={`w-full ${
                        onboardingData.favoriteDestinations.includes(destination) 
                          ? 'bg-bantu-orange border-bantu-orange text-white' 
                          : 'hover:border-bantu-orange hover:text-bantu-orange'
                      } ${onboardingData.favoriteDestinations.length >= 3 && !onboardingData.favoriteDestinations.includes(destination) 
                          ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => toggleDestination(destination)}
                      disabled={onboardingData.favoriteDestinations.length >= 3 && !onboardingData.favoriteDestinations.includes(destination)}
                    >
                      {destination}
                      {onboardingData.favoriteDestinations.includes(destination) && (
                        <CheckCircle className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Badge variant="outline" className="border-bantu-orange text-bantu-orange">
                  {onboardingData.favoriteDestinations.length}/3 selected
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Trip Duration</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-bantu-orange focus:outline-none"
                    value={onboardingData.duration}
                    onChange={(e) => updateOnboardingData('duration', e.target.value)}
                  >
                    <option value="">Select duration</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Range</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-bantu-orange focus:outline-none"
                    value={onboardingData.budget}
                    onChange={(e) => updateOnboardingData('budget', e.target.value)}
                  >
                    <option value="">Select budget</option>
                    {budgets.map(budget => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-bantu-orange hover:bg-bantu-orange/90"
                  onClick={handleNext}
                  disabled={onboardingData.favoriteDestinations.length === 0 || !onboardingData.duration || !onboardingData.budget}
                >
                  Next: First Success
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader className="text-center">
              <Target className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Your First Success! 🎯</CardTitle>
              <p className="text-gray-600">Bookmark an experience that catches your eye</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {mockExperiences.filter(exp => 
                  onboardingData.interests.length === 0 || onboardingData.interests.includes(exp.category)
                ).slice(0, 3).map((experience) => (
                  <motion.div
                    key={experience.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-bantu-orange transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex gap-4">
                      <img 
                        src={experience.image} 
                        alt={experience.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{experience.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {experience.location}
                          <div className="flex items-center ml-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">{experience.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-bantu-orange">{experience.price}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white"
                            onClick={() => handleBookmarkExperience(experience.id)}
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Bookmark
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasCompletedFirstSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-6 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Perfect! You're all set! 🎉</h3>
                  <p className="text-green-700 mb-4">
                    You've successfully bookmarked your first experience. Your personalized dashboard awaits!
                  </p>
                </motion.div>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-gradient-to-r from-bantu-orange to-orange-600 text-white"
                  onClick={handleComplete}
                  disabled={!hasCompletedFirstSuccess}
                >
                  {hasCompletedFirstSuccess ? (
                    <>
                      Enter Your Dashboard
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Bookmark One Experience First
                      <Bookmark className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-2xl">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Traveler Onboarding</h1>
            <Badge className="bg-blue-100 text-blue-800">Step {currentStep} of {totalSteps}</Badge>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default TravelerOnboardingFlow;