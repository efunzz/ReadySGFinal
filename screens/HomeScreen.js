import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';
import { colors } from '../constants/theme'; // Import your theme colors

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Guest');
  const [userLocation, setUserLocation] = useState('Singapore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    getCurrentLocation();
  }, []);

  const fetchUserData = async () => {
    try {
      console.log('👤 Fetching user data...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('✅ User found:', user.email);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.log('⚠️ Profile query error:', error);
        }
        
        console.log('📋 Profile data:', profile);
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
          console.log('✅ Using full_name:', profile.full_name);
        } else if (profile?.username) {
          setUserName(profile.username);
          console.log('✅ Using username:', profile.username);
        } else {
          const emailName = user.email?.split('@')[0] || 'User';
          const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          setUserName(formattedName);
          console.log('✅ Using email fallback:', formattedName);
        }
      } else {
        console.log('❌ No user found');
        setUserName('Guest');
      }
    } catch (error) {
      console.log('❌ Error fetching user data:', error);
      setUserName('User');
    }
    setLoading(false);
  };

  const getCurrentLocation = async () => {
    try {
      console.log('🗺️ Requesting location permission...');
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        setUserLocation('Singapore');
        return;
      }

      console.log('✅ Location permission granted');
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('📍 Coordinates:', location.coords.latitude, location.coords.longitude);
      
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        console.log('🏠 Address details:', address);
        
        const area = address.district || address.subregion || address.city || 'Singapore';
        const locationString = `${area}, Singapore`;
        setUserLocation(locationString);
        console.log('✅ Final location:', locationString);
      }
      
    } catch (error) {
      console.log('❌ Location error:', error);
      setUserLocation('Singapore');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const navigateToTab = (tabName) => {
    navigation.navigate(tabName);
  };

  const currentDate = new Date().toLocaleDateString('en-SG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with dynamic user data */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {loading ? '...' : userName}!
        </Text>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.location}>📍 {userLocation}</Text>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSpacer} />

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, styles.learnCard]}
              onPress={() => navigateToTab('Menu')}
            >
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionTitle}>Learn</Text>
              <Text style={styles.quickActionSubtitle}>Emergency Training</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.resourcesCard]}
              onPress={() => navigateToTab('LocalResources')}
            >
              <Text style={styles.quickActionIcon}>🏠</Text>
              <Text style={styles.quickActionTitle}>Resources</Text>
              <Text style={styles.quickActionSubtitle}>Find Shelters</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.toolsCard]}
              onPress={() => navigateToTab('Cart')}
            >
              <Text style={styles.quickActionIcon}>✅</Text>
              <Text style={styles.quickActionTitle}>Tools</Text>
              <Text style={styles.quickActionSubtitle}>Check Preparedness</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.profileCard]}
              onPress={() => navigateToTab('Profile')}
            >
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionTitle}>Profile</Text>
              <Text style={styles.quickActionSubtitle}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Safety Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Safety Tip</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Flash Flood Safety</Text>
              <Text style={styles.tipDescription}>
                Never drive through flooded roads. Just 6 inches of moving water can knock you down, and 2 feet can carry away your vehicle.
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.emergencyContacts}>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>🚨 Emergency Services</Text>
              <Text style={styles.emergencyNumber}>995</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>🚑 Non-Emergency</Text>
              <Text style={styles.emergencyNumber}>1777</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // #f0f4f8 - matches status bar area
  },
  container: {
    flex: 1,
    backgroundColor: colors.background, // #f0f4f8
  },
  header: {
    backgroundColor: colors.background, // #f0f4f8 - same grey as content  
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24, // Consistent with other screens
    fontWeight: 'bold',
    color: colors.text.primary, // Black text like other screens
    marginBottom: 6,
  },
  date: {
    fontSize: 16,
    color: colors.text.light, // Grey text
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.text.light, // Grey text
  },
  headerSpacer: {
    height: 24, // Consistent spacing
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24, // Consistent spacing
  },
  sectionTitle: {
    fontSize: 20, // Consistent with other screens
    fontWeight: 'bold',
    color: colors.text.primary, // #2d3748
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: colors.white,
    borderRadius: 16, // Consistent with theme
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4, // Consistent with other cards
  },
  // Individual card styles using theme colors
  learnCard: {
    borderLeftColor: colors.primary, // #ff6b6b
  },
  resourcesCard: {
    borderLeftColor: colors.secondary, // #10b981
  },
  toolsCard: {
    borderLeftColor: colors.status.warning, // #f59e0b
  },
  profileCard: {
    borderLeftColor: '#8b5cf6', // Keep purple for variety
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary, // #2d3748
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.text.light, // #718096
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: colors.primaryLight, // #fff5f5 - light version of primary
    borderRadius: 16, // Consistent
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning, // #f59e0b
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary, // #2d3748
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary, // #4a5568
    lineHeight: 20,
  },
  emergencyContacts: {
    gap: 12, // Consistent spacing
  },
  emergencyButton: {
    backgroundColor: colors.status.error, // #dc2626 - consistent red
    borderRadius: 12, // Consistent
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.status.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
});