import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Thermometer, Wind, Eye, Droplets, TrendingUp, TrendingDown, RefreshCw, Sun, Cloud, CloudRain, Navigation, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { locationService, LocationData } from '@/services/locationService';
import { realTimeDataService, WeatherData } from '@/services/realTimeDataService';
import { cn } from '@/lib/utils';
interface LocationWeatherWidgetProps {
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}
export const LocationWeatherWidget: React.FC<LocationWeatherWidgetProps> = ({
  className,
  showControls = true,
  compact = false
}) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const fetchLocationAndWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current location
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);

      // Get weather for this location
      const weatherData = await realTimeDataService.getWeatherData(locationData.latitude, locationData.longitude);
      setWeather(weatherData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location and weather');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Try to get last known location first
    const lastKnownLocation = locationService.getLastKnownLocation();
    if (lastKnownLocation) {
      setLocation(lastKnownLocation);
      // Get weather for last known location
      realTimeDataService.getWeatherData(lastKnownLocation.latitude, lastKnownLocation.longitude).then(setWeather);
    }

    // Then get current location
    fetchLocationAndWeather();
  }, []);
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return Sun;
    if (desc.includes('cloud')) return Cloud;
    if (desc.includes('rain')) return CloudRain;
    return Sun;
  };
  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    if (diff < 60) return `Updated ${diff}s ago`;
    if (diff < 3600) return `Updated ${Math.floor(diff / 60)}m ago`;
    return `Updated ${Math.floor(diff / 3600)}h ago`;
  };
  if (compact) {
    return;
  }
  return <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5 text-bantu-orange" />
            Location & Weather
          </CardTitle>
          {showControls && <Button variant="ghost" size="sm" onClick={fetchLocationAndWeather} disabled={loading} className="h-8 w-8 p-0">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>}
        </div>
        {lastUpdate && <p className="text-xs text-muted-foreground">{formatLastUpdate()}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {loading && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="flex items-center justify-center py-8">
              <div className="text-center">
                <Compass className="h-8 w-8 animate-spin text-bantu-orange mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Getting your location...</p>
              </div>
            </motion.div>}

          {error && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-4">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <Button size="sm" onClick={fetchLocationAndWeather}>
                Try Again
              </Button>
            </motion.div>}

          {location && !loading && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="space-y-4">
              {/* Location Info */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <MapPin className="h-5 w-5 text-bantu-orange mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">
                    {location.city}, {location.country}
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      ±{location.accuracy}m accuracy
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Weather Info */}
              {weather && <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {React.createElement(getWeatherIcon(weather.description), {
                  className: "h-8 w-8 text-yellow-500"
                })}
                      <div>
                        <p className="text-2xl font-bold">{weather.temperature}°C</p>
                        <p className="text-sm text-muted-foreground">{weather.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Feels like</p>
                      <p className="text-lg font-semibold">{weather.temperature + 2}°C</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="text-sm font-medium">{weather.humidity}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="text-sm font-medium">{weather.windSpeed} km/h</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Eye className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Visibility</p>
                        <p className="text-sm font-medium">{weather.visibility} km</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Sun className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">UV Index</p>
                        <p className="text-sm font-medium">{weather.uvIndex}/11</p>
                      </div>
                    </div>
                  </div>

                  {/* UV Index Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>UV Index</span>
                      <span>{weather.uvIndex}/11</span>
                    </div>
                    <Progress value={weather.uvIndex / 11 * 100} className={cn("h-2", weather.uvIndex <= 2 && "bg-green-200", weather.uvIndex > 2 && weather.uvIndex <= 5 && "bg-yellow-200", weather.uvIndex > 5 && weather.uvIndex <= 7 && "bg-orange-200", weather.uvIndex > 7 && "bg-red-200")} />
                    <p className="text-xs text-muted-foreground">
                      {weather.uvIndex <= 2 && "Low - Safe for outdoor activities"}
                      {weather.uvIndex > 2 && weather.uvIndex <= 5 && "Moderate - Seek shade during midday"}
                      {weather.uvIndex > 5 && weather.uvIndex <= 7 && "High - Use sun protection"}
                      {weather.uvIndex > 7 && "Very High - Avoid sun exposure"}
                    </p>
                  </div>
                </div>}
            </motion.div>}
        </AnimatePresence>
      </CardContent>
    </Card>;
};