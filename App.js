import React, { useEffect, useState } from 'react';
import { View, Text, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import HomeScreen from './Home'; 
import LoginAdminScreen from './LoginAdmin';
import NotificationAdminScreen from './NotificationAdmin';
import DataAnalyticsScreen from './DataAnalytics';
import { auth, firestore } from './firebase.config'; 
import { doc, updateDoc } from 'firebase/firestore';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const updateUserActivity = async (userId, isActive) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      isActive: isActive, 
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};

const UserActivityTracker = ({ children }) => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (auth.currentUser) {
          updateUserActivity(auth.currentUser.email, true); // Set isActive to true
        }
      } else if (nextAppState === 'background') {
        // App is going to the background
        if (auth.currentUser) {
          updateUserActivity(auth.currentUser.email, false); // Set isActive to false
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return <>{children}</>; // Render the children components
};

function App() {
  return (
    <UserActivityTracker>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerLeft: () => null }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
          <Stack.Screen name="NotificationAdmin" component={NotificationAdminScreen} options={{ headerLeft: () => null }} />
          <Stack.Screen name="DataAnalytics" component={DataAnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserActivityTracker>
  );
}

export default App;
