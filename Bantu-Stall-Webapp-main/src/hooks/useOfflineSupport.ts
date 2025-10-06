import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface OfflineQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  queueSize: number;
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

const STORAGE_KEY = 'bantu_stall_offline_queue';
const MAX_RETRY_COUNT = 3;

export const useOfflineSupport = () => {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    queueSize: 0,
    isSyncing: false,
    lastSyncTime: null
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem(STORAGE_KEY);
    if (savedQueue) {
      try {
        const queue = JSON.parse(savedQueue);
        setOfflineQueue(queue);
        setOfflineState(prev => ({ ...prev, queueSize: queue.length }));
      } catch (error) {
        console.error('Failed to parse offline queue:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineQueue));
    setOfflineState(prev => ({ ...prev, queueSize: offlineQueue.length }));
  }, [offlineQueue]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored. Syncing offline changes...');
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOnline: false }));
      toast.error('Connection lost. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add item to offline queue
  const addToQueue = useCallback((
    action: OfflineQueueItem['action'],
    table: string,
    data: any
  ) => {
    const queueItem: OfflineQueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    setOfflineQueue(prev => [...prev, queueItem]);
    return queueItem.id;
  }, []);

  // Remove item from queue
  const removeFromQueue = useCallback((id: string) => {
    setOfflineQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  // Sync offline queue with server
  const syncOfflineQueue = useCallback(async () => {
    if (!offlineState.isOnline || offlineQueue.length === 0) return;

    setOfflineState(prev => ({ ...prev, isSyncing: true }));

    const successfulItems: string[] = [];
    const failedItems: string[] = [];

    for (const item of offlineQueue) {
      try {
        let result;

        switch (item.action) {
          case 'create':
            result = await supabase
              .from(item.table as any)
              .insert(item.data);
            break;
          case 'update':
            result = await supabase
              .from(item.table as any)
              .update(item.data)
              .eq('id', item.data.id);
            break;
          case 'delete':
            result = await supabase
              .from(item.table as any)
              .delete()
              .eq('id', item.data.id);
            break;
        }

        if (result?.error) {
          throw result.error;
        }

        successfulItems.push(item.id);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        
        // Increment retry count
        setOfflineQueue(prev => 
          prev.map(qItem => 
            qItem.id === item.id 
              ? { ...qItem, retryCount: qItem.retryCount + 1 }
              : qItem
          )
        );

        // Remove items that have exceeded max retries
        if (item.retryCount >= MAX_RETRY_COUNT) {
          failedItems.push(item.id);
        }
      }
    }

    // Remove successful and permanently failed items
    const itemsToRemove = [...successfulItems, ...failedItems];
    setOfflineQueue(prev => 
      prev.filter(item => !itemsToRemove.includes(item.id))
    );

    setOfflineState(prev => ({
      ...prev,
      isSyncing: false,
      lastSyncTime: new Date()
    }));

    if (successfulItems.length > 0) {
      toast.success(`Synced ${successfulItems.length} offline changes`);
    }

    if (failedItems.length > 0) {
      toast.error(`Failed to sync ${failedItems.length} changes after multiple attempts`);
    }
  }, [offlineState.isOnline, offlineQueue]);

  // Automatic sync when coming online
  useEffect(() => {
    if (offlineState.isOnline && offlineQueue.length > 0) {
      syncOfflineQueue();
    }
  }, [offlineState.isOnline, offlineQueue.length, syncOfflineQueue]);

  // Offline-aware database operations
  const offlineCreate = useCallback(async (table: string, data: any) => {
    if (offlineState.isOnline) {
      try {
        const result = await supabase.from(table as any).insert(data);
        if (result.error) throw result.error;
        return result;
      } catch (error) {
        // If online request fails, add to queue
        addToQueue('create', table, data);
        throw error;
      }
    } else {
      // Add to queue for later sync
      const queueId = addToQueue('create', table, data);
      toast('Changes saved locally. Will sync when connection is restored.');
      return { data: [{ ...data, id: queueId, _offline: true }], error: null };
    }
  }, [offlineState.isOnline, addToQueue]);

  const offlineUpdate = useCallback(async (table: string, data: any, id: string) => {
    if (offlineState.isOnline) {
      try {
        const result = await supabase.from(table as any).update(data).eq('id', id);
        if (result.error) throw result.error;
        return result;
      } catch (error) {
        addToQueue('update', table, { ...data, id });
        throw error;
      }
    } else {
      const queueId = addToQueue('update', table, { ...data, id });
      toast('Changes saved locally. Will sync when connection is restored.');
      return { data: [{ ...data, id, _offline: true }], error: null };
    }
  }, [offlineState.isOnline, addToQueue]);

  const offlineDelete = useCallback(async (table: string, id: string) => {
    if (offlineState.isOnline) {
      try {
        const result = await supabase.from(table as any).delete().eq('id', id);
        if (result.error) throw result.error;
        return result;
      } catch (error) {
        addToQueue('delete', table, { id });
        throw error;
      }
    } else {
      const queueId = addToQueue('delete', table, { id });
      toast('Deletion saved locally. Will sync when connection is restored.');
      return { data: [{ id, _offline: true, _deleted: true }], error: null };
    }
  }, [offlineState.isOnline, addToQueue]);

  // Clear all offline data (use with caution)
  const clearOfflineData = useCallback(() => {
    setOfflineQueue([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Offline data cleared');
  }, []);

  // Get offline data for a specific table
  const getOfflineData = useCallback((table: string) => {
    return offlineQueue.filter(item => item.table === table);
  }, [offlineQueue]);

  return {
    offlineState,
    offlineQueue,
    addToQueue,
    removeFromQueue,
    syncOfflineQueue,
    offlineCreate,
    offlineUpdate,
    offlineDelete,
    clearOfflineData,
    getOfflineData
  };
};

// Hook for offline-aware data fetching with caching
export const useOfflineQuery = (table: string, query?: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { offlineState, getOfflineData } = useOfflineSupport();

  const cacheKey = `${table}_${JSON.stringify(query || {})}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (offlineState.isOnline) {
          // Try to fetch from server
          let queryBuilder = supabase.from(table as any).select('*');
          
          if (query) {
            Object.keys(query).forEach(key => {
              if (query[key] !== undefined) {
                queryBuilder = queryBuilder.eq(key, query[key]);
              }
            });
          }

          const result = await queryBuilder;
          
          if (result.error) throw result.error;

          // Cache the data
          localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
            data: result.data,
            timestamp: Date.now()
          }));

          setData(result.data || []);
        } else {
          // Load from cache when offline
          const cached = localStorage.getItem(`cache_${cacheKey}`);
          if (cached) {
            const { data: cachedData } = JSON.parse(cached);
            setData(cachedData || []);
          }
        }
      } catch (err) {
        setError(err as Error);
        
        // Fallback to cache on error
        const cached = localStorage.getItem(`cache_${cacheKey}`);
        if (cached) {
          const { data: cachedData } = JSON.parse(cached);
          setData(cachedData || []);
          toast('Showing cached data due to connection issues');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(query), offlineState.isOnline, cacheKey]);

  // Merge with offline queue data
  useEffect(() => {
    const offlineData = getOfflineData(table);
    if (offlineData.length > 0) {
      setData(prevData => {
        const mergedData = [...prevData];
        
        offlineData.forEach(item => {
          if (item.action === 'create') {
            mergedData.push({ ...item.data, _offline: true });
          } else if (item.action === 'update') {
            const index = mergedData.findIndex(d => d.id === item.data.id);
            if (index !== -1) {
              mergedData[index] = { ...mergedData[index], ...item.data, _offline: true };
            }
          } else if (item.action === 'delete') {
            const index = mergedData.findIndex(d => d.id === item.data.id);
            if (index !== -1) {
              mergedData[index] = { ...mergedData[index], _deleted: true, _offline: true };
            }
          }
        });
        
        return mergedData.filter(item => !item._deleted);
      });
    }
  }, [table, getOfflineData]);

  return { data, loading, error, isOffline: !offlineState.isOnline };
};