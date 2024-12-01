import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './Home'; // Your existing Home screen
import NotificationScreen from './Notification'; // Notification screen from above
import ProfileScreen from './Profile'; // Placeholder for Profile screen

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#007ACC', borderTopLeftRadius: 15, borderTopRightRadius: 15, height: 60 },
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
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
