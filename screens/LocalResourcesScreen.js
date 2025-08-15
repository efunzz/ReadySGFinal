import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// Update this import to your new filename
import { 
  fetchMedicalFacilities, 
  fetchTransportFacilities, 
  fetchSupplyFacilities,
  fetchWeatherAlerts 
} from '../lib/emergencyDataService'; // ← Updated import

console.log('✅ Import successful');

export default function LocalResourcesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('medical');
  const [resourceData, setResourceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState([]);

  const categories = [
    { id: 'medical', name: 'Medical', icon: '🏥' },
    { id: 'transport', name: 'Transport', icon: '🚌' },
    { id: 'supplies', name: 'Supplies', icon: '📦' },
    { id: 'shelters', name: 'Shelters', icon: '🏠' },
  ];

  // Load initial data and weather alerts
  useEffect(() => {
    loadWeatherAlerts();
    fetchResourceData();
  }, []);
  useEffect(() => {
    console.log('🔍 Testing functions exist...');
    console.log('fetchMedicalFacilities:', typeof fetchMedicalFacilities);
    console.log('fetchTransportFacilities:', typeof fetchTransportFacilities);
  }, []);

  // Reload data when category changes
  useEffect(() => {
    fetchResourceData();
  }, [selectedCategory]);

  const loadWeatherAlerts = async () => {
    try {
      const alerts = await fetchWeatherAlerts();
      setWeatherAlerts(alerts.filter(alert => alert.isAlert)); // Only show alerts
    } catch (error) {
      console.log('Weather alerts unavailable');
    }
  };

  const fetchResourceData = async () => {
    setLoading(true);
    try {
      let data = [];
      
      switch(selectedCategory) {
        case 'medical':
          data = await fetchMedicalFacilities();
          break;
        case 'transport':
          data = await fetchTransportFacilities();
          break;
        case 'supplies':
          data = await fetchSupplyFacilities();
          break;
        case 'shelters':
          data = getPlaceholderShelters();
          break;
        default:
          data = [];
      }
      
      setResourceData(prev => ({...prev, [selectedCategory]: data}));
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Set fallback data
      setResourceData(prev => ({...prev, [selectedCategory]: getFallbackData(selectedCategory)}));
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
      case 'Open':
      case 'Open 24/7':
      case 'Open 24 hours':
      case 'Operating':
      case 'Active':
      case 'Well Stocked':
        return '#10b981';
      case 'Full':
      case 'Emergency Only':
      case 'Limited Stock':
      case 'Open 10am-10pm':
        return '#f59e0b';
      case 'Standby':
      case 'Closed':
        return '#6b7280';
      default:
        return '#10b981';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Local Resources</Text>
      <Text style={styles.locationText}>📍 Singapore</Text>
      
      {/* Weather Alerts (if any) */}
      {weatherAlerts.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>
            ⚠️ Weather Alert: {weatherAlerts[0].area} - {weatherAlerts[0].forecast}
          </Text>
        </View>
      )}
      
      {/* Category Tabs */}
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

      {/* Resource List */}
      <ScrollView style={styles.resourceList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
            <Text style={styles.loadingText}>Loading {categories.find(c => c.id === selectedCategory)?.name}...</Text>
          </View>
        ) : (
          resourceData[selectedCategory]?.map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(resource.status) }]}>
                  <Text style={styles.statusText}>{resource.status}</Text>
                </View>
              </View>
              <Text style={styles.resourceAddress}>{resource.address}</Text>
              
              {/* Show additional info based on category */}
              {resource.phone && (
                <Text style={styles.resourcePhone}>📞 {resource.phone}</Text>
              )}
              {resource.code && (
                <Text style={styles.resourceCode}>Station Code: {resource.code}</Text>
              )}
              {resource.type && (
                <Text style={styles.resourceType}>Type: {resource.type}</Text>
              )}
              
              <View style={styles.resourceFooter}>
                <Text style={styles.distanceText}>📍 {resource.distance}</Text>
                <TouchableOpacity style={styles.directionsButton}>
                  <Text style={styles.directionsText}>Get Directions →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        {!loading && (!resourceData[selectedCategory] || resourceData[selectedCategory].length === 0) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {selectedCategory} resources found nearby</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.emergencyFooter}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>🚨 Report Emergency</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper functions for fallback data
const getPlaceholderShelters = () => [
  { 
    name: 'Singapore Indoor Stadium', 
    address: '2 Stadium Walk, Singapore 397691', 
    distance: '1.2 km', 
    status: 'Available',
    capacity: '10,000 people'
  },
  { 
    name: 'Toa Payoh Community Centre', 
    address: '93 Toa Payoh Central, Singapore 319194', 
    distance: '0.8 km', 
    status: 'Available',
    capacity: '500 people'
  },
  { 
    name: 'Singapore Expo', 
    address: '1 Expo Drive, Singapore 486150', 
    distance: '8.5 km', 
    status: 'Available',
    capacity: '50,000 people'
  },
];

const getFallbackData = (category) => {
  switch(category) {
    case 'shelters': return getPlaceholderShelters();
    case 'medical': return [
      { name: 'Singapore General Hospital', address: 'Outram Road', distance: '2.1 km', status: 'Open 24/7' }
    ];
    case 'transport': return [
      { name: 'Toa Payoh MRT Station', address: 'North South Line', distance: '0.3 km', status: 'Operating' }
    ];
    case 'supplies': return [
      { name: 'NTUC FairPrice', address: 'Toa Payoh', distance: '0.5 km', status: 'Open' }
    ];
    default: return [];
  }
};

// Add these new styles to your existing StyleSheet
const styles = StyleSheet.create({
  // ... your existing styles ...
  
  alertBanner: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    margin: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
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
  resourcePhone: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 4,
  },
  resourceCode: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 4,
  },
  resourceType: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
  },
  
  // ... rest of your existing styles
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeCategoryTab: {
    backgroundColor: '#ff6b6b',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: 'white',
  },
  resourceList: {
    flex: 1,
    paddingHorizontal: 20,
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
    marginBottom: 8,
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
  emergencyFooter: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});