
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Globe } from 'lucide-react';

// Social media links
const socialLinks = [
  { 
    icon: <Facebook />, 
    label: "Facebook", 
    url: "https://www.facebook.com/bantustall/"
  },
  { 
    icon: <Instagram />, 
    label: "Instagram", 
    url: "https://www.instagram.com/bantu_stall/"
  },
  { 
    icon: <Twitter />, 
    label: "Twitter", 
    url: "#"
  },
  { 
    icon: <Linkedin />, 
    label: "LinkedIn", 
    url: "https://www.linkedin.com/company/bantu-stall/"
  },
  { 
    icon: <Youtube />, 
    label: "YouTube", 
    url: "https://www.youtube.com/channel/UCetKGeV30MD5O-yWwtcXS_w"
  },
  { 
    icon: <MapPin />, 
    label: "Google Maps", 
    url: "https://g.co/kgs/iozaQ3s"
  },
];

const SocialLinks = () => {
  return (
    <div>
      <h4 className="font-medium text-lg mb-6">Connect With Us</h4>
      <div className="flex flex-wrap gap-3 mb-8">
        {socialLinks.map((social, index) => (
          <a 
            key={index} 
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-2 rounded-full hover:bg-bantu-orange transition-colors duration-200"
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
      </div>
      
      <h4 className="font-medium text-lg mb-4">Language</h4>
      <div className="relative inline-block">
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-2xl cursor-pointer">
          <Globe className="h-5 w-5" />
          <span>English (US)</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
