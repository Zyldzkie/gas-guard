// Home.js
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notification from './Notification'; // Import Notification screen
import Profile from './Profile'; // Import Profile screen
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.config'; // Make sure you have this configuration file
import { auth, firestore } from './firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native'; // Import Alert for error messages

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [gasLevel, setGasLevel] = useState(0);
  const [levelStatus, setLevelStatus] = useState('');

  const classifyGasLevel = (level) => {
    if (level <= 100) {
      return 'Normal';
    } else if (level <= 300) {
      return 'Warning';
    } else {
      return 'Caution';
    }
  };

  useEffect(() => {

    console.log(auth.currentUser.email);

    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const fetchHardwareId = async () => {
      try {
        const userRef = doc(firestore, 'users', auth.currentUser.email);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() ) {

          console.log(userDoc.data().hardwareId);

          const hardwareId = userDoc.data().hardwareId;
          
          const gasRef = ref(db, `${hardwareId}/gas_value`);

          console.log(gasRef);
          
          const unsubscribe = onValue(gasRef, (snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
              console.log('New gas value received:', value);
              setGasLevel(value);
            }
          }, (error) => {
            console.error('Error fetching gas value:', error);
          });

          return unsubscribe;
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

  return (
    <View style={styles.container}>
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
    </View>
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
        component={Notification} // Use the imported Notification component
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile} // Use the imported Profile component
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
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
    fontWeight: 'bold',
    color: '#000',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  safe: {
    color: 'green',
  },
  moderate: {
    color: 'orange',
  },
  dangerous: {
    color: 'red',
  },
  tabBar: {
    backgroundColor: '#007ACC',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
  },
});
