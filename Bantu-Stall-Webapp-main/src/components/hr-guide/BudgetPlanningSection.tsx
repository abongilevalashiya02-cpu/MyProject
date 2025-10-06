
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCalculator from './BudgetCalculator';

const BudgetPlanningSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Comprehensive Budget Planning Template</h2>
        
        <div className="max-w-6xl mx-auto">
          <BudgetCalculator />

          {/* Hidden Costs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Often-Overlooked Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Insurance Requirements</span>
                    <span className="font-medium">R2,775 - R9,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology/AV Equipment</span>
                    <span className="font-medium">R9,250 - R27,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Taxes (5-15%)</span>
                    <span className="font-medium">Variable</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service Charges (10-20%)</span>
                    <span className="font-medium">Variable</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency Exchange Fees</span>
                    <span className="font-medium">2-5% of total</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation Insurance</span>
                    <span className="font-medium">3-7% of total</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BudgetPlanningSection;
