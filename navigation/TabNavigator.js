import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//Import Colors
import { colors } from '../constants/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MenuStackNavigator from '../navigation/MenuStackNavigator'; // Changed this line!
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LikeScreen from '../screens/LikeScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Custom tab bar button with floating effect for the center tab (Preparedness Tools)
const CustomTabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
};

export default function TabNavigator({ session }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: 'white',
          borderRadius: 25,
          height: 70,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9e9e9e',
      }}
    >
      {/* Home - Dashboard */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={20}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Menu - Learning/Training Missions (NOW USES STACK NAVIGATOR!) */}
      <Tab.Screen
        name="Menu"
        component={MenuStackNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'school' : 'school-outline'}
                size={20}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Cart - Preparedness Tools (CENTER - FLOATING BUTTON) */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="checkmark-circle"
              size={26}
              color="white"
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      
      {/* Like - Local Resources */}
      <Tab.Screen
        name="Like"
        component={LikeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'location' : 'location-outline'}
                size={24}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Profile - User Profile & Achievements */}
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      >
        {/*session data is passed to profile screen as a prop*/}
        {(props) => <ProfileScreen {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: -15,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});