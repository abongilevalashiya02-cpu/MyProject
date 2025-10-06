import { toast } from 'sonner';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  city: string;
  country: string;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  status: 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived';
  aircraft?: string;
  duration?: string;
  price?: number;
}

class RealTimeDataService {
  private readonly WEATHER_API_KEY = 'demo_key'; // Replace with actual API key
  private readonly NEWS_API_KEY = 'demo_key'; // Replace with actual API key
  private readonly CURRENCY_API_KEY = 'demo_key'; // Replace with actual API key

  /**
   * Get current weather data for a location
   */
  async getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // Using OpenWeatherMap API (requires API key)
      // For demo purposes, returning mock data
      const mockWeatherData: WeatherData = {
        temperature: Math.round(18 + Math.random() * 15), // 18-33°C
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        windSpeed: Math.round(Math.random() * 20), // 0-20 km/h
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        visibility: Math.round(5 + Math.random() * 10), // 5-15 km
        uvIndex: Math.round(Math.random() * 11), // 0-11
        icon: '01d', // sunny
        city: 'Cape Town',
        country: 'South Africa'
      };

      // In production, use actual API:
      // const response = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.WEATHER_API_KEY}&units=metric`
      // );
      // const data = await response.json();
      
      return mockWeatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return null;
    }
  }

  /**
   * Get currency exchange rates
   */
  async getCurrencyRates(baseCurrency: string = 'USD'): Promise<CurrencyRate[]> {
    try {
      // Mock currency data for African currencies
      const africanCurrencies = [
        { code: 'ZAR', name: 'South African Rand', rate: 18.5 },
        { code: 'NGN', name: 'Nigerian Naira', rate: 764.5 },
        { code: 'KES', name: 'Kenyan Shilling', rate: 126.8 },
        { code: 'GHS', name: 'Ghanaian Cedi', rate: 12.1 },
        { code: 'TZS', name: 'Tanzanian Shilling', rate: 2380.0 },
        { code: 'UGX', name: 'Ugandan Shilling', rate: 3720.0 },
        { code: 'RWF', name: 'Rwandan Franc', rate: 1085.0 },
        { code: 'ETB', name: 'Ethiopian Birr', rate: 56.2 },
        { code: 'MAD', name: 'Moroccan Dirham', rate: 10.1 },
        { code: 'EGP', name: 'Egyptian Pound', rate: 30.8 }
      ];

      return africanCurrencies.map(currency => ({
        from: baseCurrency,
        to: currency.code,
        rate: currency.rate + (Math.random() - 0.5) * 0.5, // Add small random variation
        timestamp: Date.now()
      }));

      // In production, use actual API:
      // const response = await fetch(
      //   `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      // );
      // const data = await response.json();
    } catch (error) {
      console.error('Failed to fetch currency rates:', error);
      return [];
    }
  }

  /**
   * Get African tourism and travel news
   */
  async getAfricanTourismNews(limit: number = 10): Promise<NewsItem[]> {
    try {
      // Mock news data related to African tourism
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'South Africa Launches New Sustainable Tourism Initiative',
          description: 'The government announces a R2 billion investment in eco-friendly tourism infrastructure across national parks.',
          url: '#',
          source: 'African Tourism Board',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: '/lovable-uploads/37eefa5a-da23-41cb-acc3-803265918667.png',
          category: 'Sustainability'
        },
        {
          id: '2',
          title: 'Kenya Wildlife Migration Season Begins Early This Year',
          description: 'The Great Migration in Maasai Mara has started two weeks earlier than usual, offering extended viewing opportunities.',
          url: '#',
          source: 'Kenya Wildlife Service',
          publishedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: '/lovable-uploads/2d1f116f-4ccb-45a3-88cd-b7ab0e3a8511.png',
          category: 'Wildlife'
        },
        {
          id: '3',
          title: 'New Flight Routes Connect African Cities with European Destinations',
          description: 'Several airlines announce new direct routes between major African cities and European capitals.',
          url: '#',
          source: 'African Aviation News',
          publishedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: '/lovable-uploads/51765650-ed27-41b0-af2f-334aa8562080.png',
          category: 'Aviation'
        },
        {
          id: '4',
          title: 'Rwanda Wins International Award for Tourism Excellence',
          description: 'Rwanda receives recognition for its outstanding tourism recovery and sustainable practices post-pandemic.',
          url: '#',
          source: 'World Tourism Organization',
          publishedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: '/lovable-uploads/5fe52a93-2f01-49c4-922e-c9a45a0f39be.png',
          category: 'Awards'
        },
        {
          id: '5',
          title: 'Victoria Falls Reaches Peak Water Levels',
          description: 'Recent rains have brought Victoria Falls to its highest water levels in five years, creating spectacular viewing conditions.',
          url: '#',
          source: 'Zambia Tourism',
          publishedAt: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: '/lovable-uploads/8945646f-1b45-4713-84c0-fadb4721ab7a.png',
          category: 'Nature'
        }
      ];

      return mockNews.slice(0, limit);

      // In production, use actual news API:
      // const response = await fetch(
      //   `https://newsapi.org/v2/everything?q=africa+tourism&apiKey=${this.NEWS_API_KEY}&pageSize=${limit}&sortBy=publishedAt`
      // );
      // const data = await response.json();
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Get flight information for African routes
   */
  async getFlightInfo(origin?: string, destination?: string): Promise<FlightInfo[]> {
    try {
      // Mock flight data for popular African routes
      const mockFlights: FlightInfo[] = [
        {
          airline: 'South African Airways',
          flightNumber: 'SA326',
          departure: {
            airport: 'OR Tambo International',
            city: 'Johannesburg',
            time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            terminal: 'A',
            gate: 'A12'
          },
          arrival: {
            airport: 'Cape Town International',
            city: 'Cape Town',
            time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
            terminal: '1',
            gate: 'B8'
          },
          status: 'scheduled',
          aircraft: 'Airbus A320',
          duration: '2h 10m',
          price: 2450
        },
        {
          airline: 'Kenya Airways',
          flightNumber: 'KQ310',
          departure: {
            airport: 'Jomo Kenyatta International',
            city: 'Nairobi',
            time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
            terminal: '1A',
            gate: 'G7'
          },
          arrival: {
            airport: 'Julius Nyerere International',
            city: 'Dar es Salaam',
            time: new Date(Date.now() + 6.5 * 60 * 60 * 1000).toISOString(),
            terminal: '3',
            gate: 'C4'
          },
          status: 'boarding',
          aircraft: 'Boeing 737',
          duration: '1h 30m',
          price: 1850
        },
        {
          airline: 'Ethiopian Airlines',
          flightNumber: 'ET308',
          departure: {
            airport: 'Bole International',
            city: 'Addis Ababa',
            time: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
            terminal: '2',
            gate: 'D15'
          },
          arrival: {
            airport: 'Mohammed V International',
            city: 'Casablanca',
            time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            terminal: '1',
            gate: 'A23'
          },
          status: 'delayed',
          aircraft: 'Boeing 787',
          duration: '5h 45m',
          price: 4200
        }
      ];

      return mockFlights;

      // In production, use actual flight API:
      // const response = await fetch(
      //   `https://api.aviationstack.com/v1/flights?access_key=${this.FLIGHT_API_KEY}&dep_iata=${origin}&arr_iata=${destination}`
      // );
      // const data = await response.json();
    } catch (error) {
      console.error('Failed to fetch flight info:', error);
      return [];
    }
  }

  /**
   * Get real-time travel alerts and safety information
   */
  async getTravelAlerts(country?: string): Promise<any[]> {
    try {
      // Mock travel alerts
      const mockAlerts = [
        {
          id: '1',
          country: 'South Africa',
          level: 'low',
          title: 'Standard Precautions',
          description: 'Exercise normal precautions when traveling to South Africa.',
          lastUpdated: new Date().toISOString(),
          source: 'Government Travel Advisory'
        },
        {
          id: '2',
          country: 'Kenya',
          level: 'moderate',
          title: 'Exercise Increased Caution',
          description: 'Exercise increased caution due to crime and potential for civil unrest in some areas.',
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Government Travel Advisory'
        },
        {
          id: '3',
          country: 'Rwanda',
          level: 'low',
          title: 'Standard Precautions',
          description: 'Rwanda maintains excellent safety standards for tourists.',
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Government Travel Advisory'
        }
      ];

      return country ? mockAlerts.filter(alert => alert.country.toLowerCase() === country.toLowerCase()) : mockAlerts;
    } catch (error) {
      console.error('Failed to fetch travel alerts:', error);
      return [];
    }
  }

  /**
   * Get real-time tourism statistics
   */
  async getTourismStats(): Promise<any> {
    try {
      // Mock tourism statistics
      return {
        totalVisitors: {
          thisYear: 1250000,
          lastYear: 950000,
          percentageChange: 31.6
        },
        topDestinations: [
          { country: 'South Africa', visitors: 425000, change: 28.5 },
          { country: 'Kenya', visitors: 312000, change: 35.2 },
          { country: 'Tanzania', visitors: 198000, change: 42.1 },
          { country: 'Rwanda', visitors: 145000, change: 67.8 },
          { country: 'Ghana', visitors: 97000, change: 23.4 }
        ],
        averageStayDuration: 8.5,
        popularActivities: [
          { activity: 'Safari', percentage: 68 },
          { activity: 'Cultural Tours', percentage: 45 },
          { activity: 'Beach & Islands', percentage: 34 },
          { activity: 'Adventure Sports', percentage: 29 },
          { activity: 'City Tours', percentage: 52 }
        ],
        revenue: {
          total: 2.8e9, // 2.8 billion
          currency: 'USD',
          perVisitor: 2240
        }
      };
    } catch (error) {
      console.error('Failed to fetch tourism stats:', error);
      return null;
    }
  }

  /**
   * Get festival and events calendar
   */
  async getUpcomingEvents(country?: string, limit: number = 10): Promise<any[]> {
    try {
      const mockEvents = [
        {
          id: '1',
          name: 'Cape Town International Jazz Festival',
          country: 'South Africa',
          city: 'Cape Town',
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Music',
          description: 'Africa\'s grandest gathering of jazz artists.',
          imageUrl: '/lovable-uploads/94572388-14c1-4b04-9baa-26e47a1a4490.png'
        },
        {
          id: '2',
          name: 'Zanzibar International Film Festival',
          country: 'Tanzania',
          city: 'Stone Town',
          startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Arts & Culture',
          description: 'Festival of the Dhow Countries celebrating film and arts.',
          imageUrl: '/lovable-uploads/8185c7c0-c6e1-484d-b71c-16319afee6cb.png'
        },
        {
          id: '3',
          name: 'Kwita Izina Gorilla Naming Ceremony',
          country: 'Rwanda',
          city: 'Kinigi',
          startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Conservation',
          description: 'Annual ceremony to name newborn mountain gorillas.',
          imageUrl: '/lovable-uploads/a23138b5-dafd-453e-a5f7-6c0cc5bc0eb4.png'
        }
      ];

      const filtered = country 
        ? mockEvents.filter(event => event.country.toLowerCase() === country.toLowerCase())
        : mockEvents;

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService();
