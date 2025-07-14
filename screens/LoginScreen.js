import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase'; // Make sure this path is correct

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
   
    setLoading(true);
    
    // Simulate loading for UI testing
    setTimeout(() => {
      setLoading(false);
      // Just navigate to main app without authentication
      navigation.navigate('MainApp');
    }, 1000);

    /* COMMENTED OUT FIREBASE CODE
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      navigation.navigate('MainApp');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReadySG</Text>
      <Text style={styles.subtitle}>Delicious meals, delivered fast</Text>
     
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
     
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
     
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Log In'}</Text>
      </TouchableOpacity>
     
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6b6b',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  button: {
    width: '80%',
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});