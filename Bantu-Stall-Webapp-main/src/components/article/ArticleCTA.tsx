
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ArticleCTA: React.FC = () => {
  return (
    <section className="mt-12 p-8 bg-gradient-to-r from-bantu-orange/10 to-amber-50 rounded-xl border border-bantu-orange/20">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-bold mb-4 text-bantu-orange">Ready to Secure Your Media-Ready Space?</h3>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Don't miss this once-in-a-generation opportunity. Bantu Stall offers premium media-ready spaces across Johannesburg, perfectly positioned for G20 visibility and brand exposure.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
          <Card className="border-bantu-orange/20">
            <CardContent className="p-6">
              <MapPin className="h-8 w-8 text-bantu-orange mb-3" />
              <h4 className="font-semibold mb-2">Strategic Locations</h4>
              <p className="text-gray-600 text-sm">Prime spots across Johannesburg with high media and delegate traffic</p>
            </CardContent>
          </Card>
          
          <Card className="border-bantu-orange/20">
            <CardContent className="p-6">
              <Phone className="h-8 w-8 text-bantu-orange mb-3" />
              <h4 className="font-semibold mb-2">Media Support</h4>
              <p className="text-gray-600 text-sm">Full PR and media coordination services included</p>
            </CardContent>
          </Card>
          
          <Card className="border-bantu-orange/20">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 text-bantu-orange mb-3" />
              <h4 className="font-semibold mb-2">End-to-End Service</h4>
              <p className="text-gray-600 text-sm">From setup to teardown, we handle everything</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button 
            size="lg" 
            className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => window.open('mailto:kuda@bantustall.com?subject=G20 Media Space Inquiry&body=Hi, I am interested in securing a media-ready space for the G20 2025 summit. Please send me more information about available locations and packages.', '_blank')}
          >
            Enquire About Media Spaces
          </Button>
          <p className="text-sm text-gray-600">
            Contact us at{' '}
            <a href="mailto:kuda@bantustall.com" className="text-bantu-orange hover:underline font-medium">
              kuda@bantustall.com
            </a>{' '}
            or call{' '}
            <a href="tel:+27100300688" className="text-bantu-orange hover:underline font-medium">
              +27 100 300 688
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ArticleCTA;
