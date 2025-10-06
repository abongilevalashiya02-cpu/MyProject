import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users2, Building2, Calculator, CheckCircle, ArrowRight, ArrowLeft, 
  Mail, Target, Zap, DollarSign, Calendar, MapPin, Star, Download
} from 'lucide-react';
import { toast } from 'sonner';

interface CorporateOnboardingFlowProps {
  userData: any;
  onComplete: (data: any) => void;
}

const CorporateOnboardingFlow: React.FC<CorporateOnboardingFlowProps> = ({ 
  userData, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    eventType: '',
    teamSize: '',
    objectives: [] as string[],
    location: '',
    budget: '',
    duration: '',
    companyName: '',
    contactRole: ''
  });
  const [hasCompletedFirstSuccess, setHasCompletedFirstSuccess] = useState(false);
  const [estimateGenerated, setEstimateGenerated] = useState<any>(null);

  const totalSteps = 4;

  const eventTypes = [
    { id: 'team-building', label: 'Team Building Retreat', description: 'Strengthen bonds and collaboration' },
    { id: 'leadership', label: 'Leadership Development', description: 'Develop leadership skills and vision' },
    { id: 'training', label: 'Corporate Training', description: 'Skill development and workshops' },
    { id: 'incentive', label: 'Incentive Travel', description: 'Reward and motivate your team' },
    { id: 'conference', label: 'Corporate Conference', description: 'Strategic meetings and presentations' },
    { id: 'product-launch', label: 'Product Launch', description: 'Memorable launch events' }
  ];

  const teamSizes = [
    '5-15 people', '16-30 people', '31-50 people', '51-100 people', '100+ people'
  ];

  const objectives = [
    'Improve team communication',
    'Boost employee morale',
    'Develop leadership skills',
    'Increase productivity',
    'Strengthen company culture',
    'Reward top performers',
    'Launch new initiatives',
    'Strategic planning',
    'Cross-department collaboration'
  ];

  const locations = [
    'Cape Town, South Africa',
    'Marrakech, Morocco',
    'Nairobi, Kenya',
    'Accra, Ghana',
    'Cairo, Egypt',
    'Lagos, Nigeria'
  ];

  const durations = ['1-2 days', '3-4 days', '5-7 days', '1-2 weeks'];

  const updateOnboardingData = (key: string, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const toggleObjective = (objective: string) => {
    const current = onboardingData.objectives;
    if (current.includes(objective)) {
      updateOnboardingData('objectives', current.filter(o => o !== objective));
    } else if (current.length < 3) {
      updateOnboardingData('objectives', [...current, objective]);
    }
  };

  const generateSampleEstimate = () => {
    // Mock calculation based on team size and duration
    const baseCost = {
      '5-15 people': 15000,
      '16-30 people': 35000,
      '31-50 people': 60000,
      '51-100 people': 120000,
      '100+ people': 200000
    }[onboardingData.teamSize] || 15000;

    const durationMultiplier = {
      '1-2 days': 1,
      '3-4 days': 1.8,
      '5-7 days': 2.5,
      '1-2 weeks': 4
    }[onboardingData.duration] || 1;

    const total = Math.round(baseCost * durationMultiplier);

    const estimate = {
      eventType: onboardingData.eventType,
      teamSize: onboardingData.teamSize,
      location: onboardingData.location,
      duration: onboardingData.duration,
      objectives: onboardingData.objectives,
      breakdown: {
        accommodation: Math.round(total * 0.4),
        activities: Math.round(total * 0.3),
        meals: Math.round(total * 0.2),
        transport: Math.round(total * 0.1)
      },
      total: total,
      currency: 'USD',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    setEstimateGenerated(estimate);
    setHasCompletedFirstSuccess(true);
    toast.success('Sample estimate generated! 🎉 Check your email for a copy.');
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
      sampleEstimate: estimateGenerated,
      completedFirstSuccess: hasCompletedFirstSuccess,
      onboardingCompleted: true
    });
    toast.success('Welcome to Bantu Stall Corporate! Let\'s build amazing team experiences.');
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
              <Building2 className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Welcome, Corporate Leader! 🏢</CardTitle>
              <p className="text-gray-600">Let's create transformational experiences for your team</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</label>
                  <Input
                    placeholder="Enter company name"
                    value={onboardingData.companyName}
                    onChange={(e) => updateOnboardingData('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Your Role</label>
                  <Input
                    placeholder="e.g., HR Director, CEO"
                    value={onboardingData.contactRole}
                    onChange={(e) => updateOnboardingData('contactRole', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-4">What type of event are you planning?</h3>
                <div className="space-y-3">
                  {eventTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        variant={onboardingData.eventType === type.id ? "default" : "outline"}
                        className={`w-full p-4 h-auto justify-start text-left ${
                          onboardingData.eventType === type.id 
                            ? 'bg-bantu-orange border-bantu-orange text-white' 
                            : 'hover:border-bantu-orange hover:text-bantu-orange'
                        }`}
                        onClick={() => updateOnboardingData('eventType', type.id)}
                      >
                        <div className="flex-1">
                          <div className="font-medium mb-1">{type.label}</div>
                          <div className="text-sm opacity-80">{type.description}</div>
                        </div>
                        {onboardingData.eventType === type.id && (
                          <CheckCircle className="w-5 h-5 ml-4" />
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
                  disabled={!onboardingData.eventType || !onboardingData.companyName}
                >
                  Next: Team Details
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
              <Users2 className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Team Details 👥</CardTitle>
              <p className="text-gray-600">Help us understand your team size and objectives</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Team Size</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamSizes.map((size) => (
                    <Button
                      key={size}
                      variant={onboardingData.teamSize === size ? "default" : "outline"}
                      className={`${
                        onboardingData.teamSize === size 
                          ? 'bg-bantu-orange border-bantu-orange text-white' 
                          : 'hover:border-bantu-orange hover:text-bantu-orange'
                      }`}
                      onClick={() => updateOnboardingData('teamSize', size)}
                    >
                      {size}
                      {onboardingData.teamSize === size && (
                        <CheckCircle className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-3">Primary Objectives (Choose up to 3)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {objectives.map((objective) => (
                    <Button
                      key={objective}
                      size="sm"
                      variant={onboardingData.objectives.includes(objective) ? "default" : "outline"}
                      className={`text-left justify-start ${
                        onboardingData.objectives.includes(objective) 
                          ? 'bg-bantu-orange border-bantu-orange text-white' 
                          : 'hover:border-bantu-orange hover:text-bantu-orange'
                      } ${onboardingData.objectives.length >= 3 && !onboardingData.objectives.includes(objective) 
                          ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => toggleObjective(objective)}
                      disabled={onboardingData.objectives.length >= 3 && !onboardingData.objectives.includes(objective)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      {objective}
                      {onboardingData.objectives.includes(objective) && (
                        <CheckCircle className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                
                <div className="text-center mt-3">
                  <Badge variant="outline" className="border-bantu-orange text-bantu-orange">
                    {onboardingData.objectives.length}/3 selected
                  </Badge>
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
                  disabled={!onboardingData.teamSize || onboardingData.objectives.length === 0}
                >
                  Next: Event Details
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
              <CardTitle className="text-2xl">Event Planning 📍</CardTitle>
              <p className="text-gray-600">Where and when would you like to hold your event?</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Preferred Location</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {locations.map((location) => (
                    <Button
                      key={location}
                      variant={onboardingData.location === location ? "default" : "outline"}
                      className={`${
                        onboardingData.location === location 
                          ? 'bg-bantu-orange border-bantu-orange text-white' 
                          : 'hover:border-bantu-orange hover:text-bantu-orange'
                      }`}
                      onClick={() => updateOnboardingData('location', location)}
                    >
                      {location}
                      {onboardingData.location === location && (
                        <CheckCircle className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Event Duration</label>
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Range (USD)</label>
                  <Input
                    placeholder="e.g., $50,000 - $100,000"
                    value={onboardingData.budget}
                    onChange={(e) => updateOnboardingData('budget', e.target.value)}
                  />
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
                  disabled={!onboardingData.location || !onboardingData.duration}
                >
                  Next: Get Sample Estimate
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
              <Calculator className="w-16 h-16 mx-auto text-bantu-orange mb-4" />
              <CardTitle className="text-2xl">Your First Success! 🎯</CardTitle>
              <p className="text-gray-600">Generate a sample estimate for your event</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!estimateGenerated ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-bantu-orange/10 to-orange-100 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Ready to see your estimate?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on your requirements, we'll generate a detailed cost breakdown
                    </p>
                    <Button
                      className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
                      onClick={generateSampleEstimate}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Generate Sample Estimate
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    This estimate will be sent to your email for reference
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-800">Sample Estimate Generated! 🎉</h3>
                      <Badge className="bg-green-600 text-white">
                        ${estimateGenerated.total.toLocaleString()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Event Type:</span>
                        <div className="font-medium capitalize">{estimateGenerated.eventType.replace('-', ' ')}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Team Size:</span>
                        <div className="font-medium">{estimateGenerated.teamSize}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Location:</span>
                        <div className="font-medium">{estimateGenerated.location}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-medium">{estimateGenerated.duration}</div>
                      </div>
                    </div>

                    <div className="border-t border-green-200 pt-4">
                      <h4 className="font-medium text-green-800 mb-2">Cost Breakdown:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Accommodation & Venues:</span>
                          <span className="font-medium">${estimateGenerated.breakdown.accommodation.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activities & Experiences:</span>
                          <span className="font-medium">${estimateGenerated.breakdown.activities.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Meals & Catering:</span>
                          <span className="font-medium">${estimateGenerated.breakdown.meals.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transportation:</span>
                          <span className="font-medium">${estimateGenerated.breakdown.transport.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-green-300 pt-2 flex justify-between font-semibold">
                          <span>Total Estimate:</span>
                          <span>${estimateGenerated.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Copy Sent
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
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
                      Access Corporate Dashboard
                      <Zap className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Generate Estimate First
                      <Calculator className="w-4 h-4 ml-2" />
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <Card className="w-full max-w-3xl">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Corporate Onboarding</h1>
            <Badge className="bg-orange-100 text-orange-800">Step {currentStep} of {totalSteps}</Badge>
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

export default CorporateOnboardingFlow;