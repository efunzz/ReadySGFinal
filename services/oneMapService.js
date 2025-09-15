const BASE_URL = 'https://www.onemap.gov.sg';

export class OneMapService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    // REPLACE THIS WITH YOUR ACTUAL ACCESS TOKEN FROM ONEMAP
    this.accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4NzkzLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiT25lTWFwIiwiaWF0IjoxNzU3ODY1NzU3LCJuYmYiOjE3NTc4NjU3NTcsImV4cCI6MTc1ODEyNDk1NywianRpIjoiZDc3ZmM5NjctN2Q0Yi00ZTU1LWE3OTQtMTNkMmJjZGIyMDYyIn0.tVz4IgxiqpXFHFtrW0BlxedsUQAlWRHGIMpF6p6Ukbi4p_jUY1OrBtKCh2HJvipLqVpE1yPT7iEsIMCYw2EDKXDi_2motWqQfxZ36GcJuun05CQ_Ee47E-KwlnZMozHSqxLuFhnY-KmVZ54-LxWn5TytfN1L__lDjy_ycak1CKD2muOP0a2CzM4JlyaEvMI_4aaSMokvym_XH5JJ7BTR5ZhYCrZnuzLOBD7W3kt8E7LkUwtvRUBM45QkvZf5JihnkJ4oMacKXt0Kt0EVvQ1UwMq7LLtykRq_jykRPPmIl6c3DyIXaAS2DZ8_-PNmTUT22dQKcrZW9PHhQNowb3ttRQ';
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

  // Create a timeout promise for React Native compatibility
  createTimeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }

  // Get directions using OneMap Routing API
  async getDirections(startLocation, endLocation, routeType = 'drive') {
    try {
      console.log(`🗺️ Getting ${routeType} directions...`);
      
      const url = `${BASE_URL}/api/public/routingsvc/route`;
      
      const params = new URLSearchParams({
        start: `${startLocation.latitude},${startLocation.longitude}`,
        end: `${endLocation.latitude},${endLocation.longitude}`,
        routeType: routeType, // 'drive', 'walk', 'pt' (public transport)
        token: this.accessToken
      });

      const fetchPromise = fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const timeoutPromise = this.createTimeoutPromise(15000);
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error(`Routing API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Route found: ${data.route_summary?.total_distance}m, ${data.route_summary?.total_time}s`);
      
      return {
        success: true,
        distance: data.route_summary?.total_distance || 0,
        duration: data.route_summary?.total_time || 0,
        instructions: data.route_instructions || [],
        geometry: data.route_geometry || null
      };
    } catch (error) {
      console.error('❌ Routing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get public transport directions
  async getPublicTransportDirections(startLocation, endLocation) {
    return this.getDirections(startLocation, endLocation, 'pt');
  }

  // Get walking directions  
  async getWalkingDirections(startLocation, endLocation) {
    return this.getDirections(startLocation, endLocation, 'walk');
  }

  // Get driving directions
  async getDrivingDirections(startLocation, endLocation) {
    return this.getDirections(startLocation, endLocation, 'drive');
  }

  // Search for places using OneMap Search API - React Native compatible
  async searchPlaces(searchTerm, options = {}) {
    const cacheKey = `search_${searchTerm}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const {
        returnGeom = 'Y',
        getAddrDetails = 'Y',
        pageNum = 1
      } = options;

      // Use the CORRECT API endpoint from official documentation
      const url = `${BASE_URL}/api/common/elastic/search?searchVal=${encodeURIComponent(searchTerm)}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`;
      
      console.log(`🔍 OneMap Search: ${searchTerm}`);
      
      // React Native compatible timeout using Promise.race
      const fetchPromise = fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      const timeoutPromise = this.createTimeoutPromise(15000);
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response: ${errorText}`);
        throw new Error(`OneMap API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📍 Found ${data.found} results for "${searchTerm}"`);
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`❌ OneMap search failed for "${searchTerm}":`, error);
      
      // Return empty results structure that matches OneMap API format
      return {
        found: 0,
        totalNumPages: 0,
        pageNum: 1,
        results: []
      };
    }
  }

  // Search places near user location with radius filtering
  async searchPlacesNearLocation(searchTerm, userLocation, maxDistanceKm = 5, maxResults = 10) {
    try {
      console.log(`🎯 Searching for "${searchTerm}" within ${maxDistanceKm}km of user location`);
      
      // Get all results from OneMap
      const searchData = await this.searchPlaces(searchTerm);
      
      if (searchData.found === 0) {
        return [];
      }

      // Process and filter by distance
      const facilitiesWithDistance = searchData.results.map(result => {
        const facilityLocation = {
          latitude: parseFloat(result.LATITUDE),
          longitude: parseFloat(result.LONGITUDE)
        };
        
        const distanceKm = this.calculateDistanceNumeric(userLocation, facilityLocation);
        
        return {
          ...result,
          distanceKm: distanceKm,
          distanceText: distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`
        };
      });

      // Filter by maximum distance
      const nearbyFacilities = facilitiesWithDistance.filter(facility => 
        facility.distanceKm <= maxDistanceKm
      );

      // Sort by distance (closest first)
      const sortedFacilities = nearbyFacilities.sort((a, b) => a.distanceKm - b.distanceKm);

      // Limit results
      const limitedResults = sortedFacilities.slice(0, maxResults);

      console.log(`📍 Found ${limitedResults.length} nearby facilities (within ${maxDistanceKm}km)`);
      
      return limitedResults;
    } catch (error) {
      console.error(`❌ Location-based search failed for "${searchTerm}":`, error);
      return [];
    }
  }

  // Get facilities by category with location awareness
  async getFacilitiesByCategory(category, userLocation = null, maxDistanceKm = 5) {
    const cacheKey = `category_${category}_${userLocation ? `${userLocation.latitude}_${userLocation.longitude}` : 'no_location'}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const searchTerms = this.getSearchTermsByCategory(category);
      
      if (!userLocation) {
        console.log(`⚠️ No user location provided, using fallback data for ${category}`);
        const fallbackData = this.getFallbackFacilities(category);
        this.setCachedData(cacheKey, fallbackData);
        return fallbackData;
      }

      console.log(`🎯 Searching for ${category} facilities within ${maxDistanceKm}km of user location`);
      
      // Search each term and collect nearby results
      const allNearbyResults = [];
      
      for (const term of searchTerms) {
        try {
          const nearbyFacilities = await this.searchPlacesNearLocation(
            term, 
            userLocation, 
            maxDistanceKm, 
            3 // Limit per search term
          );
          
          allNearbyResults.push(...nearbyFacilities);
          
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.log(`⚠️ Skipping term "${term}" due to error:`, error.message);
          continue;
        }
      }

      if (allNearbyResults.length === 0) {
        console.log(`📋 No nearby facilities found, using fallback data for ${category}`);
        const fallbackData = this.getFallbackFacilities(category);
        this.setCachedData(cacheKey, fallbackData);
        return fallbackData;
      }

      // Process and format results with real calculated distances
      const processedResults = allNearbyResults.map(result => ({
        id: `${result.BUILDING || result.SEARCHVAL}_${result.LATITUDE}_${result.LONGITUDE}`,
        name: result.BUILDING || result.SEARCHVAL || 'Unknown Location',
        address: result.ADDRESS || 'Address not available',
        latitude: parseFloat(result.LATITUDE),
        longitude: parseFloat(result.LONGITUDE),
        distance: result.distanceText, // Real calculated distance
        distanceKm: result.distanceKm, // For sorting
        status: this.generateRealisticStatus(category),
        category: category,
        source: 'OneMap',
        rawData: result
      }));

      // Remove duplicates and sort by distance
      const uniqueResults = this.removeDuplicates(processedResults);
      const sortedResults = uniqueResults.sort((a, b) => a.distanceKm - b.distanceKm);
      const finalResults = sortedResults.slice(0, 10);

      console.log(`✅ Found ${finalResults.length} nearby ${category} facilities`);
      
      this.setCachedData(cacheKey, finalResults);
      return finalResults;
    } catch (error) {
      console.error(`❌ Error getting location-aware facilities for category "${category}":`, error);
      
      // Always return fallback data on error
      const fallbackData = this.getFallbackFacilities(category);
      this.setCachedData(cacheKey, fallbackData);
      return fallbackData;
    }
  }

  // Enhanced search terms with more specific Singapore locations
  getSearchTermsByCategory(category) {
    const searchTerms = {
      medical: [
        'hospital',
        'polyclinic',
        'clinic', 
        'medical centre',
        'health campus',
        'health centre',
        'medical center',
        'healthcare',
        'family clinic',
        'specialist centre',
        'pharmacy',
        'Guardian',
        'Watsons',
        'Unity'
      ],
      transport: [
        'MRT station',
        'bus interchange',
        'LRT station',
        'bus stop',
        'train station',
        'bus terminal',
        'interchange',
        'Woodlands',
        'Woodlands MRT',
        'Woodlands interchange',
        'regional interchange'
      ],
      supplies: [
        'NTUC FairPrice',
        'Cold Storage',
        'Giant',
        'Sheng Siong',
        'Prime',
        'Marketplace',
        'supermarket',
        'hypermarket',
        'convenience store',
        '7-Eleven',
        'Cheers',
        'minimart',
        'provision shop'
      ],
      shelters: [
        'community centre',
        'community club', 
        'CC',
        'neighbourhood centre',
        'school',
        'primary school',
        'secondary school',
        'stadium',
        'sports complex',
        'sports centre',
        'void deck',
        'community hall',
        'RC centre'
      ]
    };

    return searchTerms[category] || [];
  }

  // Calculate distance between two points using Haversine formula
  calculateDistanceNumeric(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Calculate distance with formatted output
  calculateDistance(point1, point2) {
    const distanceKm = this.calculateDistanceNumeric(point1, point2);
    return distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`;
  }

  // Generate realistic status based on category and time
  generateRealisticStatus(category) {
    const hour = new Date().getHours();
    const statusOptions = {
      medical: { '24h': ['Open 24/7', 'Emergency Only'], business: ['Open', 'Emergency Only'], closed: ['Emergency Only'] },
      transport: { operating: ['Operating', 'Active'], limited: ['Limited Service'], closed: ['Suspended'] },
      supplies: { open: ['Open', 'Well Stocked'], limited: ['Limited Stock', 'Open'], closed: ['Closed'] },
      shelters: { available: ['Available', 'Standby'], limited: ['Limited Capacity'], full: ['Full'] }
    };

    if (category === 'medical') {
      return hour >= 0 && hour <= 23 ? 
        this.randomChoice(statusOptions.medical['24h']) :
        this.randomChoice(statusOptions.medical.business);
    }
    if (category === 'transport') {
      return hour >= 5 && hour <= 24 ? 
        this.randomChoice(statusOptions.transport.operating) : 
        this.randomChoice(statusOptions.transport.limited);
    }
    if (category === 'supplies') {
      return hour >= 8 && hour <= 22 ? 
        this.randomChoice(statusOptions.supplies.open) : 'Closed';
    }
    if (category === 'shelters') {
      return this.randomChoice(statusOptions.shelters.available);
    }
    return 'Available';
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Remove duplicate facilities based on name and proximity
  removeDuplicates(facilities) {
    const uniqueFacilities = [];
    const seen = new Set();

    for (const facility of facilities) {
      // Create unique key based on name and approximate location
      const locationKey = `${Math.round(facility.latitude * 1000)}_${Math.round(facility.longitude * 1000)}`;
      const nameKey = facility.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueKey = `${nameKey}_${locationKey}`;

      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueFacilities.push(facility);
      }
    }

    return uniqueFacilities;
  }

  // Comprehensive fallback data for when location services fail
  getFallbackFacilities(category) {
    const fallbackData = {
      medical: [
        { id: 'sgh_fallback', name: 'Singapore General Hospital', address: 'Outram Road, Singapore 169608', latitude: 1.2793, longitude: 103.8347, distance: '2.1 km', status: 'Open 24/7', category: 'medical', source: 'Fallback' },
        { id: 'ttp_polyclinic_fallback', name: 'Toa Payoh Polyclinic', address: '2003 Lorong 8 Toa Payoh, Singapore 319261', latitude: 1.3340, longitude: 103.8490, distance: '0.8 km', status: 'Open', category: 'medical', source: 'Fallback' },
        { id: 'guardian_fallback', name: 'Guardian Pharmacy', address: 'Toa Payoh Central, Singapore', latitude: 1.3343, longitude: 103.8478, distance: '0.5 km', status: 'Open', category: 'medical', source: 'Fallback' }
      ],
      transport: [
        { id: 'ttp_mrt_fallback', name: 'Toa Payoh MRT Station', address: 'North South Line, Singapore', latitude: 1.3327, longitude: 103.8472, distance: '0.3 km', status: 'Operating', category: 'transport', source: 'Fallback' },
        { id: 'bishan_mrt_fallback', name: 'Bishan MRT Station', address: 'North South/Circle Line, Singapore', latitude: 1.3507, longitude: 103.8487, distance: '1.2 km', status: 'Operating', category: 'transport', source: 'Fallback' }
      ],
      supplies: [
        { id: 'ntuc_ttp_fallback', name: 'NTUC FairPrice Toa Payoh', address: 'Toa Payoh Central, Singapore', latitude: 1.3340, longitude: 103.8485, distance: '0.5 km', status: 'Open', category: 'supplies', source: 'Fallback' },
        { id: '7eleven_fallback', name: '7-Eleven', address: 'Toa Payoh Lorong 1, Singapore', latitude: 1.3355, longitude: 103.8467, distance: '0.3 km', status: 'Open 24/7', category: 'supplies', source: 'Fallback' }
      ],
      shelters: [
        { id: 'ttp_cc_fallback', name: 'Toa Payoh Community Centre', address: '93 Toa Payoh Central, Singapore 319194', latitude: 1.3343, longitude: 103.8478, distance: '0.8 km', status: 'Available', category: 'shelters', source: 'Fallback' },
        { id: 'sg_stadium_fallback', name: 'Singapore Indoor Stadium', address: '2 Stadium Walk, Singapore 397691', latitude: 1.2925, longitude: 103.8747, distance: '1.2 km', status: 'Available', category: 'shelters', source: 'Fallback' }
      ]
    };
    return fallbackData[category] || [];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ OneMap cache cleared');
  }
}

export const oneMapService = new OneMapService();