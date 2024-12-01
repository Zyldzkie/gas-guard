import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from './firebase.config'; // Ensure correct Firebase setup
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default image
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const userId = auth.currentUser?.uid; // Get the logged-in user's ID

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setProfileImage(userData.profileImage || 'https://via.placeholder.com/150'); // Default if empty
          setName(userData.name || '');
          setMobileNumber(userData.mobileNumber || '');
          setEmail(userData.email || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Unable to fetch profile data.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected Image URI:', result.assets[0].uri); // Debugging
      setProfileImage(result.assets[0].uri); // Set picked image
    } else {
      console.log('Image picking was canceled');
    }
  };

  const handleSave = async () => {
    try {
      await firestore.collection('users').doc(userId).set(
        {
          profileImage,
          name,
          mobileNumber,
        },
        { merge: true } // Only update the specified fields
      );
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  return (
    <View style={styles.container}>
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
          editable={false}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 50,
    backgroundColor: '#007ACC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
