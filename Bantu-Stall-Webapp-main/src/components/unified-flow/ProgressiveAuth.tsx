import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, ArrowRight, ArrowLeft, Users2, Plane, Building2, 
  Award, CheckCircle, User, Lock, Globe, Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProgressiveAuthProps {
  intent: string;
  onComplete: (userData: any) => void;
  onBack: () => void;
}

interface UserIntent {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: string[];
  role: 'traveler' | 'corporate' | 'service_provider' | 'property_owner';
}

const ProgressiveAuth: React.FC<ProgressiveAuthProps> = ({ intent, onComplete, onBack }) => {
  const { signUp, signIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<any>({});
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const intentMapping: Record<string, UserIntent> = {
    explore: {
      id: 'traveler',
      title: 'Individual Explorer',
      description: 'Discover authentic African experiences',
      icon: Plane,
      questions: [
        'What type of experiences interest you most?',
        'How do you prefer to travel?',
        'What\'s your typical trip duration?'
      ],
      role: 'traveler'
    },
    corporate: {
      id: 'corporate',
      title: 'Corporate Leader',
      description: 'Build stronger teams through meaningful experiences',
      icon: Users2,
      questions: [
        'What size is your team?',
        'What are your primary objectives?',
        'What\'s your preferred location?'
      ],
      role: 'corporate'
    },
    'provide-services': {
      id: 'service_provider',
      title: 'Service Provider',
      description: 'Share your expertise with travelers',
      icon: Award,
      questions: [
        'What services do you offer?',
        'What\'s your experience level?',
        'Where are you located?'
      ],
      role: 'service_provider'
    },
    'list-property': {
      id: 'property_owner',
      title: 'Property Owner',
      description: 'Showcase your space to our community',
      icon: Building2,
      questions: [
        'What type of property do you have?',
        'Where is it located?',
        'What capacity does it accommodate?'
      ],
      role: 'property_owner'
    }
  };

  const currentIntent = intentMapping[intent] || intentMapping.explore;

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Try to sign in to check if user exists - using a temporary password to test
      const { error } = await signIn('email', { email, password: 'temp-check-password-123' });
      
      if (error?.message === 'Invalid login credentials') {
        // User doesn't exist
        setIsExistingUser(false);
      } else if (error?.message === 'Email not confirmed') {
        // User exists but unconfirmed
        setIsExistingUser(true);
      } else if (!error) {
        // User exists and confirmed
        setIsExistingUser(true);
      } else {
        // User doesn't exist (wrong password error means user exists)
        setIsExistingUser(false);
      }
      
      setCurrentStep(2);
    } catch (error) {
      console.error('Error checking user:', error);
      setIsExistingUser(false);
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      let result;
      
      if (isExistingUser) {
        // Sign in existing user
        result = await signIn('email', { email, password });
        if (result.error) {
          toast.error('Invalid password. Please try again.');
          setLoading(false);
          return;
        }
        // Skip to completion for existing users
        onComplete({ 
          email, 
          userType: currentIntent.role,
          isExistingUser: true 
        });
        return;
      } else {
        // Sign up new user
        result = await signUp(email, password, {
          userType: currentIntent.role,
          intent: intent,
          onboarding_step: 1
        });
        
        if (result.error) {
          toast.error('Failed to create account. Please try again.');
          setLoading(false);
          return;
        }
      }
      
      setUserData({ email, userType: currentIntent.role });
      setCurrentStep(3);
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIntentCapture = () => {
    setCurrentStep(4);
  };

  const handleComplete = () => {
    onComplete({ 
      ...userData, 
      email, 
      userType: currentIntent.role,
      intent: intent,
      isExistingUser: false
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <currentIntent.icon className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentIntent.title}</h2>
              <p className="text-gray-600">{currentIntent.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  className="w-full"
                />
              </div>

              <Button 
                className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
                onClick={handleEmailSubmit}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                We'll check if you have an existing account and guide you accordingly
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-bantu-orange mr-2" />
                <span className="text-sm text-gray-600">{email}</span>
              </div>
              
              {isExistingUser !== null && (
                <div className="mb-4">
                  {isExistingUser ? (
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">Welcome back! Please sign in</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-blue-600">
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="text-sm">Great! Let's create your account</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {isExistingUser ? 'Your Password' : 'Create Password'}
                </label>
                <Input
                  type="password"
                  placeholder={isExistingUser ? 'Enter your password' : 'Create a secure password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="w-full"
                />
              </div>

              <Button 
                className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
                onClick={handlePasswordSubmit}
                disabled={loading}
              >
                {loading 
                  ? (isExistingUser ? 'Signing in...' : 'Creating account...') 
                  : (isExistingUser ? 'Sign In' : 'Create Account')
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-600">Let's learn more about your goals</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Help us personalize your experience:
              </h3>
              
              {currentIntent.questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-sm text-gray-700">{question}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-bantu-orange hover:text-white transition-colors">
                      Tell us more
                    </Badge>
                  </div>
                </motion.div>
              ))}

              <Button 
                className="w-full bg-bantu-orange hover:bg-bantu-orange/90 mt-6"
                onClick={handleIntentCapture}
              >
                Continue to Onboarding
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="mb-8">
              <Globe className="w-20 h-20 mx-auto text-bantu-orange mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your African Journey!
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Ready to explore personalized experiences designed just for you? 
                Let's start with a quick onboarding to unlock your perfect African adventure.
              </p>
            </div>

            <div className="bg-gradient-to-br from-bantu-orange/10 to-orange-100 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete a quick {totalSteps}-step onboarding to get personalized recommendations
              </p>
              <div className="flex items-center justify-center text-sm text-bantu-orange">
                <CheckCircle className="w-4 h-4 mr-1" />
                Takes less than 2 minutes
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-bantu-orange to-orange-600 text-white text-lg py-6"
              onClick={handleComplete}
            >
              Start My Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressiveAuth;