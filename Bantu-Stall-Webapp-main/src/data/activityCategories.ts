
export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  icon: string;
}

export const activityCategories: ActivityCategory[] = [
  {
    id: 'physical-challenges',
    name: 'Physical Challenges',
    description: 'Action-oriented activities that build teamwork through shared physical experiences',
    examples: ['Amazing Race', 'Raft Building', 'Obstacle Courses', 'Archery', 'Water Games'],
    icon: 'Activity'
  },
  {
    id: 'culinary-experiences',
    name: 'Culinary Experiences',
    description: 'Food and beverage-focused activities that encourage collaboration',
    examples: ['Potjiekos Competition', 'Cook-offs', 'Braai Master Class', 'Wine Tasting'],
    icon: 'ChefHat'
  },
  {
    id: 'brain-games',
    name: 'Brain Games & Strategic Challenges',
    description: 'Mental challenges that require problem-solving and strategic thinking',
    examples: ['Escape Room', 'Murder Mystery', 'Trivia', 'Survivor Challenges'],
    icon: 'Brain'
  },
  {
    id: 'wellness-relaxation',
    name: 'Wellness & Relaxation',
    description: 'Activities focused on stress relief and well-being',
    examples: ['Group Yoga', 'Spa Treatments', 'Nature Walks', 'Meditation Sessions'],
    icon: 'Flower2'
  },
  {
    id: 'nature-wildlife',
    name: 'Nature-Based & Wildlife',
    description: 'Outdoor experiences that connect teams with nature',
    examples: ['Game Drives', 'Hiking', 'Boat Cruises', 'Wildlife Viewing'],
    icon: 'TreePine'
  },
  {
    id: 'creative-experiential',
    name: 'Creative & Experiential',
    description: 'Artistic and unique experiences that encourage creativity',
    examples: ['Art Building', 'Film Making', 'Drumming', 'Creative Workshops'],
    icon: 'Palette'
  }
];

export const getActivityIcon = (iconName: string) => {
  switch (iconName) {
    case 'Activity': return 'Activity';
    case 'ChefHat': return 'ChefHat';
    case 'Brain': return 'Brain';
    case 'Flower2': return 'Flower2';
    case 'TreePine': return 'TreePine';
    case 'Palette': return 'Palette';
    default: return 'Star';
  }
};
