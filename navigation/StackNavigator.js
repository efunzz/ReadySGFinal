import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Import screens and other navigators
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignUpScreen';

 // Add this import
import TabNavigator from './TabNavigator';


const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"  
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainApp"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}