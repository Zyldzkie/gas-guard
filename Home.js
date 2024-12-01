// Home.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notification from './Notification'; // Import Notification screen
import Profile from './Profile'; // Import Profile screen

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [gasLevel, setGasLevel] = useState(109);
  const [levelStatus, setLevelStatus] = useState('');

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
