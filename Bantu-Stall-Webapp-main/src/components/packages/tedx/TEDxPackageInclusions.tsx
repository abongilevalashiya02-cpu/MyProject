
import React from 'react';

const TEDxPackageInclusions = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold mt-10 mb-6">What's Included</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>5 Nights Accommodation in Sandton</span>
        </div>
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>All Meals & Signature Dining Experiences</span>
        </div>
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>TEDx Coaching, Rehearsals & VIP Event Access</span>
        </div>
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>Exclusive Networking Events</span>
        </div>
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>Cultural Tours & Wildlife Safari</span>
        </div>
        <div className="flex items-start">
          <div className="text-bantu-orange mr-2">✓</div>
          <span>All Ground Transportation & Airport Transfers</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-bold text-amber-800">Registration Deadlines</h3>
        <p className="text-amber-700">Deposit of $2,000 due by March 30, 2025</p>
        <p className="text-amber-700">Final payment due by May 30, 2025</p>
      </div>
    </div>
  );
};

export default TEDxPackageInclusions;
