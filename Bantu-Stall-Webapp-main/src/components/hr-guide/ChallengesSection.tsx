
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin, DollarSign } from 'lucide-react';

const ChallengesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">The HR Manager's Retreat Challenge</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-red-800 text-center">Unclear Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-center">
                Without clear goals, retreats become costly social gatherings rather than strategic investments.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-red-800 text-center">Poor Venue Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-center">
                Wrong venues can derail well-planned events, dampening enthusiasm and productivity.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-red-800 text-center">Budget Overruns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-center">
                Hidden costs and poor planning lead to significant budget surprises and financial stress.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">The Hidden Costs of Poor Planning</h3>
          <p className="text-lg text-gray-700 text-center">
            Beyond monetary expenses, poor planning leads to disengaged employees, missed strategic objectives, 
            wasted time, and potential damage to company culture. The true cost includes significant opportunity 
            cost and negative impact on employee morale and productivity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
