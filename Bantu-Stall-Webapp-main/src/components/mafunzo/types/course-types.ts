
export type CourseFormat = 'video' | 'text' | 'mixed';

export type Course = {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  modules: number;
  duration: string;
  progress: number;
  image: string;
  format: CourseFormat;
  featured?: boolean;
  path?: string;
  students?: number;
};

export const courses: Course[] = [
  {
    id: 0,
    title: "African Tourism Specialist",
    description: "Master the art of planning and executing unforgettable African tours with this comprehensive course.",
    category: "Tourism",
    categoryColor: "bg-amber-100 text-amber-800",
    modules: 7,
    duration: "20 hours",
    progress: 5,
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    format: "mixed",
    featured: true,
    path: "/mafunzo/african-tourism",
    students: 428
  },
  {
    id: 1,
    title: "Cultural Etiquette Essentials",
    description: "Learn essential cultural protocols and etiquette for respectful travel across Eastern Africa.",
    category: "Culture",
    categoryColor: "bg-blue-100 text-blue-800",
    modules: 12,
    duration: "4 hours",
    progress: 75,
    image: "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    format: "video",
    students: 156
  },
  {
    id: 2,
    title: "Leadership Across Borders",
    description: "Develop cross-cultural leadership skills to facilitate collaboration in diverse settings.",
    category: "Leadership",
    categoryColor: "bg-amber-100 text-amber-800",
    modules: 8,
    duration: "3.5 hours",
    progress: 45,
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    format: "mixed",
    students: 243
  },
  {
    id: 3,
    title: "History of East Africa",
    description: "Explore the rich histories and cultural heritage of East African communities.",
    category: "Culture",
    categoryColor: "bg-blue-100 text-blue-800",
    modules: 10,
    duration: "5 hours",
    progress: 20,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80",
    format: "text",
    students: 189
  },
  {
    id: 4,
    title: "Team Building Techniques",
    description: "Learn practical strategies for building cohesive teams in intercultural environments.",
    category: "Team Building",
    categoryColor: "bg-green-100 text-green-800",
    modules: 6,
    duration: "2.5 hours",
    progress: 0,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    format: "mixed",
    students: 105
  },
  {
    id: 5,
    title: "Introduction to Swahili",
    description: "Master basic Swahili phrases and cultural concepts for more meaningful interactions.",
    category: "Language",
    categoryColor: "bg-purple-100 text-purple-800",
    modules: 14,
    duration: "6 hours",
    progress: 10,
    image: "https://images.unsplash.com/photo-1526280760714-f9e8b26f318f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    format: "video",
    students: 324
  },
  {
    id: 6,
    title: "Sustainable Tourism Practices",
    description: "Understand the principles of responsible travel and sustainable tourism in African contexts.",
    category: "Sustainability",
    categoryColor: "bg-emerald-100 text-emerald-800",
    modules: 8,
    duration: "3 hours",
    progress: 0,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80",
    format: "text",
    students: 178
  }
];
