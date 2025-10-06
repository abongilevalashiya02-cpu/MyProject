
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-16 bg-bantu-orange text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Strategic Retreat?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Let Bantu Stall transform your corporate retreat from a logistical challenge into a strategic success.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-white text-bantu-orange hover:bg-gray-100 font-semibold px-8 py-3">
            <Download className="h-5 w-5 mr-2" />
            Download Budget Template
          </Button>
          <Button className="border-2 border-white text-white hover:bg-white hover:text-bantu-orange font-semibold px-8 py-3">
            Schedule Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
