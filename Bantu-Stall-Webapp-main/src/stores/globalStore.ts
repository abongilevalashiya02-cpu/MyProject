import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

// Type definitions for better type safety
interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  country?: string;
  preferences?: Record<string, unknown>;
  onboarding_status?: 'pending' | 'completed';
  travel_interests?: string[];
}

interface Booking {
  id: string;
  userId: string;
  experienceId: string;
  experience: {
    title: string;
    type: string;
    location: {
      city: string;
      country: string;
    };
  };
  dates: {
    start: Date;
    end: Date;
  };
  guests: number;
  accommodation: string;
  mealPlan: string;
  transportation: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in-progress';
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  userLocation?: string;
  distanceToVenue?: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

interface Quotation {
  id: string;
  userId: string;
  type: 'standard' | 'group' | 'custom';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  basicInfo: {
    title: string;
    description: string;
    destination: string;
    duration: number;
    groupSize: number;
    preferredDates: Date[];
  };
  requirements: {
    accommodation: string;
    transportation: string;
    activities: string[];
    dietaryRestrictions?: string;
    specialRequests?: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    organization?: string;
  };
  estimatedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingData {
  experienceId?: string;
  dates?: {
    start: Date;
    end: Date;
  };
  guests?: number;
  accommodation?: string;
  preferences?: Record<string, unknown>;
}

// Global App State Interface
interface GlobalState {
  // User & Auth State
  user: User | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  
  // UI State
  isLoading: boolean;
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Navigation State
  currentPage: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  
  // Location State
  userLocation: {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    country: string | null;
  };
  
  // Booking/Quotation State
  bookings: Booking[];
  quotations: Quotation[];
  favorites: string[];
  
  // Notification State
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href: string }>) => void;
  setUserLocation: (location: Partial<GlobalState['userLocation']>) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  setQuotations: (quotations: Quotation[]) => void;
  addQuotation: (quotation: Quotation) => void;
  updateQuotation: (quotation: Quotation) => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addNotification: (notification: Omit<GlobalState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationCount: () => number;
  clearNotifications: () => void;
  reset: () => void;
}

// Create the global store
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      userProfile: null,
      isLoading: false,
      isDarkMode: false,
      theme: 'light',
      sidebarOpen: false,
      currentPage: 'home',
      breadcrumbs: [],
      userLocation: {
        latitude: null,
        longitude: null,
        city: null,
        country: null,
      },
      bookings: [],
      quotations: [],
      favorites: [],
      notifications: [],
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setDarkMode: (darkMode) => set({ isDarkMode: darkMode }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      
      setUserLocation: (location) => set((state) => ({
        userLocation: { ...state.userLocation, ...location }
      })),
      
      addBooking: (booking) => set((state) => ({
        bookings: [booking, ...state.bookings]
      })),
      
      updateBooking: (booking) => set((state) => ({
        bookings: state.bookings.map(b => b.id === booking.id ? booking : b)
      })),
      
      setQuotations: (quotations) => set({ quotations }),
      
      addQuotation: (quotation) => set((state) => ({
        quotations: [quotation, ...state.quotations]
      })),
      
      updateQuotation: (quotation) => set((state) => ({
        quotations: state.quotations.map(q => q.id === quotation.id ? quotation : q)
      })),
      
      addToFavorites: (id) => set((state) => ({
        favorites: [...state.favorites, id]
      })),
      
      removeFromFavorites: (id) => set((state) => ({
        favorites: state.favorites.filter(fav => fav !== id)
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications
        ]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      })),
      
      getUnreadNotificationCount: () => {
        const state = get();
        return state.notifications.filter(n => !n.read).length;
      },
      
      clearNotifications: () => set({ notifications: [] }),
      
      reset: () => set({
        user: null,
        isAuthenticated: false,
        userProfile: null,
        isLoading: false,
        currentPage: 'home',
        breadcrumbs: [],
        bookings: [],
        quotations: [],
        notifications: [],
      }),
    }),
    {
      name: 'bantu-stall-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        userLocation: state.userLocation,
      }),
    }
  )
);

// Specific stores for complex features
interface BookingState {
  currentBooking: Booking | null;
  bookingStep: number;
  bookingData: BookingData;
  availableDates: Date[];
  selectedDates: Date[];
  
  setCurrentBooking: (booking: Booking) => void;
  setBookingStep: (step: number) => void;
  updateBookingData: (data: BookingData) => void;
  setAvailableDates: (dates: Date[]) => void;
  setSelectedDates: (dates: Date[]) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBooking: null,
  bookingStep: 1,
  bookingData: {},
  availableDates: [],
  selectedDates: [],
  
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setBookingStep: (step) => set({ bookingStep: step }),
  updateBookingData: (data) => set((state) => ({ 
    bookingData: { ...state.bookingData, ...data } 
  })),
  setAvailableDates: (dates) => set({ availableDates: dates }),
  setSelectedDates: (dates) => set({ selectedDates: dates }),
  resetBooking: () => set({
    currentBooking: null,
    bookingStep: 1,
    bookingData: {},
    selectedDates: [],
  }),
}));

interface QuotationState {
  quotations: Quotation[];
  activeQuotation: Quotation | null;
  quotationTypes: ('standard' | 'group' | 'custom')[];
  
  setActiveQuotation: (quotation: Quotation) => void;
  addQuotation: (quotation: Quotation) => void;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  markQuotationStatus: (id: string, status: Quotation['status']) => void;
}

export const useQuotationStore = create<QuotationState>((set) => ({
  quotations: [],
  activeQuotation: null,
  quotationTypes: ['standard', 'group', 'custom'],
  
  setActiveQuotation: (quotation) => set({ activeQuotation: quotation }),
  addQuotation: (quotation) => set((state) => ({
    quotations: [quotation, ...state.quotations]
  })),
  updateQuotation: (id, updates) => set((state) => ({
    quotations: state.quotations.map(q => 
      q.id === id ? { ...q, ...updates } : q
    )
  })),
  deleteQuotation: (id) => set((state) => ({
    quotations: state.quotations.filter(q => q.id !== id)
  })),
  markQuotationStatus: (id, status) => set((state) => ({
    quotations: state.quotations.map(q => 
      q.id === id ? { ...q, status } : q
    )
  })),
}));
