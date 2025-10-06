import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  ShoppingBag,
  Briefcase,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  ctaText: string;
  href: string;
  gradient: string;
  popular?: boolean;
}

const userTypes: UserType[] = [
  {
    id: 'corporate',
    title: 'Corporate Retreats',
    description: 'Plan transformative team experiences in Africa',
    icon: Building2,
    features: [
      'Custom retreat planning',
      'Team building activities',
      'Venue sourcing',
      'ROI tracking'
    ],
    ctaText: 'Plan Corporate Retreat',
    href: '/signup?tab=signup&type=corporate',
    gradient: 'from-blue-500 to-cyan-500',
    popular: true
  },
  {
    id: 'traveler',
    title: 'Individual Traveler',
    description: 'Discover authentic African experiences',
    icon: MapPin,
    features: [
      'Curated experiences',
      'Local connections',
      'Cultural immersion',
      'Personal concierge'
    ],
    ctaText: 'Start Exploring',
    href: '/signup?tab=signup&type=traveler',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'service_provider',
    title: 'Service Provider',
    description: 'Showcase your African tourism business',
    icon: Briefcase,
    features: [
      'List your services',
      'Connect with clients',
      'Manage bookings',
      'Grow your business'
    ],
    ctaText: 'Join as Provider',
    href: '/signup?tab=signup&type=service_provider',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'vendor',
    title: 'Vendor',
    description: 'Sell your products and services on Bantu Stall',
    icon: ShoppingBag,
    features: [
      'Marketplace access',
      'Product listings',
      'Order management',
      'Secure payouts'
    ],
    ctaText: 'Join as Vendor',
    href: '/signup?tab=signup&type=vendor',
    gradient: 'from-orange-500 to-red-500'
  }
];

// Add a compact variant for minimalist rendering in signup flow
const UserTypeSelector: React.FC<{ variant?: 'default' | 'compact' }> = ({ variant = 'default' }) => {
  return (
    <section className={`${variant === 'compact' ? 'py-4' : 'py-20'} ${variant === 'compact' ? 'bg-transparent' : 'bg-gradient-to-br from-gray-50 to-white'}` }>
      <div className={`${variant === 'compact' ? 'max-w-5xl' : 'container'} mx-auto ${variant === 'compact' ? 'px-2' : 'px-6'}`}>
        {variant !== 'compact' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-bantu-orange">African Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're planning corporate retreats, seeking personal adventures, 
              or building tourism businesses, we have the perfect path for you.
            </p>
          </motion.div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 ${variant === 'compact' ? 'gap-4' : 'gap-6 lg:gap-8'} max-w-4xl mx-auto`}>
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative"
            >
              {type.popular && variant !== 'compact' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-bantu-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full border-2 transition-all duration-300 hover:shadow-xl hover:shadow-bantu-orange/10 ${variant === 'compact' ? 'hover:border-bantu-orange/40' : 'hover:border-bantu-orange/30'} bg-white/95 backdrop-blur-sm`}>
                 <CardHeader className={`${variant === 'compact' ? 'text-center pb-3 pt-6' : 'text-center pb-4 pt-6'}`}>
                   <div className={`w-14 h-14 md:w-18 md:h-18 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                     <type.icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
                   </div>
                   <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                     {type.title}
                   </CardTitle>
                   <CardDescription className="text-gray-600 text-sm md:text-base leading-relaxed">
                     {type.description}
                   </CardDescription>
                 </CardHeader>
                
                <CardContent className={`space-y-4 ${variant === 'compact' ? 'pb-6' : 'pb-6'}`}>
                  {variant !== 'compact' && (
                    <ul className="space-y-2">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                   <Link to={type.href} className="block">
                     <Button 
                       size={variant === 'compact' ? 'sm' : 'default'}
                       className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 hover:scale-[1.02] text-white group transition-all duration-200 shadow-md hover:shadow-lg`}
                     >
                       {variant === 'compact' ? 'Get Started' : type.ctaText}
                       <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                   </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {variant !== 'compact' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">
              Not sure which path is right for you?
            </p>
            <Link to="/about">
              <Button variant="outline" size="lg" className="group">
                Learn More About Bantu Stall
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UserTypeSelector;
