import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Clock, Store, ArrowRight, Users, Navigation, Calendar, Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MuldersdriftVenues from '../components/venues/MuldersdriftVenues';
import { LocationWeatherWidget } from '@/components/widgets/LocationWeatherWidget';
import { locationService, LocationData } from '@/services/locationService';
import { realTimeDataService } from '@/services/realTimeDataService';
import { fetchPublicPropertyListings, PublicPropertyListing } from '@/integrations/supabase/queries/propertyListings';
interface Venue {
  id: string;
  name: string;
  type: string;
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  capacity: number;
  amenities: string[];
  genres: string[];
  upcomingEvents: number;
  distance?: number;
}
interface EventItem {
  id: string;
  name: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  category: string;
  description: string;
  imageUrl?: string;
}
const Musika = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [publicListings, setPublicListings] = useState<PublicPropertyListing[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);

    // Get user location
    const initializeData = async () => {
      try {
        const location = await locationService.getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Failed to load location data:', error);
      }
    };
    initializeData();
  }, []);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const listings = await fetchPublicPropertyListings();
        if (!cancelled) setPublicListings(listings);
      } catch (err) {
        console.error('Failed to load public property listings:', err);
      } finally {
        if (!cancelled) setLoadingPublic(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Corporate retreat venues data
  const venues: Venue[] = [{
    id: '1',
    name: 'Ubuntu Conference Center',
    type: 'Conference Center',
    location: {
      city: 'Johannesburg',
      country: 'South Africa',
      coordinates: {
        lat: -26.2041,
        lon: 28.0473
      }
    },
    description: 'Modern conference facility perfect for corporate retreats and team building',
    images: ['/lovable-uploads/94572388-14c1-4b04-9baa-26e47a1a4490.png'],
    rating: 4.7,
    reviewCount: 342,
    priceRange: '$$',
    capacity: 800,
    amenities: ['AV Equipment', 'Catering', 'WiFi', 'Parking', 'Accommodation'],
    genres: ['Corporate', 'Team Building', 'Conferences', 'Workshops'],
    upcomingEvents: 12
  }, {
    id: '2',
    name: 'Savanna Business Lodge',
    type: 'Business Lodge',
    location: {
      city: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        lat: -1.2921,
        lon: 36.8219
      }
    },
    description: 'Serene business lodge ideal for executive retreats and strategic planning',
    images: ['/lovable-uploads/8185c7c0-c6e1-484d-b71c-16319afee6cb.png'],
    rating: 4.5,
    reviewCount: 186,
    priceRange: '$',
    capacity: 200,
    amenities: ['Meeting Rooms', 'Garden Setting', 'Business Center', 'Spa'],
    genres: ['Executive', 'Strategic Planning', 'Leadership', 'Wellness'],
    upcomingEvents: 8
  }];

  // Calculate distances if user location is available
  const venuesWithDistance = venues.map(venue => {
    if (userLocation) {
      const distance = locationService.calculateDistance(userLocation.latitude, userLocation.longitude, venue.location.coordinates.lat, venue.location.coordinates.lon);
      return {
        ...venue,
        distance
      };
    }
    return venue;
  });

  // Filter and sort venues
  const filteredVenues = venuesWithDistance.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || venue.genres.some(g => g.toLowerCase() === selectedType.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || venue.location.country.toLowerCase() === selectedLocation.toLowerCase();
    return matchesSearch && matchesType && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'events':
        return b.upcomingEvents - a.upcomingEvents;
      default:
        return 0;
    }
  });
  const venueTypes = ['all', 'corporate', 'team building', 'conferences', 'workshops', 'executive', 'strategic planning', 'leadership', 'wellness'];
  const countries = ['all', 'south africa', 'kenya', 'ghana', 'rwanda', 'egypt', 'nigeria', 'tanzania'];
  return <motion.div className="min-h-screen flex flex-col" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.6
  }}>
      <Navbar />

      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        {/* Users can also request a quote for a specific venue using the buttons on each venue card below. */}
        <section className="relative py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" alt="African marketplace" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-bantu-orange/90 via-orange-600/80 to-yellow-500/70"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 z-5">
            <motion.div className="absolute top-10 right-10 w-4 h-4 bg-white/30 rounded-full" animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }} />
            <motion.div className="absolute bottom-20 left-16 w-3 h-3 bg-yellow-300/40 rounded-full" animate={{
            y: [0, 15, 0],
            x: [0, 10, 0]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1
          }} />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Hero Content */}
              <div className="lg:col-span-2">
                <motion.div initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8
              }} className="text-white">
                  
                  
                  <h1 className="text-6xl font-bold mb-6 leading-tight">
                    Discover 
                    <span className="block text-yellow-300">Premium</span>
                    Retreat Venues
                  </h1>
                  
                  <p className="text-xl text-orange-100 mb-8 max-w-2xl">
                    Find and book exceptional venues across Africa for your corporate retreats, team building events, 
                    and executive gatherings. From conference centers to business lodges.
                  </p>

                  

                  {/* Quick Stats */}
                  
                </motion.div>
              </div>

              {/* Location Widget */}
              <div className="lg:col-span-1">
                <motion.div initial={{
                opacity: 0,
                x: 30
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.8,
                delay: 0.2
              }}>
                  <LocationWeatherWidget compact />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        

        {/* Venues Grid */}
        


        <MuldersdriftVenues />

      </main>

      <Footer />
    </motion.div>;
};
export default Musika;