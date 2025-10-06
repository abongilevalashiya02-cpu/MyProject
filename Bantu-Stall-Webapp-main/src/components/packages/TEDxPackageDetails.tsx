
import React from 'react';
import PackageHighlight from './PackageHighlight';

interface TEDxPackageDetailsProps {
  ratingsString: string;
}

const TEDxPackageDetails: React.FC<TEDxPackageDetailsProps> = ({ ratingsString }) => {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold mb-6">TEDxGraystonDrive 2025 Speaker Package</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium">Package Rating:</p>
        <p className="text-gray-700">{ratingsString}</p>
      </div>
      
      <p className="text-lg mb-6">
        Step onto the TEDx stage and amplify your voice at TEDxGraystonDrive 2025. 
        This exclusive 6-day speaker experience is designed for thought leaders, change-makers, 
        and storytellers ready to share ideas that shape the future. From immersive cultural 
        experiences to expert-led speaker workshops, this journey is more than just a talk—it's 
        a transformational experience in the heart of Africa's financial capital.
      </p>
      
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-bold text-amber-800">Registration Deadline</h3>
        <p className="text-amber-700">Register by April 15, 2025 to secure your spot in this limited edition package.</p>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Itinerary</h2>
      
      <PackageHighlight 
        title="JUNE 3 – ARRIVAL & WELCOME DINNER" 
        description="Arrive in Johannesburg and check into a comfortable Sandton hotel. Connect with fellow speakers over a curated Afro-Asian fusion dinner."
      />
      
      <PackageHighlight 
        title="JUNE 4 – SOWETO EXPERIENCE & CULTURAL VILLAGE TOUR" 
        description="07:45 AM: Walk in Mandela's footsteps with a guided tour of his house & Soweto. 11:00 AM: Immerse in a Cultural Village Experience—stories, music, and traditions. 12:30 PM: Enjoy a traditional South African lunch at the Cultural Village. 03:00 PM: Rest & recharge back at the hotel. 07:00 PM: Speaker workshop – sharpen your talk & refine your message."
      />
      
      <PackageHighlight 
        title="JUNE 5 – WALK WITH LIONS & SPEAKER WORKSHOP" 
        description="Morning: A once-in-a-lifetime Walk with Lions in Pretoria. Afternoon: Exclusive TEDx coaching session—perfect your delivery & impact. 07:00 PM: Final rehearsals at the hotel to ensure you shine on stage."
      />
      
      <PackageHighlight 
        title="JUNE 6 – TEDxGRAYSTONDRIVE 2025 MAIN EVENT" 
        description="Step onto the TEDx stage and share your idea with the world. Evening: Celebrate with a VIP Spit Braai After-Party, networking with industry leaders & innovators."
      />
      
      <PackageHighlight 
        title="JUNE 7 – SAFARI & ROOFTOP REFLECTIONS" 
        description="05:00 AM: Pilanesberg National Park Safari—witness Africa's Big 5 in the wild. Evening: Drinks & reflections at Alto Bar, The Leonardo—Johannesburg's highest rooftop bar."
      />
      
      <PackageHighlight 
        title="JUNE 8 – DEPARTURE OR OPTIONAL EXPLORATION" 
        description="Flexible shuttle based on flight schedules. Have a late flight? Spend the day shopping or take an optional trip to Cape Town or Victoria Falls."
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">What's Included</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>5 Nights Accommodation in Sandton</li>
        <li>All Meals & Signature Dining Experiences</li>
        <li>TEDx Coaching, Rehearsals & VIP Event Access</li>
        <li>Exclusive Networking Events</li>
        <li>Cultural Tours & Wildlife Safari</li>
        <li>All Ground Transportation & Airport Transfers</li>
      </ul>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-bold text-amber-800">Secure Your Spot!</h3>
        <p className="text-amber-700">Deposit: $2,000 (Due: March 30, 2025)</p>
        <p className="text-amber-700">Final Payment: May 30, 2025</p>
      </div>
    </div>
  );
};

export default TEDxPackageDetails;
