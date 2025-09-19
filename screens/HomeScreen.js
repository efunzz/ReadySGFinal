import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';
import { colors } from '../constants/theme';
import { weatherService } from '../services/weatherService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BadgeService } from '../services/badgeService';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Guest');
  const [userLocation, setUserLocation] = useState('Singapore');
  const [loading, setLoading] = useState(true);
  const [recentBadges, setRecentBadges] = useState([]);
  
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
    getCurrentLocation();
    loadWeatherData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBadgeData();
    }, [])
  );

  const loadBadgeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('🔄 Loading badges for HomeScreen...');
        
        const badges = await BadgeService.getUserBadges(user.id);
        
        const completedBadges = badges.filter(badge => 
          badge.status === 'completed' || badge.status === 'in_progress'
        );
        
        console.log('🎯 HomeScreen badges:', completedBadges);
        setRecentBadges(completedBadges.slice(0, 3));
      }
    } catch (error) {
      console.error('❌ Error loading badges:', error);
    }
  };

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

  const loadWeatherData = async () => {
    try {
      setWeatherLoading(true);
      console.log('🌤️ Loading weather data...');
      const data = await weatherService.getProcessedWeatherData();
      setWeatherData(data);
      console.log('✅ Weather data loaded:', data);
    } catch (error) {
      console.error('❌ Failed to load weather data:', error);
      setWeatherData(weatherService.getFallbackWeatherData());
    } finally {
      setWeatherLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      weatherService.clearCache();
      await loadWeatherData();
      await loadBadgeData(); 
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
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
    <View style={styles.container}>
      {/* Simple Primary Color Header */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {getGreeting()}, {loading ? '...' : userName}
            </Text>
            <Text style={styles.date}>{currentDate}</Text>
            <Text style={styles.location}>📍 {userLocation}</Text>
          </View>
        </SafeAreaView>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* My Badges Section with actual badge coins */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => navigation.navigate('Badges')}
          >
            <Text style={styles.sectionTitle}>My Badges</Text>
            <Ionicons name="chevron-forward" size={20} color="#718096" />
          </TouchableOpacity>
          
          <View style={styles.badgeCoinsContainer}>
            {/* Show earned badges first */}
            {recentBadges.map((badge) => (
              <TouchableOpacity 
                key={badge.id}
                style={[
                  styles.badgeCoin,
                  { 
                    backgroundColor: badge.status === 'completed' 
                      ? colors.primary + '20' 
                      : colors.primary + '10'
                  }
                ]}
                onPress={() => navigation.navigate('Badges')}
              >
                <Text style={styles.badgeCoinEmoji}>{badge.icon}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Show placeholder coins for badges not earned yet */}
            {Array.from({ length: Math.max(0, 3 - recentBadges.length) }).map((_, index) => (
              <View key={`placeholder-${index}`} style={styles.badgeCoinPlaceholder}>
                <Text style={styles.badgeCoinPlaceholderText}>?</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, styles.learnCard]}
              onPress={() => navigateToTab('Menu')}
            >
              <Image 
                source={require('../assets/bullseye.png')} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionTitle}>Learn</Text>
              <Text style={styles.quickActionSubtitle}>Emergency Training</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.resourcesCard]}
              onPress={() => navigateToTab('LocalResources')}
            >
              <Image 
                source={require('../assets/house.png')} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionTitle}>Resources</Text>
              <Text style={styles.quickActionSubtitle}>Find Shelters</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.toolsCard]}
              onPress={() => navigateToTab('Cart')}
            >
              <Image 
                source={require('../assets/tick.png')} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionTitle}>Tools</Text>
              <Text style={styles.quickActionSubtitle}>Check Preparedness</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.profileCard]}
              onPress={() => navigateToTab('Profile')}
            >
              <Image 
                source={require('../assets/profile.png')} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionTitle}>Profile</Text>
              <Text style={styles.quickActionSubtitle}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-time Environmental Conditions */}
        <View style={styles.environmentalAlerts}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Conditions</Text>
            {weatherLoading && (
              <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
            )}
          </View>
          
          <View style={styles.alertsGrid}>
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>🌡️</Text>
              <Text style={styles.alertValue}>
                {weatherData ? weatherData.temperature : '28°C'}
              </Text>
              <Text style={styles.alertLabel}>Temperature</Text>
            </View>
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>💨</Text>
              <Text style={styles.alertValue}>
                {weatherData ? weatherData.airQuality : 'Good'}
              </Text>
              <Text style={styles.alertLabel}>Air Quality</Text>
            </View>
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>🌧️</Text>
              <Text style={styles.alertValue}>
                {weatherData ? weatherData.rainRisk : '15%'}
              </Text>
              <Text style={styles.alertLabel}>Rain Risk</Text>
            </View>
          </View>

          <View style={styles.alertsGrid}>
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>💧</Text>
              <Text style={styles.alertValue}>
                {weatherData ? weatherData.humidity : '75%'}
              </Text>
              <Text style={styles.alertLabel}>Humidity</Text>
            </View>
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>🌪️</Text>
              <Text style={styles.alertValue}>
                {weatherData ? weatherData.windSpeed : '12 km/h'}
              </Text>
              <Text style={styles.alertLabel}>Wind Speed</Text>
            </View>
            <TouchableOpacity 
              style={[styles.alertCard, styles.refreshCard]}
              onPress={onRefresh}
              disabled={refreshing}
            >
              <Text style={styles.alertIcon}>🔄</Text>
              <Text style={styles.alertValue}>
                {refreshing ? 'Updating...' : 'Refresh'}
              </Text>
              <Text style={styles.alertLabel}>Live Data</Text>
            </TouchableOpacity>
          </View>

          {weatherData && (
            <Text style={styles.dataSource}>
              Data from: {weatherData.dataSource} • Last updated: {weatherData.lastUpdated}
            </Text>
          )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Simple header background
  headerBackground: {
    backgroundColor: colors.primary, // Your #ff6b6b color
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  safeArea: {
    // SafeAreaView handles the notch padding
  },
  
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  
  date: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 24,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Badge coins styles
  badgeCoinsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  
  badgeCoin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  badgeCoinEmoji: {
    fontSize: 28,
  },
  
  badgeCoinPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  
  badgeCoinPlaceholderText: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  quickActionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  
  learnCard: {
    borderLeftColor: colors.primary,
  },
  
  resourcesCard: {
    borderLeftColor: colors.secondary,
  },
  
  toolsCard: {
    borderLeftColor: colors.status.warning,
  },
  
  profileCard: {
    borderLeftColor: '#8b5cf6',
  },
  
  quickActionIcon: {
    width: 32,
    height: 32,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.text.light,
    textAlign: 'center',
  },
  
  environmentalAlerts: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  
  loadingIndicator: {
    marginLeft: 8,
  },
  
  alertsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  alertCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  refreshCard: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  
  alertIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  
  alertValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  alertLabel: {
    fontSize: 12,
    color: colors.text.light,
    textAlign: 'center',
  },
  
  dataSource: {
    fontSize: 11,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  emergencyContacts: {
    gap: 12,
  },
  
  emergencyButton: {
    backgroundColor: colors.status.error,
    borderRadius: 12,
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