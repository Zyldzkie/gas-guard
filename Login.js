import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function LoginScreen() {
  // State variables to store email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (email === '') {
      Alert.alert('Error', 'Please fill the email Field.');
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password reset link has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async() => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Successfully Logined.');
      navigation.navigate('Home'); // Redirect to Home or other screen after login
    } catch (error) {
      Alert.alert('Login Failed.');
      //setError(error.message);
    }
    // Here you can send the email and password to your database
    
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Sign in to your Account</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email} // Bind state to the input
        onChangeText={(text) => setEmail(text)} // Update state on change
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry={true}
        value={password} // Bind state to the input
        onChangeText={(text) => setPassword(text)} // Update state on change
      />

      {/* Forgot Password */}
      <TouchableOpacity onPress={handlePasswordReset}>
        <Text style={styles.forgotPassword}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007bff',
    marginVertical: 10,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signUpText: {
    color: '#000',
  },
  signUpLink: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
});
