import { toast } from 'sonner';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  city?: string;
  country?: string;
  address?: string;
}

export interface LocationWatchOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

class LocationService {
  private watchId: number | null = null;
  private lastKnownLocation: LocationData | null = null;
  private locationCallbacks: ((location: LocationData) => void)[] = [];

  constructor() {
    // Try to load last known location from localStorage
    const stored = localStorage.getItem('bantu_last_location');
    if (stored) {
      try {
        this.lastKnownLocation = JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored location:', error);
      }
    }
  }

  /**
   * Get current location once
   */
  async getCurrentLocation(options?: LocationWatchOptions): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = await this.processPosition(position);
          this.lastKnownLocation = locationData;
          this.saveLocationToStorage(locationData);
          resolve(locationData);
        },
        (error) => {
          const errorMessage = this.getLocationErrorMessage(error);
          toast.error(`Location Error: ${errorMessage}`);
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  /**
   * Start watching location changes
   */
  startWatching(
    callback: (location: LocationData) => void,
    options?: LocationWatchOptions
  ): void {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    // Add callback to the list
    this.locationCallbacks.push(callback);

    // If already watching, don't start a new watch
    if (this.watchId !== null) {
      // Send last known location to new callback if available
      if (this.lastKnownLocation) {
        callback(this.lastKnownLocation);
      }
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 60000, // 1 minute for watching
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData = await this.processPosition(position);
        this.lastKnownLocation = locationData;
        this.saveLocationToStorage(locationData);
        
        // Notify all callbacks
        this.locationCallbacks.forEach((cb) => cb(locationData));
      },
      (error) => {
        const errorMessage = this.getLocationErrorMessage(error);
        console.error('Location watch error:', errorMessage);
        // Don't show toast for watch errors to avoid spam
      },
      defaultOptions
    );
  }

  /**
   * Stop watching location changes
   */
  stopWatching(callback?: (location: LocationData) => void): void {
    if (callback) {
      // Remove specific callback
      this.locationCallbacks = this.locationCallbacks.filter(cb => cb !== callback);
    } else {
      // Remove all callbacks
      this.locationCallbacks = [];
    }

    // If no more callbacks and watching, stop watching
    if (this.locationCallbacks.length === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get last known location without requesting new location
   */
  getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  /**
   * Calculate distance between two locations in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get human-readable address from coordinates (reverse geocoding)
   * Uses local coordinate mapping instead of external APIs
   */
  async reverseGeocode(lat: number, lon: number): Promise<{
    city?: string;
    country?: string;
    address?: string;
  }> {
    try {
      const locationInfo = this.getLocationFromCoordinates(lat, lon);
      return locationInfo;
    } catch (error) {
      console.error('Local reverse geocoding failed:', error);
      return {};
    }
  }

  /**
   * Local coordinate-to-location mapping for African regions
   */
  private getLocationFromCoordinates(lat: number, lon: number): {
    city?: string;
    country?: string;
    address?: string;
  } {
    // African countries and major cities coordinate boundaries
    const locationData = [
      // South Africa
      { country: 'South Africa', city: 'Cape Town', lat: [-34.2, -33.5], lon: [18.2, 18.7] },
      { country: 'South Africa', city: 'Johannesburg', lat: [-26.5, -25.9], lon: [27.8, 28.3] },
      { country: 'South Africa', city: 'Durban', lat: [-30.0, -29.5], lon: [30.8, 31.2] },
      { country: 'South Africa', city: 'Pretoria', lat: [-25.9, -25.5], lon: [28.0, 28.4] },
      { country: 'South Africa', region: 'Western Cape', lat: [-35.0, -30.0], lon: [16.0, 25.0] },
      { country: 'South Africa', region: 'Eastern Cape', lat: [-35.0, -30.0], lon: [22.0, 30.0] },
      { country: 'South Africa', region: 'KwaZulu-Natal', lat: [-31.0, -26.0], lon: [28.0, 33.0] },
      
      // Nigeria
      { country: 'Nigeria', city: 'Lagos', lat: [6.3, 6.8], lon: [3.0, 3.7] },
      { country: 'Nigeria', city: 'Abuja', lat: [8.8, 9.3], lon: [7.2, 7.7] },
      { country: 'Nigeria', city: 'Kano', lat: [11.8, 12.2], lon: [8.3, 8.7] },
      
      // Kenya
      { country: 'Kenya', city: 'Nairobi', lat: [-1.5, -1.0], lon: [36.5, 37.0] },
      { country: 'Kenya', city: 'Mombasa', lat: [-4.3, -3.8], lon: [39.4, 39.9] },
      
      // Egypt
      { country: 'Egypt', city: 'Cairo', lat: [29.8, 30.3], lon: [31.0, 31.5] },
      { country: 'Egypt', city: 'Alexandria', lat: [31.0, 31.4], lon: [29.7, 30.2] },
      
      // Morocco
      { country: 'Morocco', city: 'Casablanca', lat: [33.3, 33.8], lon: [-7.9, -7.3] },
      { country: 'Morocco', city: 'Rabat', lat: [33.8, 34.2], lon: [-7.0, -6.5] },
      
      // Ghana
      { country: 'Ghana', city: 'Accra', lat: [5.3, 5.8], lon: [-0.5, 0.0] },
      
      // Ethiopia
      { country: 'Ethiopia', city: 'Addis Ababa', lat: [8.8, 9.3], lon: [38.5, 39.0] },
      
      // Tanzania
      { country: 'Tanzania', city: 'Dar es Salaam', lat: [-7.0, -6.5], lon: [39.0, 39.5] },
      
      // Uganda
      { country: 'Uganda', city: 'Kampala', lat: [0.0, 0.5], lon: [32.3, 32.8] },
      
      // Algeria
      { country: 'Algeria', city: 'Algiers', lat: [36.5, 37.0], lon: [2.8, 3.3] },
      
      // Tunisia
      { country: 'Tunisia', city: 'Tunis', lat: [36.6, 37.0], lon: [10.0, 10.4] },
      
      // Senegal
      { country: 'Senegal', city: 'Dakar', lat: [14.5, 14.9], lon: [-17.7, -17.2] },
      
      // Zimbabwe
      { country: 'Zimbabwe', city: 'Harare', lat: [-18.0, -17.6], lon: [30.8, 31.2] },
      
      // Zambia
      { country: 'Zambia', city: 'Lusaka', lat: [-15.6, -15.2], lon: [28.0, 28.4] },
      
      // Botswana
      { country: 'Botswana', city: 'Gaborone', lat: [-24.9, -24.5], lon: [25.7, 26.1] },
      
      // Namibia
      { country: 'Namibia', city: 'Windhoek', lat: [-22.8, -22.4], lon: [16.8, 17.2] },
    ];

    // Find best match
    for (const location of locationData) {
      if (lat >= location.lat[0] && lat <= location.lat[1] && 
          lon >= location.lon[0] && lon <= location.lon[1]) {
        return {
          city: location.city || location.region,
          country: location.country,
          address: `${location.city || location.region || 'Unknown'}, ${location.country}`
        };
      }
    }

    // Fallback to general African regions
    if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
      if (lat >= 0) {
        return { country: 'Northern Africa', address: 'Northern Africa' };
      } else if (lat >= -10) {
        return { country: 'Eastern Africa', address: 'Eastern Africa' };
      } else if (lat >= -25) {
        return { country: 'Southern Africa', address: 'Southern Africa' };
      } else {
        return { country: 'Southern Africa', address: 'Southern Africa' };
      }
    }

    return { country: 'Unknown', address: 'Unknown Location' };
  }

  /**
   * Check if location permission is granted
   */
  async checkPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
      return 'prompt'; // Assume prompt if permissions API not available
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'prompt';
    }
  }

  /**
   * Request location permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      // Try to get location, which will trigger permission request
      await this.getCurrentLocation();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async processPosition(position: GeolocationPosition): Promise<LocationData> {
    const { latitude, longitude, accuracy } = position.coords;
    const timestamp = position.timestamp;

    // Get address information
    const addressInfo = await this.reverseGeocode(latitude, longitude);

    return {
      latitude,
      longitude,
      accuracy,
      timestamp,
      ...addressInfo,
    };
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private getLocationErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied by user';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable';
      case error.TIMEOUT:
        return 'Location request timed out';
      default:
        return 'An unknown error occurred while retrieving location';
    }
  }

  private saveLocationToStorage(location: LocationData): void {
    try {
      localStorage.setItem('bantu_last_location', JSON.stringify(location));
    } catch (error) {
      console.warn('Failed to save location to storage:', error);
    }
  }

  /**
   * Get nearby African attractions/points of interest
   * Uses local database instead of external APIs
   */
  async getNearbyAttractions(lat: number, lon: number, radius: number = 50): Promise<any[]> {
    try {
      // Local database of popular African attractions
      const attractions = [
        // South Africa
        { id: 1, name: 'Table Mountain', type: 'attraction', lat: -33.9628, lon: 18.4098, country: 'South Africa', city: 'Cape Town' },
        { id: 2, name: 'Kruger National Park', type: 'attraction', lat: -24.0078, lon: 31.4977, country: 'South Africa' },
        { id: 3, name: 'Victoria & Alfred Waterfront', type: 'attraction', lat: -33.9025, lon: 18.4187, country: 'South Africa', city: 'Cape Town' },
        { id: 4, name: 'Apartheid Museum', type: 'museum', lat: -26.2419, lon: 27.9808, country: 'South Africa', city: 'Johannesburg' },
        { id: 5, name: 'Gold Reef City', type: 'theme_park', lat: -26.2358, lon: 27.9811, country: 'South Africa', city: 'Johannesburg' },
        
        // Kenya
        { id: 6, name: 'Masai Mara National Reserve', type: 'attraction', lat: -1.4050, lon: 35.0050, country: 'Kenya' },
        { id: 7, name: 'Mount Kenya', type: 'viewpoint', lat: -0.1525, lon: 37.3085, country: 'Kenya' },
        { id: 8, name: 'Nairobi National Park', type: 'attraction', lat: -1.3733, lon: 36.8581, country: 'Kenya', city: 'Nairobi' },
        
        // Egypt
        { id: 9, name: 'Pyramids of Giza', type: 'attraction', lat: 29.9773, lon: 31.1325, country: 'Egypt', city: 'Cairo' },
        { id: 10, name: 'Egyptian Museum', type: 'museum', lat: 30.0475, lon: 31.2336, country: 'Egypt', city: 'Cairo' },
        { id: 11, name: 'Valley of the Kings', type: 'attraction', lat: 25.7402, lon: 32.6014, country: 'Egypt' },
        
        // Morocco
        { id: 12, name: 'Hassan II Mosque', type: 'attraction', lat: 33.6082, lon: -7.6325, country: 'Morocco', city: 'Casablanca' },
        { id: 13, name: 'Majorelle Garden', type: 'attraction', lat: 31.6441, lon: -8.0037, country: 'Morocco' },
        
        // Tanzania
        { id: 14, name: 'Serengeti National Park', type: 'attraction', lat: -2.3333, lon: 34.8333, country: 'Tanzania' },
        { id: 15, name: 'Mount Kilimanjaro', type: 'viewpoint', lat: -3.0674, lon: 37.3556, country: 'Tanzania' },
        { id: 16, name: 'Ngorongoro Crater', type: 'attraction', lat: -3.2108, lon: 35.5044, country: 'Tanzania' },
        
        // Ghana
        { id: 17, name: 'Cape Coast Castle', type: 'museum', lat: 5.1053, lon: -1.2467, country: 'Ghana' },
        { id: 18, name: 'Kakum National Park', type: 'attraction', lat: 5.3600, lon: -1.3700, country: 'Ghana' },
        
        // Nigeria
        { id: 19, name: 'Yankari National Park', type: 'attraction', lat: 9.7500, lon: 10.5000, country: 'Nigeria' },
        { id: 20, name: 'National Theatre Lagos', type: 'attraction', lat: 6.4641, lon: 3.3744, country: 'Nigeria', city: 'Lagos' },
        
        // Zimbabwe
        { id: 21, name: 'Victoria Falls', type: 'attraction', lat: -17.9243, lon: 25.8572, country: 'Zimbabwe' },
        { id: 22, name: 'Great Zimbabwe', type: 'attraction', lat: -20.2676, lon: 30.9388, country: 'Zimbabwe' },
        
        // Botswana
        { id: 23, name: 'Okavango Delta', type: 'attraction', lat: -19.2833, lon: 22.9167, country: 'Botswana' },
        { id: 24, name: 'Chobe National Park', type: 'attraction', lat: -18.1500, lon: 24.0500, country: 'Botswana' },
        
        // Namibia
        { id: 25, name: 'Sossusvlei', type: 'attraction', lat: -24.7320, lon: 15.2920, country: 'Namibia' },
        { id: 26, name: 'Fish River Canyon', type: 'viewpoint', lat: -27.6167, lon: 17.7333, country: 'Namibia' },
      ];

      // Filter attractions within radius and calculate distance
      const nearbyAttractions = attractions
        .map(attraction => ({
          ...attraction,
          distance: this.calculateDistance(lat, lon, attraction.lat, attraction.lon)
        }))
        .filter(attraction => attraction.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Limit to 10 nearest attractions

      return nearbyAttractions;
    } catch (error) {
      console.error('Failed to get nearby attractions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
