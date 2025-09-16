import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BadgesScreen from '../screens/BadgesScreen'; 
import BadgeDetailScreen from '../screens/BadgeDetailScreen';

const Stack = createStackNavigator();

export default function BadgesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BadgesHome" 
        component={BadgesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BadgeDetail" 
        component={BadgeDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
