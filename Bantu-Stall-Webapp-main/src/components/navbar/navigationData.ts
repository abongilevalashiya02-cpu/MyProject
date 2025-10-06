import { Home, Store, Users, GraduationCap, MapPin, Ticket, Info, FileText, PlusSquare, BookOpen } from 'lucide-react';

// Main navigation links data
export const mainNavLinks = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Quotations', path: '/quotations/legacy', icon: FileText },
  { title: 'Case Studies', path: '/case-studies', icon: BookOpen },
  { title: 'List Your Property', path: '/list-property', icon: PlusSquare },
  { title: 'About Us', path: '/about', icon: Info },
];

// Community and platform links
export const communityLinks = [
  { title: 'Musika', path: '/musika', icon: Store, description: 'African Marketplace & Commerce' },
  { title: 'Watu', path: '#watu', icon: Users, description: 'Community Network', disabled: true },
  { title: 'Horo', path: '#horo', icon: GraduationCap, description: 'Learning Hub', disabled: true },
  { title: 'Stamps', path: '/culture-tokens', icon: Ticket, description: 'Cultural Tokens' },
];

// Combined navigation links for external use
export const navLinks = [...mainNavLinks, ...communityLinks];
