import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function LikeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('shelters');

  const categories = [
    { id: 'shelters', name: 'Shelters', icon: '🏠' },
    { id: 'medical', name: 'Medical', icon: '🏥' },
    { id: 'supplies', name: 'Supplies', icon: '📦' },
    { id: 'transport', name: 'Transport', icon: '🚌' },
  ];

  const resourceData = {
    shelters: [
      { name: 'Singapore Indoor Stadium', address: '2 Stadium Walk', distance: '1.2 km', status: 'Available' },
      { name: 'Toa Payoh Community Centre', address: '93 Toa Payoh Central', distance: '2.8 km', status: 'Full' },
      { name: 'Raffles Institution', address: '1 Raffles Institution Lane', distance: '3.5 km', status: 'Available' },
    ],
    medical: [
      { name: 'Singapore General Hospital', address: 'Outram Road', distance: '0.8 km', status: 'Open 24/7' },
      { name: 'Tan Tock Seng Hospital', address: '11 Jalan Tan Tock Seng', distance: '4.2 km', status: 'Emergency Only' },
      { name: 'Mount Elizabeth Hospital', address: '3 Mount Elizabeth', distance: '2.1 km', status: 'Open' },
    ],
    supplies: [
      { name: 'NTUC FairPrice (Toa Payoh)', address: '530 Lorong 6 Toa Payoh', distance: '1.5 km', status: 'Limited Stock' },
      { name: 'Cold Storage (Centrepoint)', address: '176 Orchard Road', distance: '3.2 km', status: 'Well Stocked' },
      { name: 'Giant Hypermarket', address: '50 Jurong Gateway Road', distance: '12.8 km', status: 'Available' },
    ],
    transport: [
      { name: 'Toa Payoh MRT Station', address: 'North South Line', distance: '0.3 km', status: 'Operating' },
      { name: 'Emergency Bus Service A', address: 'Pickup: Toa Payoh Hub', distance: '0.5 km', status: 'Active' },
      { name: 'Emergency Evacuation Point', address: 'Singapore Sports Stadium', distance: '1.2 km', status: 'Standby' },
    ],
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
        return '#f59e0b';
      case 'Standby':
        return '#6b7280';
      default:
        return '#10b981';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Local Resources</Text>
      <Text style={styles.locationText}>📍 Toa Payoh, Singapore</Text>
      
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
              <TouchableOpacity style={styles.directionsButton}>
                <Text style={styles.directionsText}>Get Directions →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.emergencyFooter}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>🚨 Report Emergency</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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