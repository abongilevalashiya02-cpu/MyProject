
import React from 'react';
import GoldenTicketForm from './GoldenTicketForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

const GoldenTicket: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-white to-bantu-yellow/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-bantu-yellow/30">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="w-24 h-24 rounded-full bg-bantu-yellow/20 flex items-center justify-center flex-shrink-0">
                <Ticket className="w-12 h-12 text-bantu-orange" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                  Golden Ticket Application
                </h2>
                <p className="text-gray-600 mb-4">
                  Design your dream leadership or team-building adventure and earn a chance to speak on global stages in South Africa.
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-bantu-orange hover:bg-bantu-orange/90 text-white rounded-xl">
                      Start Your Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[900px] p-0 h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <GoldenTicketForm />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoldenTicket;
