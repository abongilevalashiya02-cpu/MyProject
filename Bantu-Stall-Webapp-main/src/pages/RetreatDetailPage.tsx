import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { Retreat } from '@/types/retreats';

const RetreatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [retreat, setRetreat] = useState<Retreat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetreat = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('retreats')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setRetreat(data as Retreat);
      } catch (error) {
        console.error('Error fetching retreat:', error);
        toast({
          title: "Error",
          description: "Failed to fetch retreat details",
          variant: "destructive",
        });
        navigate('/retreat-dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchRetreat();
  }, [user, id, toast, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bantu-orange"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!retreat) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Retreat Not Found</h1>
          <Button onClick={() => navigate('/retreat-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'complete': return 'default';
      case 'planning': return 'secondary';
      case 'quotation_review': return 'outline';
      case 'booked': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/retreat-dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{retreat.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getStatusBadgeVariant(retreat.status)}>
                  {retreat.status.replace('_', ' ')}
                </Badge>
                <span className="text-gray-500">
                  Created {new Date(retreat.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Retreat Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {retreat.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{retreat.description}</p>
                </div>
              )}
              {retreat.trip_dates && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Trip Dates</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{retreat.trip_dates}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(retreat.status)}>
                    {retreat.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => navigate('/venues')}>
                <MapPin className="h-4 w-4 mr-2" />
                Browse Venues
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Request Quotes
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Planning Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Related Quotes */}
        <Card>
          <CardHeader>
            <CardTitle>Related Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <p>No quotes submitted for this retreat yet.</p>
              <Button 
                className="mt-4 mr-2" 
                onClick={() => navigate('/venues')}
              >
                Browse Venues
              </Button>
              <Button 
                variant="outline"
                className="mt-4" 
                onClick={() => navigate('/quotations/new', { 
                  state: { retreat: { id: retreat.id, name: retreat.name } } 
                })}
              >
                Create Quote Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RetreatDetailPage;
