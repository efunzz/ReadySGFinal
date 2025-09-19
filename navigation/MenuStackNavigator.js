import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Menu-related screens
import MenuScreen from '../screens/MenuScreen';
import FlashFloodSimulator from '../screens/FlashFloodSimulator';
import FlashFloodLessonsScreen from '../screens/FlashFloodLessonsScreen';
import BadgesScreen from '../screens/badges/BadgesScreen';
import BadgeDetailScreen from '../screens/badges/BadgeDetailScreen';


const Stack = createStackNavigator();

export default function MenuStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MenuHome" 
        component={MenuScreen}
        options={{ 
          headerShown: false 
        }}
      />
       <Stack.Screen 
        name="FlashFloodLessons" 
        component={FlashFloodLessonsScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="FlashFloodSimulator" 
        component={FlashFloodSimulator}
        options={{ 
          headerShown: false 
        }}
        
      />
      <Stack.Screen 
        name="Badges" 
        component={BadgesScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="BadgeDetail" 
        component={BadgeDetailScreen}
        options={{ headerShown: false }}
      />

      {/* Add more learning screens here in the future */}
      {/* 
      <Stack.Screen 
        name="EarthquakeSimulator" 
        component={EarthquakeSimulator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="FireSafetySimulator" 
        component={FireSafetySimulator}
        options={{ headerShown: false }}
      />
      */}
    </Stack.Navigator>
  );
}