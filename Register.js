import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  // State variables to store user inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

    // Function to handle registration
  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //const user = userCredential.user;



      // Create a reference to the users collection and the specific user document
      const userDocRef = doc(firestore, 'users', email);
      
      // Save additional data (username) to Firestore
      await setDoc(userDocRef, {
        firstname: firstName,
        lastname: lastName,
        email: email,
        mobileNumber: mobileNumber,
        createdAt: new Date().toISOString(), // Convert Date to string for Firestore
      });

      Alert.alert('Success', 'Registration successful');
      // You can navigate to another screen here after registration

      navigation.navigate('Login');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }

    Alert.alert('Success', 'Registration successful!');
  };



  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Register</Text>

      {/* Input Fields */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#aaa"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={(text) => setMobileNumber(text)}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  halfInput: {
    width: '48%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInput: {
    flex: 1,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0056b3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
