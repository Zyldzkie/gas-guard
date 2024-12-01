import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Home Screen component that contains the gas level logic
const HomeScreen = () => {
  const [gasLevel, setGasLevel] = useState(89); // Example value
  const [levelStatus, setLevelStatus] = useState('');

  // Classify the gas level
  const classifyGasLevel = (level) => {
    if (level <= 100) {
      return 'Safe';
    } else if (level <= 300) {
      return 'Moderate';
    } else {
      return 'Dangerous';
    }
  };

  useEffect(() => {
    const status = classifyGasLevel(gasLevel);
    setLevelStatus(status);
  }, [gasLevel]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Current Gas Level:</Text>
      <View style={styles.divider} />

      {/* Gas Level Display */}
      <View style={styles.gasLevelBox}>
        <Text style={styles.gasLevel}>{gasLevel}</Text>
        <Text style={styles.unit}>ppm</Text>
      </View>

      {/* Status Display */}
      <Text style={styles.level}>
        Level: <Text style={[styles.status, styles[levelStatus.toLowerCase()]]}>{levelStatus}</Text>
      </Text>
    </View>
  );
};

// Notification Screen component
const NotificationScreen = () => (
  <View style={styles.center}>
    <Text>Notification Screen</Text>
  </View>
);

// Profile Screen component
const ProfileScreen = () => (
  <View style={styles.center}>
    <Text>Profile Screen</Text>
  </View>
);

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
        component={HomeScreen} // Correctly pass the HomeScreen component here
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen} // Correctly pass the NotificationScreen component here
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} // Correctly pass the ProfileScreen component here
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
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  gasLevelBox: {
    flexDirection: 'row',
    backgroundColor: '#007ACC',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  gasLevel: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 5,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
