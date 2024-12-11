import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Keyboard } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Notification from './Notification';
import Profile from './Profile';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.config';
import { auth, firestore } from './firebase.config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import useNotifTest from './testNotif';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [gasLevel, setGasLevel] = useState(0);
  const [levelStatus, setLevelStatus] = useState('');
  const [hardwareId, setHardwareId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Offline');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  useNotifTest();

  const classifyGasLevel = (level) => {
    if (level <= 100) {
      return 'Normal';
    } else if (level <= 300) {
      return 'Warning';
    } else {
      return 'Danger';
    }
  };

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const fetchHardwareId = async () => {
      try {
        const userRef = doc(firestore, 'users', auth.currentUser.email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const fetchedHardwareId = userDoc.data().hardwareId;
          setHardwareId(fetchedHardwareId);

          const gasRef = ref(db, `${fetchedHardwareId}/gas_value`);

          const unsubscribeGas = onValue(gasRef, (snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
              setGasLevel(value);
            }
          });

          const statusRef = ref(db, `${fetchedHardwareId}/status`);
          const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const status = snapshot.val();
            setConnectionStatus(status === true ? 'Online' : 'Offline');
          });

          return () => {
            unsubscribeGas();
            unsubscribeStatus();
          };
        } else {
          console.error('No hardware ID found for user');
        }
      } catch (error) {
        console.error('Error fetching hardware ID:', error);
      }
    };

    fetchHardwareId();
  }, []);

  useEffect(() => {
    const status = classifyGasLevel(gasLevel);
    setLevelStatus(status);
  }, [gasLevel]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const updateHardwareId = async () => {
    try {
      const userRef = doc(firestore, 'users', auth.currentUser.email);
      await updateDoc(userRef, {
        hardwareId: hardwareId,
      });

      const gasRef = ref(db, `${hardwareId}/gas_value`);
      const statusRef = ref(db, `${hardwareId}/status`);

      onValue(gasRef, (snapshot) => {
        const value = snapshot.val();
        if (value !== null) {
          setGasLevel(value);
        }
      });

      onValue(statusRef, (snapshot) => {
        const status = snapshot.val();
        setConnectionStatus(status === true ? 'Online' : 'Offline');
      });

      setIsEditing(false);
      Alert.alert('Success', 'Hardware ID updated successfully');
    } catch (error) {
      console.error('Error updating hardware ID:', error);
      Alert.alert('Error', 'Failed to update hardware ID');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
      Alert.alert('Signed Out', 'You have been signed out.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={24} color="#fff" />
      </TouchableOpacity>

      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Current Gas Level:</Text>
      <View style={styles.divider} />
      <View style={styles.gasLevelBox}>
        <Text style={styles.gasLevel}>{gasLevel}</Text>
        <Text style={styles.unit}>ppm</Text>
      </View>
      <Text style={styles.level}>
        Level: <Text style={[styles.status, styles[levelStatus.toLowerCase()]]}>{levelStatus}</Text>
      </Text>
      <Text style={styles.connectionStatus}>
        Connection Status:{' '}
        <Text style={{ fontWeight: 'bold', color: connectionStatus === 'Online' ? 'green' : 'red' }}>
          {connectionStatus}
        </Text>
      </Text>
      
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       
      >
        <View style={styles.hardwareContainer}>
          <TextInput
            style={styles.hardwareInput}
            value={hardwareId}
            editable={isEditing}
            onChangeText={(text) => setHardwareId(text)}
            placeholder="Enter your hardware ID"
          />
          <View style={styles.buttonWrapper}>
            <Button title={isEditing ? 'Save' : 'Edit'} onPress={isEditing ? updateHardwareId : toggleEdit} color="#007ACC" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#bdd5e5',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  signOutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007ACC',
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  divider: {
    width: '90%',
    height: 2,
    backgroundColor: '#007ACC',
    marginVertical: 10,
  },
  gasLevelBox: {
    flexDirection: 'row',
    backgroundColor: '#007ACC',
    paddingHorizontal: 60,
    paddingVertical: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  gasLevel: {
    fontSize: 75,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 5,
    marginTop: 50,
  },
  level: {
    fontSize: 18,
    marginTop: 10,
  },
  status: {
    fontWeight: 'bold',
  },
  normal: {
    color: 'green',
  },
  warning: {
    color: 'orange',
  },
  danger: {
    color: 'red',
  },
  connectionStatus: {
    fontSize: 16,
    marginTop: 20,
  },
  hardwareContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  hardwareInput: {
    width: '80%',
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonWrapper: {
    width: '80%',
  },
  tabBar: {
    backgroundColor: '#007ACC',
  },
});
