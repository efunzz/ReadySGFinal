const BASE_URL = 'https://data.gov.sg/api/action/datastore_search';

export class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.stableValues = null; // Store stable humidity/wind for consistency
  }

  // Get cached data if available and not expired
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Set data in cache with timestamp
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get current weather from the working NEA API
  async getCurrentWeatherFromNEA() {
    try {
      const apiEndpoints = [
        'https://api.data.gov.sg/v1/environment/air-temperature',
        'https://api.data.gov.sg/v1/environment/relative-humidity',
        'https://api.data.gov.sg/v1/environment/rainfall',
        'https://api.data.gov.sg/v1/environment/wind-speed'
      ];

      console.log('🌡️ Fetching from NEA API...');
      
      // Fetch temperature (primary data)
      const tempResponse = await fetch(apiEndpoints[0]);
      if (!tempResponse.ok) {
        throw new Error(`Temperature API failed: ${tempResponse.status}`);
      }
      
      const tempData = await tempResponse.json();
      console.log('📊 NEA API response received successfully');
      
      if (!tempData.items || tempData.items.length === 0) {
        throw new Error('No temperature data available');
      }

      const latestItem = tempData.items[0];
      const readings = latestItem.readings || [];
      
      if (readings.length === 0) {
        throw new Error('No temperature readings available');
      }

      // Calculate average temperature from all stations
      const avgTemp = readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length;
      const stationCount = readings.length;
      
      console.log(`✅ Real temperature: ${avgTemp.toFixed(1)}°C from ${stationCount} stations`);

      // Try to get humidity data (secondary - may fail)
      let realHumidity = null;
      try {
        const humidityResponse = await fetch(apiEndpoints[1]);
        if (humidityResponse.ok) {
          const humidityData = await humidityResponse.json();
          if (humidityData.items?.[0]?.readings?.length > 0) {
            const avgHumidity = humidityData.items[0].readings.reduce(
              (sum, reading) => sum + reading.value, 0
            ) / humidityData.items[0].readings.length;
            realHumidity = Math.round(avgHumidity);
            console.log(`✅ Real humidity: ${realHumidity}%`);
          }
        }
      } catch (error) {
        console.log('⚠️ Humidity data not available, using estimated values');
      }

      // Try to get wind data (secondary - may fail)
      let realWindSpeed = null;
      try {
        const windResponse = await fetch(apiEndpoints[3]);
        if (windResponse.ok) {
          const windData = await windResponse.json();
          if (windData.items?.[0]?.readings?.length > 0) {
            const avgWind = windData.items[0].readings.reduce(
              (sum, reading) => sum + reading.value, 0
            ) / windData.items[0].readings.length;
            realWindSpeed = Math.round(avgWind);
            console.log(`✅ Real wind speed: ${realWindSpeed} km/h`);
          }
        }
      } catch (error) {
        console.log('⚠️ Wind data not available, using estimated values');
      }

      return {
        temperature: Math.round(avgTemp),
        humidity: realHumidity,
        windSpeed: realWindSpeed,
        timestamp: latestItem.timestamp,
        stationCount: stationCount,
        dataSource: 'NEA Singapore'
      };

    } catch (error) {
      console.log(`⚠️ NEA API unavailable: ${error.message}`);
      throw error;
    }
  }

  // Generate stable values that don't change frequently
  getStableValues(temperature) {
    // Only generate new stable values if we don't have them or they're old
    const now = Date.now();
    if (!this.stableValues || (now - this.stableValues.generated) > (15 * 60 * 1000)) {
      console.log('🔄 Generating new stable weather values...');
      
      this.stableValues = {
        humidity: this.generateRealisticHumidity(temperature),
        windSpeed: this.generateRealisticWindSpeed(),
        generated: now
      };
    }
    
    return this.stableValues;
  }

  // Generate realistic humidity for Singapore (stable for 15 minutes)
  generateRealisticHumidity(temperature) {
    const baseHumidity = 78; // Singapore's typical daytime humidity
    const tempAdjustment = Math.max(0, (33 - temperature) * 1.5);
    
    const humidity = Math.round(baseHumidity + tempAdjustment);
    return Math.max(65, Math.min(90, humidity)); // Clamp between 65-90%
  }

  // Generate realistic wind speed for Singapore (stable for 15 minutes)
  generateRealisticWindSpeed() {
    // Singapore's typical wind patterns
    const hour = new Date().getHours();
    let baseWind;
    
    if (hour >= 6 && hour <= 10) {
      baseWind = 8; // Morning breeze
    } else if (hour >= 11 && hour <= 15) {
      baseWind = 12; // Midday stronger winds
    } else if (hour >= 16 && hour <= 19) {
      baseWind = 10; // Evening winds
    } else {
      baseWind = 6; // Night - calmer
    }
    
    return Math.max(5, Math.min(18, baseWind)); // Clamp between 5-18 km/h
  }

  // Get processed weather data for the app UI
  async getProcessedWeatherData() {
    const cacheKey = 'weather_data';
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📱 Using cached weather data');
      return cached;
    }

    try {
      console.log('🌤️ Fetching fresh weather data...');
      
      // Get weather data from NEA
      const weatherData = await this.getCurrentWeatherFromNEA();
      
      // Get stable values for humidity and wind (these won't change frequently)
      const stableValues = this.getStableValues(weatherData.temperature);
      
      // Use real data when available, fall back to stable estimated values
      const processedData = {
        temperature: `${weatherData.temperature}°C`,
        humidity: weatherData.humidity ? `${weatherData.humidity}%` : `${stableValues.humidity}%`,
        windSpeed: weatherData.windSpeed ? `${weatherData.windSpeed} km/h` : `${stableValues.windSpeed} km/h`,
        airQuality: this.calculateAirQuality(weatherData.temperature),
        rainRisk: this.calculateRainRisk(weatherData.humidity || stableValues.humidity),
        lastUpdated: new Date().toLocaleTimeString('en-SG'),
        location: 'Singapore (Island-wide Average)',
        dataSource: weatherData.dataSource,
        stationCount: weatherData.stationCount
      };
      
      // Cache the processed data
      this.setCachedData(cacheKey, processedData);
      console.log('✅ Fresh weather data cached successfully');
      
      return processedData;
      
    } catch (error) {
      console.log('⚠️ Using fallback weather data due to API issues');
      // Return fallback data without throwing error
      return this.getFallbackWeatherData();
    }
  }

  // Calculate air quality status based on temperature and conditions
  calculateAirQuality(temperature) {
    const hour = new Date().getHours();
    
    // Singapore's air quality is generally good, varies by time and temperature
    if (temperature > 34) return 'Moderate';
    if (hour >= 7 && hour <= 9) return 'Fair'; // Morning traffic
    if (hour >= 17 && hour <= 19) return 'Fair'; // Evening traffic
    return 'Good';
  }

  // Calculate rain risk based on humidity and Singapore weather patterns
  calculateRainRisk(humidity) {
    const hour = new Date().getHours();
    let baseRisk = 10;
    
    // Singapore's typical rain patterns
    if (hour >= 14 && hour <= 17) {
      baseRisk += 20; // Afternoon thunderstorms common
    }
    
    // Humidity factor
    if (humidity > 85) baseRisk += 15;
    else if (humidity > 75) baseRisk += 10;
    else if (humidity < 65) baseRisk -= 5;
    
    return Math.max(5, Math.min(70, baseRisk));
  }

  // Fallback data when APIs are unavailable
  getFallbackWeatherData() {
    console.log('📱 Generating realistic fallback data');
    
    // Generate realistic Singapore weather data
    const hour = new Date().getHours();
    let baseTemp = 29;
    
    // Singapore temperature patterns
    if (hour >= 12 && hour <= 15) baseTemp = 32; // Hottest period
    else if (hour >= 6 && hour <= 11) baseTemp = 30; // Morning warming
    else if (hour >= 16 && hour <= 19) baseTemp = 31; // Afternoon
    else baseTemp = 28; // Night/early morning
    
    const stableValues = this.getStableValues(baseTemp);
    
    return {
      temperature: `${baseTemp}°C`,
      humidity: `${stableValues.humidity}%`,
      windSpeed: `${stableValues.windSpeed} km/h`,
      airQuality: this.calculateAirQuality(baseTemp),
      rainRisk: `${this.calculateRainRisk(stableValues.humidity)}%`,
      lastUpdated: new Date().toLocaleTimeString('en-SG'),
      location: 'Singapore (Estimated)',
      dataSource: 'Realistic Estimates'
    };
  }

  // Clear cache (for refresh functionality)
  clearCache() {
    this.cache.clear();
    this.stableValues = null; // Reset stable values too
    console.log('🗑️ Cache cleared - will fetch fresh data');
  }
}

// Export singleton instance
export const weatherService = new WeatherService();