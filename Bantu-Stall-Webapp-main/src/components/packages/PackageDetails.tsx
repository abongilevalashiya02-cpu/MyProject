
import React from 'react';
import PackageHighlight from './PackageHighlight';

interface PackageDetailsProps {
  ratingsString: string;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ ratingsString }) => {
  return (
    <div className="prose max-w-none">
      <h2 className="text-3xl font-bold mb-6">The Ultimate Speaker Experience</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium">Package Rating:</p>
        <p className="text-gray-700">{ratingsString}</p>
      </div>
      
      <p className="text-lg mb-6">
        Join us for an extraordinary blend of professional development and African adventure at the majestic Victoria Falls.
        This all-inclusive package has been meticulously designed for speakers attending the Global event, offering a perfect
        balance of speaker workshops, wildlife encounters, and cultural immersion.
      </p>
      
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-bold text-amber-800">Early Registration Deadline</h3>
        <p className="text-amber-700">Register by April 30, 2025 to secure your spot in this limited edition package.</p>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Package Highlights</h2>
      
      <PackageHighlight 
        title="High-Level Networking" 
        description="Connect with luminaries from Southern Africa alongside international guests from the US & EU, creating valuable professional relationships in a unique and inspiring setting."
      />
      
      <PackageHighlight 
        title="Sunset Boat Cruise" 
        description="Kickstart your journey with a serene sunset cruise on the Zambezi River, offering networking opportunities with fellow speakers and attendees."
      />
      
      <PackageHighlight 
        title="Wildlife Encounters" 
        description="Engage in ethical, up-close experiences with Africa's iconic wildlife, including elephants and lions."
      />
      
      <PackageHighlight 
        title="Speaker Workshops" 
        description="Participate in comprehensive workshops designed to refine your TEDx talk, enhance storytelling techniques, and boost stage presence."
      />
      
      <PackageHighlight 
        title="Chobe Safari & Leadership Retreat" 
        description="Embark on a full-day safari in Botswana's Chobe National Park, complemented by a leadership workshop at the esteemed Cresta Mowana Lodge."
      />
      
      <PackageHighlight 
        title="Adventure Activities" 
        description="Experience the thrill of the Devil's Pool, witness the Vulture Feeding Spectacle, and enjoy a gourmet bush breakfast during the 'Feast of the Beast.'"
      />
      
      <PackageHighlight 
        title="Cultural Immersion" 
        description="Attend the Simunye Cultural Performance, offering a deep dive into local traditions and arts."
      />
      
      <PackageHighlight 
        title="Main Event" 
        description="Present your talk at the TEDxChinotimba event, sharing your ideas with a diverse and engaged audience."
      />
      
      <PackageHighlight 
        title="Gourmet Dining" 
        description="Relish curated dining experiences at renowned establishments, including The Boma, Baines Restaurant, and River Brewery."
      />
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-bold text-amber-800">Optional Complimentary Layover</h3>
        <p className="text-amber-700">Sandton, South Africa on August 11, 2025</p>
      </div>
    </div>
  );
};

export default PackageDetails;
