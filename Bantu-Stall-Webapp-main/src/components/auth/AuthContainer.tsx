import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';
import OAuthButtons from './OAuthButtons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Globe } from 'lucide-react';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [tabInitialized, setTabInitialized] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Set the active tab based on path and URL query param if present (run once per location change)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const needsConfirmation = params.get('needs_confirmation') === 'true';
    if (!tabInitialized) {
      if (location.pathname === '/signup' || tab === 'signup') {
        setActiveTab('signup');
      }
      setTabInitialized(true);
    }

    // Check for confirmed parameter after email verification
    const confirmed = params.get('confirmed');
    if (confirmed === 'true') {
      toast({
        title: "Email confirmed",
        description: "Your email has been confirmed. You can now log in.",
      });
    }

    // If redirected from signup needing confirmation, ensure login tab is shown
    if (needsConfirmation) {
      setActiveTab('login');
    }
  }, [location, toast, tabInitialized]);


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Background Card with Glass Effect */}
        <motion.div 
          className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-bantu-orange to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {activeTab === 'login' ? 'Welcome Back' : 
               activeTab === 'signup' ? 'Create your account' : 
               'Reset Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {activeTab === 'login' ? 'Sign in to access your dashboard and continue your journey' :
               activeTab === 'signup' ? 'Select your role and set up your personalized experience' :
               'Enter your email to receive password reset instructions'}
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex justify-center gap-6 mb-6 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Trusted Community</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Global Network</span>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-1">
              <TabsTrigger 
                value="login" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {!showResetForm ? (
                <>
                  <TabsContent value="login" className="space-y-6 mt-6">
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm setActiveTab={setActiveTab} onForgotPassword={() => setShowResetForm(true)} />
                      <OAuthButtons mode="login" />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-6">
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SignupForm setActiveTab={setActiveTab} />
                      {/* Removed compact user type selector cards */}
                      <OAuthButtons mode="signup" />
                    </motion.div>
                  </TabsContent>
                </>
              ) : (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <ResetPasswordForm setActiveTab={setActiveTab} onBack={() => setShowResetForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthContainer;
