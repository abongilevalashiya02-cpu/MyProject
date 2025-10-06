import { useCallback, useEffect, useState } from 'react';
import { useGlobalStore } from '@/stores/globalStore';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy?: number;
}

interface LocationError {
  code: number;
  message: string;
}

export const useLocationServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);
  const { userLocation, setUserLocation, addNotification } = useGlobalStore();

  const getCurrentPosition = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser'
        });
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            // Reverse geocoding to get city and country
            const locationData = await reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              accuracy,
              ...locationData
            });
          } catch {
            // If reverse geocoding fails, still return coordinates
            resolve({
              latitude,
              longitude,
              accuracy
            });
          }
        },
        (geoError) => {
          reject({
            code: geoError.code,
            message: getLocationErrorMessage(geoError.code)
          });
        },
        options
      );
    });
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Use local locationService for reverse geocoding instead of external APIs
      const { locationService } = await import('@/services/locationService');
      const result = await locationService.reverseGeocode(lat, lng);
      
      return {
        city: result.city || 'Unknown',
        country: result.country || 'Unknown'
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {};
    }
  };

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location access denied by user';
      case 2:
        return 'Location information unavailable';
      case 3:
        return 'Location request timed out';
      default:
        return 'An unknown error occurred while retrieving location';
    }
  };

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await getCurrentPosition();
      setUserLocation(locationData);
      
      addNotification({
        type: 'success',
        title: 'Location Updated',
        message: `Location set to ${locationData.city || 'your current position'}`
      });
      
      return locationData;
    } catch (err) {
      const locationError = err as LocationError;
      setError(locationError);
      
      addNotification({
        type: 'error',
        title: 'Location Error',
        message: locationError.message
      });
      
      throw locationError;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentPosition, setUserLocation, addNotification]);

  const calculateDistance = useCallback((
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const getDistanceToVenue = useCallback((venueCoords: { lat: number; lng: number }) => {
    if (!userLocation.latitude || !userLocation.longitude) {
      return null;
    }
    
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      venueCoords.lat,
      venueCoords.lng
    );
  }, [userLocation, calculateDistance]);

  const findNearbyVenues = useCallback((venues: Array<{
    location?: { coordinates?: { lat: number; lng: number } };
    [key: string]: unknown;
  }>, maxDistance: number = 50) => {
    if (!userLocation.latitude || !userLocation.longitude) {
      return venues;
    }

    return venues
      .map(venue => ({
        ...venue,
        distance: venue.location?.coordinates ? 
          getDistanceToVenue(venue.location.coordinates) : null
      }))
      .filter(venue => venue.distance === null || venue.distance <= maxDistance)
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [userLocation, getDistanceToVenue]);

  // Auto-request location on mount if not already available
  useEffect(() => {
    if (!userLocation.latitude && !userLocation.longitude && !isLoading) {
      // Request location silently (don't show notifications for auto-request)
      getCurrentPosition()
        .then(locationData => setUserLocation(locationData))
        .catch(err => console.log('Auto location request failed:', err));
    }
  }, [userLocation, isLoading, getCurrentPosition, setUserLocation]);

  return {
    location: userLocation,
    isLoading,
    error,
    requestLocation,
    getCurrentLocation: getCurrentPosition, // Alias for consistency
    calculateDistance,
    getDistanceToVenue,
    findNearbyVenues,
    reverseGeocode
  };
};
