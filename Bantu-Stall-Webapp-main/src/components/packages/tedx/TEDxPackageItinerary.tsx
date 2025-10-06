
import React from 'react';
import { Calendar } from 'lucide-react';

const TEDxPackageItinerary = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold mt-10 mb-6">Detailed Itinerary</h3>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex items-center text-bantu-orange">
          <Calendar className="h-6 w-6 mr-2" />
          <span className="font-medium">June 3-8, 2025</span>
        </div>
      </div>
      
      <div className="space-y-8 mb-10">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 1: June 3 – Arrival & Welcome Dinner</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Arrive in Johannesburg and check into a comfortable Sandton hotel</li>
            <li>Connect with fellow speakers over a curated Afro-Asian fusion dinner</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 2: June 4 – Soweto Experience & Cultural Village Tour</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>07:45 AM: Walk in Mandela's footsteps with a guided tour of his house & Soweto</li>
            <li>11:00 AM: Immerse in a Cultural Village Experience—stories, music, and traditions</li>
            <li>12:30 PM: Enjoy a traditional South African lunch at the Cultural Village</li>
            <li>03:00 PM: Rest & recharge back at the hotel</li>
            <li>07:00 PM: Speaker workshop – sharpen your talk & refine your message</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 3: June 5 – Walk with Lions & Speaker Workshop</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Morning: A once-in-a-lifetime Walk with Lions in Pretoria</li>
            <li>Afternoon: Exclusive TEDx coaching session—perfect your delivery & impact</li>
            <li>07:00 PM: Final rehearsals at the hotel to ensure you shine on stage</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 4: June 6 – TEDxGraystonDrive 2025 Main Event</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Step onto the TEDx stage and share your idea with the world</li>
            <li>Evening: Celebrate with a VIP Spit Braai After-Party, networking with industry leaders & innovators</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 5: June 7 – Safari & Rooftop Reflections</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>05:00 AM: Pilanesberg National Park Safari—witness Africa's Big 5 in the wild</li>
            <li>Evening: Drinks & reflections at Alto Bar, The Leonardo—Johannesburg's highest rooftop bar</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-bold mb-2">Day 6: June 8 – Departure or Optional Exploration</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Flexible shuttle based on flight schedules</li>
            <li>Have a late flight? Spend the day shopping or take an optional trip to Cape Town or Victoria Falls</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TEDxPackageItinerary;
