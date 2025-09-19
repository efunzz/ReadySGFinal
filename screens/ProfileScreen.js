import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { colors } from '../constants/theme';
import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';

export default function ProfileScreen({ navigation, session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [fullName, setFullName] = useState('');
  const [userLocation, setUserLocation] = useState('Singapore');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Temporary state for editing
  const [editUsername, setEditUsername] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editFullName, setEditFullName] = useState('');

  const profileMenuItems = [
    { title: 'Personal Information', icon: '👤', subtitle: 'Update your details', action: () => openEditModal() },
    { title: 'Emergency Contacts', icon: '📞', subtitle: 'Manage your contacts' },
    { title: 'Notification Settings', icon: '🔔', subtitle: 'Alert preferences' },
    { title: 'Location Settings', icon: '📍', subtitle: 'Your area preferences' },
    { title: 'Privacy & Security', icon: '🔒', subtitle: 'Account security' },
    { title: 'Help & Support', icon: '❓', subtitle: 'Get assistance' },
    { title: 'About ReadySG', icon: 'ℹ️', subtitle: 'App information' },
  ];

  useEffect(() => {
    console.log('useEffect triggered, session:', session?.user?.id);
    if (session?.user) {
      getProfile();
      getCurrentLocation();
    } else {
      console.log('No session found, setting loading to false');
      setLoading(false);
    }
  }, [session]);

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

  async function getProfile() {
    try {
      setLoading(true);
      console.log('Getting profile for user:', session?.user?.id);
      
      if (!session?.user) {
        console.log('No user in session');
        throw new Error('No user on the session!');
      }

      console.log('Fetching from profiles table...');
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, full_name`)
        .eq('id', session?.user.id)
        .single();

      console.log('Supabase response:', { data, error, status });

      if (error && status !== 406) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data);
        setUsername(data.username || '');
        setWebsite(data.website || '');
        setFullName(data.full_name || '');
      } else {
        console.log('No profile data, using defaults');
        setUsername('');
        setWebsite('');
        setFullName('');
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
      setUsername('');
      setWebsite('');
      setFullName('');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username: editUsername,
        website: editWebsite,
        full_name: editFullName,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      // Update local state
      setUsername(editUsername);
      setWebsite(editWebsite);
      setFullName(editFullName);
      setIsEditModalVisible(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Logout error:', error.message);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } else {
              navigation.replace('Login');
            }
          }
        }
      ]
    );
  };

  const openEditModal = () => {
    setEditUsername(username);
    setEditWebsite(website);
    setEditFullName(fullName);
    setIsEditModalVisible(true);
  };

  const getUserDisplayName = () => {
    return fullName || username || session?.user?.email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{getUserInitial()}</Text>
          </View>
          <TouchableOpacity style={styles.editIconContainer} onPress={openEditModal}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{getUserDisplayName()}</Text>
        <Text style={styles.userLocation}>📍 {userLocation}</Text>
        <Text style={styles.joinDate}>Member since {new Date(session?.user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        {profileMenuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.action || (() => {})}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for tab navigator */}
      <View style={styles.bottomPadding} />

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={session?.user?.email}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editFullName}
                  onChangeText={setEditFullName}
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholder="Enter your username"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Website</Text>
                <TextInput
                  style={styles.input}
                  value={editWebsite}
                  onChangeText={setEditWebsite}
                  placeholder="Enter your website"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={updateProfile}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: colors.text.light,
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 14,
    color: '#a0aec0',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.text.light,
  },
  menuArrow: {
    fontSize: 20,
    color: '#cbd5e0',
  },
  logoutButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e53e3e',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalCloseButton: {
    fontSize: 18,
    color: colors.text.light,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f7fafc',
    color: colors.text.light,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f7fafc',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});