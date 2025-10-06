import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { 
  Calendar, MapPin, Users, Clock, Filter, Search, Eye, Download, 
  MessageSquare, Edit, Trash2, Plus, Star, CheckCircle, XCircle,
  AlertCircle, Plane, Hotel, Utensils, Car, Camera, Heart,
  MoreHorizontal, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useGlobalStore } from '@/stores/globalStore';
import { useAuth } from '@/hooks/useAuth';
import { locationService } from '@/services/locationService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in-progress';

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
      coordinates?: {
        lat: number;
        lon: number;
      };
    };
    images?: string[];
    rating?: number;
    provider?: string;
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
  status: BookingStatus;
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
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded';
  cancellationReason?: string;
  rating?: number;
  review?: string;
}

interface BookingManagementProps {
  viewMode?: 'user' | 'admin' | 'provider';
  userId?: string;
  className?: string;
}

export const BookingManagement: React.FC<BookingManagementProps> = ({
  viewMode = 'user',
  userId,
  className
}) => {
  const { user } = useAuth();
  const { bookings, updateBooking, addNotification } = useGlobalStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');

  // Filter bookings based on view mode and user
  const filteredBookings = useMemo(() => {
    // Generate mock bookings with real-world data
    const mockBookings: Booking[] = [
    {
      id: 'BK001',
      userId: user?.id || 'user1',
      experienceId: 'exp1',
      experience: {
        title: 'Victoria Falls Adventure Package',
        type: 'Adventure',
        location: {
          city: 'Victoria Falls',
          country: 'Zimbabwe',
          coordinates: { lat: -17.9243, lon: 25.8572 }
        },
        images: ['/lovable-uploads/8945646f-1b45-4713-84c0-fadb4721ab7a.png'],
        rating: 4.8,
        provider: 'African Adventure Tours'
      },
      dates: {
        start: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
      },
      guests: 2,
      accommodation: 'Victoria Falls Hotel',
      mealPlan: 'Full Board',
      transportation: 'Private Transfer',
      totalPrice: 4500,
      status: 'confirmed',
      specialRequests: 'Vegetarian meals requested',
      emergencyContact: {
        name: 'John Smith',
        phone: '+27123456789',
        relationship: 'Spouse'
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paymentStatus: 'paid',
      distanceToVenue: 1205
    },
    {
      id: 'BK002',
      userId: user?.id || 'user1',
      experienceId: 'exp2',
      experience: {
        title: 'Serengeti Wildlife Safari',
        type: 'Safari',
        location: {
          city: 'Serengeti',
          country: 'Tanzania',
          coordinates: { lat: -2.3333, lon: 34.8333 }
        },
        images: ['/lovable-uploads/2d1f116f-4ccb-45a3-88cd-b7ab0e3a8511.png'],
        rating: 4.9,
        provider: 'Serengeti Expeditions'
      },
      dates: {
        start: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000)
      },
      guests: 4,
      accommodation: 'Luxury Safari Lodge',
      mealPlan: 'All Inclusive',
      transportation: 'Safari Vehicle',
      totalPrice: 12800,
      status: 'pending',
      emergencyContact: {
        name: 'Sarah Johnson',
        phone: '+1234567890',
        relationship: 'Sister'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      paymentStatus: 'partial',
      distanceToVenue: 2850
    },
    {
      id: 'BK003',
      userId: user?.id || 'user1',
      experienceId: 'exp3',
      experience: {
        title: 'Cape Town Cultural Experience',
        type: 'Cultural',
        location: {
          city: 'Cape Town',
          country: 'South Africa',
          coordinates: { lat: -33.9249, lon: 18.4241 }
        },
        images: ['/lovable-uploads/37eefa5a-da23-41cb-acc3-803265918667.png'],
        rating: 4.6,
        provider: 'Ubuntu Tours'
      },
      dates: {
        start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      guests: 2,
      accommodation: 'Boutique Hotel',
      mealPlan: 'Breakfast Only',
      transportation: 'Rental Car',
      totalPrice: 2800,
      status: 'completed',
      emergencyContact: {
        name: 'Michael Brown',
        phone: '+27987654321',
        relationship: 'Friend'
      },
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      paymentStatus: 'paid',
      rating: 5,
      review: 'Amazing experience! The cultural immersion was incredible.',
      distanceToVenue: 0
    }
  ];

    let filtered = mockBookings;

    // Filter by user for user view
    if (viewMode === 'user' && user) {
      filtered = filtered.filter(booking => booking.userId === user.id);
    } else if (userId) {
      filtered = filtered.filter(booking => booking.userId === userId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.experience.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort bookings
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.totalPrice - a.totalPrice;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [viewMode, user, userId, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      case 'completed': return CheckCircle;
      case 'in-progress': return AlertCircle;
      default: return Clock;
    }
  };

  const handleBookingAction = async (booking: Booking, action: string) => {
    setIsUpdating(true);
    try {
      switch (action) {
        case 'cancel':
          // In real app, would call API
          toast.success('Booking cancelled successfully');
          break;
        case 'modify':
          // In real app, would open modification dialog
          toast('Modification request submitted');
          break;
        case 'review':
          // In real app, would open review dialog
          toast('Review dialog opened');
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Failed to perform action');
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateProgress = (booking: Booking): number => {
    const now = new Date();
    const start = new Date(booking.dates.start);
    const end = new Date(booking.dates.end);
    
    if (isBefore(now, start)) return 0;
    if (isAfter(now, end)) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const StatusIcon = getStatusIcon(booking.status);
    const progress = calculateProgress(booking);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        layout
        className="group"
      >
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-bantu-orange">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{booking.experience.title}</h3>
                  <Badge className={cn("text-xs", getStatusColor(booking.status))}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.experience.location.city}, {booking.experience.location.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {booking.guests} guests
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(booking.dates.start, 'MMM dd')} - {format(booking.dates.end, 'MMM dd')}
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDetails(booking.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBookingAction(booking, 'modify')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modify Booking
                  </DropdownMenuItem>
                  {booking.status === 'completed' && (
                    <DropdownMenuItem onClick={() => handleBookingAction(booking, 'review')}>
                      <Star className="h-4 w-4 mr-2" />
                      Write Review
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleBookingAction(booking, 'cancel')}
                    className="text-red-600"
                    disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Booking Image */}
            {booking.experience.images && booking.experience.images[0] && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={booking.experience.images[0]} 
                  alt={booking.experience.title}
                  className="w-full h-32 object-cover"
                />
                {booking.experience.rating && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {booking.experience.rating}
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar for In-Progress Bookings */}
            {booking.status === 'in-progress' && progress > 0 && progress < 100 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Trip Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Hotel className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Accommodation</p>
                  <p className="font-medium truncate">{booking.accommodation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Utensils className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Meals</p>
                  <p className="font-medium">{booking.mealPlan}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Car className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Transport</p>
                  <p className="font-medium truncate">{booking.transportation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-bantu-orange font-bold text-lg">$</span>
                <div>
                  <p className="text-xs text-muted-foreground">Total Price</p>
                  <p className="font-bold text-bantu-orange">${booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm">Payment Status:</span>
              <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                {booking.paymentStatus}
              </Badge>
            </div>

            {/* Distance to Venue */}
            {booking.distanceToVenue !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>{booking.distanceToVenue}km from your location</span>
              </div>
            )}

            {/* Review Section for Completed Bookings */}
            {booking.status === 'completed' && booking.review && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">Your Review</span>
                  {booking.rating && (
                    <span className="text-sm text-muted-foreground">({booking.rating}/5)</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{booking.review}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">
            Manage your travel bookings and experiences
          </p>
        </div>
        <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'date' | 'price' | 'status') => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results'
                  : 'Start planning your next African adventure!'
                }
              </p>
              <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
