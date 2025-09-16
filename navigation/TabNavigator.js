import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MenuStackNavigator from '../navigation/MenuStackNavigator';
import PreparednessToolsScreen from '../screens/PreparednessToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LocalResourcesScreen from '../screens/LocalResourcesScreen';
import BadgesStackNavigator from './BadgesStackNavigator'; 



import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function TabNavigator({ session }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: (() => {
          // Hide tab bar when in FlashFloodSimulator
          const routeName = navigation.getState()?.routes[navigation.getState()?.index]?.state?.routes?.[navigation.getState()?.routes[navigation.getState()?.index]?.state?.index]?.name;
          
          if (routeName === 'FlashFloodSimulator') {
            return { display: 'none' };
          }
          
          return {
            position: 'absolute',
            bottom: 20,
            left: width * 0.2,  
            right: width * 0.2, 
            height: 70,
            backgroundColor: 'white',
            borderRadius: 80,  
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            paddingTop: 10,
            paddingBottom: 10,
          };
        })(),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9e9e9e',
      })}
    >
      {/* Home - Dashboard */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={28}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Menu - Learning/Training Missions */}
      <Tab.Screen
        name="Menu"
        component={MenuStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'school' : 'school-outline'}
                size={28}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Cart - Preparedness Tools */}
      <Tab.Screen
        name="PreparednessTools"
        component={PreparednessToolsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={28}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      />
      
      {/* Local Resources */}
      <Tab.Screen
        name="LocalResources"
        component={LocalResourcesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'location' : 'location-outline'}
                size={28}
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
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={28}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      >
        {(props) => <ProfileScreen {...props} session={session} />}
      </Tab.Screen>
      {/* Badges - User Badges & Achievements */}
      <Tab.Screen
        name="Badges"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? 'medal' : 'medal-outline'}
                size={28}
                color={color}
              />
              {focused && <View style={styles.tabBarIndicator} />}
            </View>
          ),
        }}
      >
        {(props) => <BadgesStackNavigator {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: -15,
    height: 3,
    width: 30,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});