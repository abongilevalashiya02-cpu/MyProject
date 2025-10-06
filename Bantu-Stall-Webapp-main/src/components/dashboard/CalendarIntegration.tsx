
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Settings, RefreshCw, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectedCalendar {
  id: string;
  provider: 'google' | 'outlook' | 'teams';
  email: string;
  isConnected: boolean;
  lastSync: string;
}

const CalendarIntegration: React.FC = () => {
  const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>([
    {
      id: '1',
      provider: 'google',
      email: 'user@gmail.com',
      isConnected: true,
      lastSync: '2024-01-15T10:30:00Z'
    }
  ]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnectCalendar = async (provider: 'google' | 'outlook' | 'teams') => {
    setIsConnecting(provider);
    
    try {
      // Simulate OAuth flow - in reality this would redirect to OAuth provider
      toast(`Redirecting to ${provider} for authentication...`);
      
      // Simulate delay for OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, add a new connected calendar
      const newCalendar: ConnectedCalendar = {
        id: Date.now().toString(),
        provider,
        email: `user@${provider === 'google' ? 'gmail.com' : 'outlook.com'}`,
        isConnected: true,
        lastSync: new Date().toISOString()
      };
      
      setConnectedCalendars(prev => [...prev, newCalendar]);
      toast.success(`${provider} calendar connected successfully!`);
    } catch (error) {
      toast.error(`Failed to connect ${provider} calendar`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleSyncCalendar = async (calendarId: string) => {
    try {
      toast('Syncing calendar...');
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnectedCalendars(prev => 
        prev.map(cal => 
          cal.id === calendarId 
            ? { ...cal, lastSync: new Date().toISOString() }
            : cal
        )
      );
      
      toast.success('Calendar synced successfully!');
    } catch (error) {
      toast.error('Failed to sync calendar');
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '🔴'; // Google icon placeholder
      case 'outlook':
        return '🔵'; // Outlook icon placeholder
      case 'teams':
        return '🟣'; // Teams icon placeholder
      default:
        return '📅';
    }
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-bantu-orange" />
          Calendar Integration
        </CardTitle>
        <p className="text-sm text-gray-500">Connect your external calendars</p>
      </CardHeader>
      <CardContent>
        {/* Connected Calendars */}
        {connectedCalendars.length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-medium text-gray-700">Connected Calendars</h4>
            {connectedCalendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getProviderIcon(calendar.provider)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium capitalize">{calendar.provider}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{calendar.email}</p>
                    <p className="text-xs text-gray-400">
                      Last sync: {formatLastSync(calendar.lastSync)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncCalendar(calendar.id)}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connect New Calendar */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Add Calendar</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleConnectCalendar('google')}
              disabled={isConnecting === 'google'}
            >
              <span className="mr-2">🔴</span>
              {isConnecting === 'google' ? 'Connecting...' : 'Connect Google Calendar'}
              <Plus className="ml-auto h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleConnectCalendar('outlook')}
              disabled={isConnecting === 'outlook'}
            >
              <span className="mr-2">🔵</span>
              {isConnecting === 'outlook' ? 'Connecting...' : 'Connect Outlook Calendar'}
              <Plus className="ml-auto h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleConnectCalendar('teams')}
              disabled={isConnecting === 'teams'}
            >
              <span className="mr-2">🟣</span>
              {isConnecting === 'teams' ? 'Connecting...' : 'Connect Teams Calendar'}
              <Plus className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Connected calendars will show your existing events alongside 
            your planned excursions. Time zone conflicts will be automatically handled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
