
import { EventType } from '@/types/marketplace';

// Sample data for demonstration
export const upcomingEvents: EventType[] = [
  {
    id: 1,
    title: 'Pan-African Business Summit',
    date: '2025-09-12',
    time: '09:00 - 17:00',
    location: 'Kigali Convention Center, Rwanda',
    organizer: 'African Business Council',
    attendees: 340,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    title: 'Tech Entrepreneurship Masterclass',
    date: '2025-09-18',
    time: '14:00 - 16:30',
    location: 'Virtual (Zoom)',
    organizer: 'AfriTech Hub',
    attendees: 120,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 3,
    title: 'Cross-Border Trade Workshop',
    date: '2025-09-25',
    time: '10:00 - 13:00',
    location: 'Lagos Business School, Nigeria',
    organizer: 'West African Trade Association',
    attendees: 85,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 4,
    title: 'Cultural Tourism Networking Mixer',
    date: '2025-10-05',
    time: '18:00 - 21:00',
    location: 'Mombasa Beach Hotel, Kenya',
    organizer: 'East African Tourism Board',
    attendees: 65,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  }
];

// Past events with additional replay information
export const pastEvents: Array<EventType & { replayUrl?: string; summary?: string }> = [
  {
    id: 5,
    title: 'African Fintech Revolution Conference',
    date: '2025-08-15',
    time: '10:00 - 18:00',
    location: 'Online',
    organizer: 'Africa Fintech Consortium',
    attendees: 520,
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    replayUrl: 'https://example.com/replay/fintech-revolution',
    summary: 'Discussion on the latest fintech trends across Africa, including mobile payments, cryptocurrency adoption, and regulatory frameworks.'
  },
  {
    id: 6,
    title: 'Sustainable Agriculture Symposium',
    date: '2025-08-02',
    time: '09:00 - 15:30',
    location: 'Addis Ababa Convention Center, Ethiopia',
    organizer: 'Agricultural Innovation Network',
    attendees: 245,
    image: 'https://images.unsplash.com/photo-1533658280853-e4a10c25a30d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    summary: 'Exploration of sustainable farming practices, climate adaptation strategies, and food security initiatives across the continent.'
  },
  {
    id: 7,
    title: 'Creative Economy Workshop',
    date: '2025-07-22',
    time: '13:00 - 17:00',
    location: 'Virtual (Teams)',
    organizer: 'African Creative Coalition',
    attendees: 175,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    replayUrl: 'https://example.com/replay/creative-economy',
    summary: 'Workshop on monetizing creative works, intellectual property protection, and accessing global markets for African artists and creators.'
  }
];
