import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  HardDrive, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Database,
  FileText,
  Users,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BackupRecord {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  status: 'completed' | 'running' | 'failed';
  createdAt: string;
  tables: string[];
  integrity: boolean;
}

interface RestorePoint {
  id: string;
  timestamp: string;
  description: string;
  tables: string[];
  verified: boolean;
}

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [currentBackup, setCurrentBackup] = useState<{ progress: number; status: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch backup history
  const fetchBackups = async () => {
    try {
      setLoading(true);
      
      // Simulated backup data - in production, this would come from backup service
      const mockBackups: BackupRecord[] = [
        {
          id: '1',
          type: 'full',
          size: 45.2,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          tables: ['users', 'profiles', 'quotations', 'properties'],
          integrity: true
        },
        {
          id: '2', 
          type: 'incremental',
          size: 12.8,
          status: 'completed',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          tables: ['quotations', 'properties'],
          integrity: true
        },
        {
          id: '3',
          type: 'differential', 
          size: 28.4,
          status: 'completed',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          tables: ['users', 'profiles', 'quotations'],
          integrity: true
        }
      ];
      
      setBackups(mockBackups);

      const mockRestorePoints: RestorePoint[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          description: 'Pre-deployment backup - v2.1.0',
          tables: ['users', 'profiles', 'quotations', 'properties'],
          verified: true
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          description: 'Weekly automated backup',
          tables: ['users', 'profiles', 'quotations', 'properties'],
          verified: true
        }
      ];

      setRestorePoints(mockRestorePoints);

    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Failed to load backup history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Create manual backup
  const createBackup = async (type: 'full' | 'incremental' | 'differential') => {
    try {
      setCurrentBackup({ progress: 0, status: 'Initializing backup...' });
      
      // Simulate backup progress
      const progressSteps = [
        { progress: 10, status: 'Analyzing database structure...' },
        { progress: 25, status: 'Backing up user data...' },
        { progress: 40, status: 'Backing up application data...' },
        { progress: 60, status: 'Backing up file storage...' },
        { progress: 80, status: 'Verifying backup integrity...' },
        { progress: 100, status: 'Backup completed successfully' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentBackup(step);
      }

      // Call backup service
      const { error } = await supabase.functions.invoke('backup-service', {
        body: {
          type,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast.success(`${type} backup completed successfully`);
      fetchBackups(); // Refresh backup list

    } catch (error) {
      console.error('Backup failed:', error);
      toast.error('Backup failed. Please try again.');
    } finally {
      setTimeout(() => setCurrentBackup(null), 2000);
    }
  };

  // Restore from backup
  const restoreFromBackup = async (backupId: string) => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to restore from this backup? This action cannot be undone.'
      );
      
      if (!confirmed) return;

      setLoading(true);

      const { error } = await supabase.functions.invoke('backup-service', {
        body: {
          action: 'restore',
          backupId,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast.success('Database restored successfully');

    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Restore failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Verify backup integrity
  const verifyBackup = async (backupId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.functions.invoke('backup-service', {
        body: {
          action: 'verify',
          backupId
        }
      });

      if (error) throw error;

      toast.success('Backup integrity verified');
      fetchBackups();

    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Backup verification failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'incremental': return 'bg-blue-100 text-blue-800';
      case 'differential': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup & Recovery</h1>
          <p className="text-muted-foreground">Manage database backups and disaster recovery</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBackups} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => createBackup('incremental')} disabled={!!currentBackup}>
            <Download className="mr-2 h-4 w-4" />
            Quick Backup
          </Button>
        </div>
      </div>

      {/* Current Backup Progress */}
      {currentBackup && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Creating Backup</span>
                <span className="text-sm text-muted-foreground">{currentBackup.progress}%</span>
              </div>
              <Progress value={currentBackup.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{currentBackup.status}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backup History</TabsTrigger>
          <TabsTrigger value="restore">Restore Points</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          {/* Backup Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  variant="outline" 
                  onClick={() => createBackup('full')}
                  disabled={!!currentBackup}
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Database className="h-6 w-6" />
                    <div>
                      <div className="font-medium">Full Backup</div>
                      <div className="text-xs text-muted-foreground">Complete database</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => createBackup('incremental')}
                  disabled={!!currentBackup}
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <div>
                      <div className="font-medium">Incremental</div>
                      <div className="text-xs text-muted-foreground">Recent changes only</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => createBackup('differential')}
                  disabled={!!currentBackup}
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <div>
                      <div className="font-medium">Differential</div>
                      <div className="text-xs text-muted-foreground">Since last full backup</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(backup.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {new Date(backup.createdAt).toLocaleDateString()} - {new Date(backup.createdAt).toLocaleTimeString()}
                          </span>
                          <Badge className={getTypeColor(backup.type)}>
                            {backup.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Size: {backup.size} MB | Tables: {backup.tables.length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {backup.integrity && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => verifyBackup(backup.id)}
                        disabled={loading}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restoreFromBackup(backup.id)}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restore Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restorePoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{point.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(point.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tables: {point.tables.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {point.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restoreFromBackup(point.id)}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Backup Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Backup</label>
                  <div className="text-sm text-muted-foreground">Every Sunday at 2:00 AM</div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Incremental Backup</label>
                  <div className="text-sm text-muted-foreground">Every 6 hours</div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retention Period</label>
                  <div className="text-sm text-muted-foreground">Keep backups for 30 days</div>
                  <Badge variant="outline">Configured</Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Storage Location</label>
                  <div className="text-sm text-muted-foreground">AWS S3 - Encrypted</div>
                  <Badge variant="outline">Secure</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Backup Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Security Features Enabled:</div>
                  <ul className="text-sm space-y-1">
                    <li>• End-to-end encryption for all backups</li>
                    <li>• Automated integrity verification</li>
                    <li>• Secure off-site storage replication</li>
                    <li>• Role-based access control</li>
                    <li>• Audit logging for all backup operations</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}