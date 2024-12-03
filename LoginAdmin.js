import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebase.config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginAdminScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
  };

  const handlePasswordReset = async () => {
    const trimmedEmail = email.toLowerCase().trim();

    if (trimmedEmail === '') {
      Alert.alert('Error', 'Please fill in the email field.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert('Password reset link has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === '' || trimmedPassword === '') {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        Alert.alert(
          'Verify Your Email',
          'Your email is not verified. A verification link has been sent to your email. Please verify your email before logging in.'
        );
        return;
      }

      const userDocRef = doc(firestore, 'users', trimmedEmail);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        Alert.alert('Access Denied', 'You are not an admin.');
        return;
      }

      Alert.alert('Successfully Logged In.');
      navigation.navigate('NotificationAdmin');
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed.', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <Image source={require('./assets/logo.png')} style={styles.logo} />

        {/* Title */}
        <Text style={styles.title}>Sign in to your Admin Account</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />

        {/* Password Input with Show Password Feature */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}  // Control password visibility
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-off'} size={24} color="#ff0000" />
          </TouchableOpacity>
        </View>

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
          <Text style={styles.signUpText}>Regular user? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
