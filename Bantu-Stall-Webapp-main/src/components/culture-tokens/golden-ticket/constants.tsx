
import { Landmark, Mountain, Brain, Heart, GraduationCap, Layers } from 'lucide-react';
import React from 'react';

// Define a type for experience type objects
export interface ExperienceType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Experience types with icons mapping
export const experienceTypes: ExperienceType[] = [
  { id: "cultural", label: "Cultural", icon: <Landmark className="w-5 h-5" /> },
  { id: "adventure", label: "Adventure", icon: <Mountain className="w-5 h-5" /> },
  { id: "strategy", label: "Strategy", icon: <Brain className="w-5 h-5" /> },
  { id: "wellness", label: "Wellness", icon: <Heart className="w-5 h-5" /> },
  { id: "coaching", label: "Coaching", icon: <GraduationCap className="w-5 h-5" /> },
  { id: "hybrid", label: "Hybrid", icon: <Layers className="w-5 h-5" /> },
];

// Team goals options
export const teamGoals = [
  "Trust Building",
  "Strategic Clarity",
  "Communication",
  "Creativity & Innovation",
  "Conflict Resolution",
  "Leadership Development",
  "Team Cohesion",
  "Cross-Cultural Understanding",
  "Problem Solving",
  "Decision Making",
  "Adaptability",
  "Resilience",
];

export const countries = [
  "United States", 
  "United Kingdom", 
  "Canada", 
  "South Africa", 
  "Nigeria", 
  "Kenya", 
  "Ghana", 
  "Other"
];

export const destinations = [
  "South Africa", 
  "Kenya", 
  "Tanzania", 
  "Ghana", 
  "Morocco", 
  "Rwanda", 
  "Botswana", 
  "Namibia", 
  "Uganda", 
  "Ethiopia", 
  "Senegal"
];

export const groupSizes = ["5-10", "11-20", "21-30", "31-50", "50+"];
export const durations = ["1-2 days", "3-5 days", "1 week", "2 weeks", "Longer"];
export const budgets = ["$1,000-$2,500", "$2,500-$5,000", "$5,000-$7,500", "$7,500-$10,000", "$10,000+"];
