import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { auth, firestore } from './firebase.config'; // Import Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Modular Firestore methods
import * as ImagePicker from 'expo-image-picker'; // For picking images
import useNotifTest from './testNotif';

const Profile = () => {
  useNotifTest();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default image
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const userEmail = auth.currentUser.email; // Get logged-in user's email
    try {
      const userRef = doc(firestore, 'users', userEmail); // Firestore reference
      const userDoc = await getDoc(userRef); // Fetch the document

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(`${userData.firstname} ${userData.lastname}` || '');
        setMobileNumber(userData.mobileNumber || '');
        setEmail(userData.email || '');
        setProfileImage(userData.profileImage || 'https://via.placeholder.com/150');
      } else {
        Alert.alert('Error', 'User profile not found in the database.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to fetch profile data.');
    }
  };

  // Handle image picking
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Update profile image
    } else {
      console.log('Image picking was canceled');
    }
  };

  // Handle saving the updated profile to Firestore
  const handleSave = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const userEmail = auth.currentUser.email; // Get logged-in user's email
    try {
      const userRef = doc(firestore, 'users', userEmail); // Firestore reference
      await setDoc(
        userRef,
        {
          profileImage,
          firstname: name.split(' ')[0], // Split name to extract first name
          lastname: name.split(' ')[1] || '', // Handle last name
          mobileNumber,
        },
        { merge: true } // Merge new fields with existing data
      );
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component loads
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Profile</Text>
        <View style={styles.divider} />

        {/* Profile Picture */}
        <TouchableOpacity onPress={handleImagePick} style={styles.profilePicContainer}>
          <Image
            source={{
              uri: profileImage,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>

        {/* Editable Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false} // Email field is read-only
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: '#007ACC',
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    borderWidth: 3,
    borderColor: '#007ACC',
  },
  editPhotoText: {
    color: '#007BFF',
    marginTop: 10,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007ACC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
