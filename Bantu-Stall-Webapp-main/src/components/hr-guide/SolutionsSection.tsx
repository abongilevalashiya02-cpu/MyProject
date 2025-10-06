
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SolutionsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Bantu Stall's Strategic Advantage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-bantu-orange">Clear Objective Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Strategic consultation to align retreats with business goals, ensuring every element is purpose-driven 
                and delivers measurable value.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-bantu-orange">Balanced Programming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Expertly crafted agendas balancing productive work sessions, interactive workshops, and 
                rejuvenating leisure activities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-bantu-orange">Seamless Logistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                End-to-end logistics management from travel arrangements to on-site execution, eliminating 
                planning stress and ensuring smooth coordination.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-bantu-orange">Meaningful Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Curated experiences that reinforce key skills, align with company culture, and foster 
                authentic connections among team members.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
