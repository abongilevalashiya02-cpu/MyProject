
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h4 className="font-medium text-lg mb-4">Platform</h4>
        <ul className="space-y-2">
          {/* <li><Link to="/mafunzo" className="text-gray-400 hover:text-white transition-colors">Horo</Link></li> */}
          {/* <li><Link to="/abantu" className="text-gray-400 hover:text-white transition-colors">Watu</Link></li> */}
          <li><Link to="/musika" className="text-gray-400 hover:text-white transition-colors">Musika</Link></li>
          <li><Link to="/indaba" className="text-gray-400 hover:text-white transition-colors">Indaba</Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-lg mb-4">Services</h4>
        <ul className="space-y-2">
          <li><Link to="/culture-tokens" className="text-gray-400 hover:text-white transition-colors">Stamps</Link></li>
          <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
          <li><Link to="/hr-guide" className="text-gray-400 hover:text-white transition-colors">HR Guide</Link></li>
          <li><Link to="/service-providers" className="text-gray-400 hover:text-white transition-colors">Service Providers</Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-lg mb-4">Company</h4>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
          <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link></li>
          <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
          {/* <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li> */}
          <li><span className="text-gray-600 cursor-not-allowed">Careers (Coming Soon)</span></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-lg mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Settings</a></li>
          <li><Link to="/compliance" className="text-gray-400 hover:text-white transition-colors">POPIA/GDPR</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
