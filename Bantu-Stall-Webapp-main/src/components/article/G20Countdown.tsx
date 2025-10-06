
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const G20Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = new Date('2025-11-22T00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="my-12 p-8 bg-gradient-to-br from-bantu-orange/10 via-amber-50 to-yellow-50 rounded-xl border border-bantu-orange/20">
      <div className="text-center">
        <Badge variant="outline" className="text-bantu-orange border-bantu-orange bg-white/80 backdrop-blur-sm mb-4 text-sm font-semibold">
          Historic Event
        </Badge>
        
        <h3 className="text-3xl font-serif font-bold mb-2 text-bantu-orange">G20 2025 Summit</h3>
        <p className="text-xl text-gray-700 mb-1">Johannesburg, South Africa</p>
        <p className="text-lg text-gray-600 mb-6 italic">"Solidarity, Equality, Sustainability"</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-bantu-orange/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-bantu-orange">{timeLeft.days}</div>
              <div className="text-sm text-gray-600 font-medium">Days</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-bantu-orange/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-bantu-orange">{timeLeft.hours}</div>
              <div className="text-sm text-gray-600 font-medium">Hours</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-bantu-orange/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-bantu-orange">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-600 font-medium">Minutes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-bantu-orange/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-bantu-orange">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-600 font-medium">Seconds</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 text-left max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-bantu-orange mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">November 22, 2025</p>
              <p className="text-gray-600 text-sm">First G20 Summit on African soil</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-bantu-orange mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Presidency Handover</p>
              <p className="text-gray-600 text-sm">South Africa will hand over the G20 presidency to the United States Head of State, marking the end of Africa's historic tenure</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-bantu-orange mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Once-in-a-Generation Opportunity</p>
              <p className="text-gray-600 text-sm">Global media attention, international delegates, and unprecedented business opportunities await</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default G20Countdown;
