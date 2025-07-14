import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics'; // Keep if you're using analytics

import { getAuth } from 'firebase/auth'; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTvOnS00-bCXdvKvRPMC3M8ey-90jlQDg",
  authDomain: "readysg-ce6e6.firebaseapp.com",
  projectId: "readysg-ce6e6",
  storageBucket: "readysg-ce6e6.firebasestorage.app",
  messagingSenderId: "325672615430",
  appId: "1:325672615430:web:f363733b04b212c2784d87",
  measurementId: "G-3BYJJVFZ19"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Add this line to initialize auth
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


// Export what you need
export { auth };