import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, 
  TrendingUp, 
  Users, 
  MapPin, 
  Star, 
  Eye, 
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';

interface PropertyStats {
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  rejectedListings: number;
  averageCapacity: number;
  topLocations: { location: string; count: number }[];
  propertyTypes: { type: string; count: number }[];
  monthlyGrowth: number;
  features: {
    ecoFriendly: number;
    luxury: number;
    csrAlignment: number;
  };
}

const PropertyListingStats: React.FC = () => {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all property listings
      const { data: listings, error } = await supabase
        .from('property_listings')
        .select('*');

      if (error) throw error;

      if (!listings) {
        setStats(null);
        return;
      }

      // Calculate stats
      const totalListings = listings.length;
      const approvedListings = listings.filter(l => l.status === 'approved').length;
      const pendingListings = listings.filter(l => l.status === 'pending').length;
      const rejectedListings = listings.filter(l => l.status === 'rejected').length;

      // Calculate average capacity
      const averageCapacity = listings.length > 0 
        ? Math.round(listings.reduce((sum, l) => sum + l.max_capacity, 0) / listings.length)
        : 0;

      // Top locations
      const locationCounts = listings.reduce((acc, l) => {
        const key = `${l.location}, ${l.area}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Property types
      const typeCounts = listings.reduce((acc, l) => {
        acc[l.property_type] = (acc[l.property_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const propertyTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate monthly growth
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const recentListings = listings.filter(l => 
        new Date(l.created_at) > lastMonth
      ).length;
      
      const previousListings = totalListings - recentListings;
      const monthlyGrowth = previousListings > 0 
        ? Math.round((recentListings / previousListings) * 100)
        : 0;

      // Feature counts
      const features = {
        ecoFriendly: listings.filter(l => l.eco_friendly).length,
        luxury: listings.filter(l => l.luxury).length,
        csrAlignment: listings.filter(l => l.csr_alignment).length,
      };

      setStats({
        totalListings,
        approvedListings,
        pendingListings,
        rejectedListings,
        averageCapacity,
        topLocations,
        propertyTypes,
        monthlyGrowth,
        features,
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No data available</h3>
          <p className="text-muted-foreground">No property listings found to generate statistics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approvedListings}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((stats.approvedListings / stats.totalListings) * 100)}% approval rate
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingListings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Capacity</p>
                <p className="text-2xl font-bold">{stats.averageCapacity}</p>
                <p className="text-xs text-muted-foreground">guests per property</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topLocations.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{location.location}</span>
                  </div>
                  <Badge variant="secondary">{location.count} properties</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.propertyTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{type.type}</span>
                  </div>
                  <Badge variant="secondary">{type.count} listings</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eco-Friendly</p>
                <p className="text-2xl font-bold">{stats.features.ecoFriendly}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.features.ecoFriendly / stats.totalListings) * 100)}% of properties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Luxury</p>
                <p className="text-2xl font-bold">{stats.features.luxury}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.features.luxury / stats.totalListings) * 100)}% of properties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CSR Aligned</p>
                <p className="text-2xl font-bold">{stats.features.csrAlignment}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.features.csrAlignment / stats.totalListings) * 100)}% of properties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Indicator */}
      {stats.monthlyGrowth > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-700">+{stats.monthlyGrowth}%</p>
                <p className="text-xs text-muted-foreground">
                  New properties this month compared to last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyListingStats;