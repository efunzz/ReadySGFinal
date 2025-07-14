// App.js - Add this at the VERY TOP of the file, before other imports
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';


//import navigations
import TabNavigator from './navigation/TabNavigator';
import StackNavigator from './navigation/StackNavigator';


export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
