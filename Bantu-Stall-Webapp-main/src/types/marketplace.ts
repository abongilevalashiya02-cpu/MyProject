
export type MessageType = {
  id: number;
  sender: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
};

export type MafunzoCourseType = {
  id: number;
  title: string;
  description: string;
  category: string;
  modules: number;
  duration: string;
  progress: number;
  image: string;
  format: 'video' | 'text' | 'mixed';
};

export type MafunzoBadgeType = {
  id: number;
  name: string;
  description: string;
  image: string;
  acquired: boolean;
  progress?: number;
  color: string;
  date?: string;
  requirements?: string[];
};

export type MafunzoCertificationType = {
  id: number;
  title: string;
  issueDate: string;
  expiry: string;
  image: string;
  description: string;
  badgesRequired: string[];
};

export type ChatCircleType = {
  id: number;
  title: string;
  description: string;
  members: number;
  lastActive: string;
  icon: string;
};

export type EventType = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  image?: string;
  replayUrl?: string;
  summary?: string;
};

export type MemberType = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  company: string;
  location: string;
  industry: string;
  connections: number;
};

export type ExperienceType = {
  id: number;
  title: string;
  description?: string;
  price: number;
  location: string;
  rating: number;
  reviews?: number;
  reviewCount?: number;
  image: string;
  host?: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  duration?: string;
  groupSize?: number;
  languages?: string[];
  featured?: boolean;
  category: string;
  isLimitedEdition?: boolean;
  spotsLeft?: number;
  hostType?: string;
  // Added rating properties
  luxury?: number;
  budget?: number;
  eco?: number;
  cultural?: number;
  comfort?: number;
};

export type FilterValues = {
  country: string;
  theme: string;
  hostType: string;
  date?: Date;
  location?: string[];
  priceRange?: [number, number];
  rating?: number;
  duration?: string[];
  groupSize?: number[];
  language?: string[];
  tags?: string[];
};

export type FilterProps = {
  onFilter: (filters: FilterValues) => void;
  filters?: FilterValues;
  setFilters?: (filters: FilterValues) => void;
};

export type ArticleType = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
  date: string;
  featured?: boolean;
  keywords?: string[];
  seoDescription?: string;
};
