import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { oneMapService } from '../services/oneMapService';

const { width, height } = Dimensions.get('window');

export default function LocalResourcesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('medical');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [resourceData, setResourceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.3521, // Singapore center
    longitude: 103.8198,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef(null);

  const categories = [
    { id: 'medical', name: 'Medical', icon: '🏥', color: '#dc2626' },
    { id: 'transport', name: 'Transport', icon: '🚌', color: '#2563eb' },
    { id: 'supplies', name: 'Supplies', icon: '📦', color: '#059669' },
    { id: 'shelters', name: 'Shelters', icon: '🏠', color: '#7c3aed' },
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch resource data when category changes OR when user location is obtained
  useEffect(() => {
    fetchResourceData();
  }, [selectedCategory, userLocation]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for map features and nearby facility search');
        return;
      }

      console.log('📍 Getting user location...');
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      console.log(`📍 User location: ${coords.latitude}, ${coords.longitude}`);
      setUserLocation(coords);
      setMapRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not get your location. Using fallback data.');
    }
  };

  const fetchResourceData = async () => {
    setLoading(true);
    try {
      console.log(`🔍 Fetching ${selectedCategory} facilities...`);
      
      // Pass user location to get location-aware results
      const data = await oneMapService.getFacilitiesByCategory(selectedCategory, userLocation);
      setResourceData(prev => ({...prev, [selectedCategory]: data}));
      
      if (userLocation) {
        console.log(`✅ Found ${data.length} nearby ${selectedCategory} facilities`);
      } else {
        console.log(`✅ Found ${data.length} ${selectedCategory} facilities (fallback data - no location)`);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Fallback to placeholder data
      setResourceData(prev => ({...prev, [selectedCategory]: getFallbackData(selectedCategory)}));
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
      case 'Open':
      case 'Open 24/7':
      case 'Operating':
      case 'Active':
      case 'Well Stocked':
        return '#10b981';
      case 'Full':
      case 'Emergency Only':
      case 'Limited Stock':
      case 'Limited Service':
        return '#f59e0b';
      case 'Standby':
      case 'Closed':
        return '#6b7280';
      default:
        return '#10b981';
    }
  };

  const getCurrentCategory = () => categories.find(c => c.id === selectedCategory);

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setMapRegion}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
        
        {/* Resource Markers */}
        {resourceData[selectedCategory]?.map((resource, index) => (
          resource.latitude && resource.longitude && (
            <Marker
              key={index}
              coordinate={{
                latitude: resource.latitude,
                longitude: resource.longitude,
              }}
              title={resource.name}
              description={`${resource.address} (${resource.distance})`}
              pinColor={getCurrentCategory()?.color || '#ff6b6b'}
            />
          )
        ))}
      </MapView>
      
      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.animateToRegion({
                ...userLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
        >
          <Text style={styles.mapButtonText}>📍 My Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderList = () => (
    <ScrollView style={styles.resourceList} showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
          <Text style={styles.loadingText}>
            {userLocation ? `Finding nearby ${getCurrentCategory()?.name}...` : 'Loading facilities...'}
          </Text>
        </View>
      ) : (
        <>
          {/* Location Status Banner */}
          {!userLocation && (
            <View style={styles.locationBanner}>
              <Text style={styles.locationBannerText}>
                📍 Location not available - showing sample data
              </Text>
              <TouchableOpacity style={styles.enableLocationButton} onPress={getUserLocation}>
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {resourceData[selectedCategory]?.map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(resource.status) }]}>
                  <Text style={styles.statusText}>{resource.status}</Text>
                </View>
              </View>
              <Text style={styles.resourceAddress}>{resource.address}</Text>
              
              <View style={styles.resourceFooter}>
                <Text style={styles.distanceText}>📍 {resource.distance}</Text>
                <TouchableOpacity 
                  style={styles.directionsButton}
                  onPress={async () => {
                    if (viewMode === 'list' && resource.latitude && resource.longitude) {
                      // First switch to map view
                      setViewMode('map');
                      setTimeout(() => {
                        mapRef.current?.animateToRegion({
                          latitude: resource.latitude,
                          longitude: resource.longitude,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        });
                      }, 100);
                    } else if (userLocation && resource.latitude && resource.longitude) {
                      // Get real directions
                      try {
                        console.log('🗺️ Getting directions...');
                        setLoading(true);
                        
                        const directions = await oneMapService.getPublicTransportDirections(
                          userLocation,
                          { latitude: resource.latitude, longitude: resource.longitude }
                        );
                        
                        setLoading(false);
                        
                        if (directions.success) {
                          const distanceKm = (directions.distance / 1000).toFixed(1);
                          const durationMin = Math.round(directions.duration / 60);
                          
                          Alert.alert(
                            'Directions',
                            `Distance: ${distanceKm}km\nEstimated time: ${durationMin} minutes by public transport\n\nWould you like to view detailed directions?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { 
                                text: 'View Directions', 
                                onPress: () => {
                                  const instructions = directions.instructions
                                    .slice(0, 5) // Show first 5 steps
                                    .map((instruction, index) => `${index + 1}. ${instruction.text || instruction}`)
                                    .join('\n');
                                  
                                  Alert.alert('Route Instructions', instructions || 'Detailed directions available');
                                }
                              }
                            ]
                          );
                        } else {
                          Alert.alert('Directions Error', 'Could not get directions to this location.');
                        }
                      } catch (error) {
                        setLoading(false);
                        console.error('Directions error:', error);
                        Alert.alert('Error', 'Failed to get directions.');
                      }
                    } else {
                      Alert.alert('Location Required', 'Location services needed for directions.');
                    }
                  }}
                >
                  <Text style={styles.directionsText}>
                    {viewMode === 'list' ? 'Show on Map →' : 'Get Directions →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
      
      {!loading && (!resourceData[selectedCategory] || resourceData[selectedCategory].length === 0) && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No {selectedCategory} resources found nearby</Text>
        </View>
      )}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Local Resources</Text>
            <Text style={styles.locationText}>
              {userLocation ? '📍 Showing facilities near your location' : '📍 Location services disabled - showing sample data'}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentContainer}>
        {/* View Mode Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.activeToggleText]}>
              📋 List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.activeToggle]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.activeToggleText]}>
              🗺️ Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compact Category Tabs */}
        <ScrollView 
          horizontal 
          style={styles.categoryContainer}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.activeCategoryTab
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Area - Now Takes More Space */}
        <View style={styles.contentArea}>
          {viewMode === 'map' ? renderMap() : renderList()}
        </View>
      </View>
    </View>
  );
}

// Fallback data for when API fails
const getFallbackData = (category) => {
  const fallbackData = {
    medical: [
      { 
        name: 'Singapore General Hospital', 
        address: 'Outram Road, Singapore 169608',
        latitude: 1.2793,
        longitude: 103.8347,
        distance: '2.1 km', 
        status: 'Open 24/7',
        category: 'medical'
      },
      { 
        name: 'Tan Tock Seng Hospital', 
        address: '11 Jalan Tan Tock Seng, Singapore 308433',
        latitude: 1.3214,
        longitude: 103.8463,
        distance: '3.2 km', 
        status: 'Open 24/7',
        category: 'medical'
      },
    ],
    transport: [
      { 
        name: 'Toa Payoh MRT Station', 
        address: 'North South Line, Singapore',
        latitude: 1.3327,
        longitude: 103.8474,
        distance: '0.3 km', 
        status: 'Operating',
        category: 'transport'
      },
    ],
    supplies: [
      { 
        name: 'NTUC FairPrice Toa Payoh', 
        address: 'Toa Payoh Central, Singapore',
        latitude: 1.3344,
        longitude: 103.8496,
        distance: '0.5 km', 
        status: 'Open',
        category: 'supplies'
      },
    ],
    shelters: [
      { 
        name: 'Toa Payoh Community Centre', 
        address: '93 Toa Payoh Central, Singapore 319194',
        latitude: 1.3341,
        longitude: 103.8501,
        distance: '0.8 km', 
        status: 'Available',
        category: 'shelters'
      },
    ],
  };
  
  return fallbackData[category] || [];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  
  // Header styling
  headerBackground: {
    backgroundColor: '#ff6b6b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  safeArea: {
    // SafeAreaView handles the notch padding
  },
  
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },

  // Location Banner Styles
  locationBanner: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationBannerText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    flex: 1,
  },
  enableLocationButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  enableLocationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // View toggle
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  
  activeToggle: {
    backgroundColor: '#ff6b6b',
  },
  
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  
  activeToggleText: {
    color: 'white',
  },
  
  // Compact Categories
  categoryContainer: {
    paddingHorizontal: 40,
    marginBottom: -450,
  },
  
  categoryTab: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 60,
    maxHeight: 100
  },
  
  activeCategoryTab: {
    backgroundColor: '#ff6b6b',
  },
  
  categoryIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  
  categoryText: {
    fontSize: 10,
    color: '#4a5568',
    fontWeight: '600',
  },
  
  activeCategoryText: {
    color: 'white',
  },
  
  // Content area - Now takes more space
  contentArea: {
    flex: 1,
  },
  
  // Map styles - Bigger map
  mapContainer: {
    flex: 1,
    margin: 16,
    marginBottom:100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  map: {
    flex: 1,
  },
  
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  
  mapButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  
  // List styles
  resourceList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    
  },
  
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
  },
  
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
    marginRight: 8,
  },
  
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  
  resourceAddress: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
  },
  
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  distanceText: {
    fontSize: 12,
    color: '#4a5568',
  },
  
  directionsButton: {
    backgroundColor: '#f7fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  directionsText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
  },
});