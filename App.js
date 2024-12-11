import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import HomeScreen from './Home'; 
import LoginAdminScreen from './LoginAdmin';
import NotificationAdminScreen from './NotificationAdmin';
import DataAnalyticsScreen from './DataAnalytics';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Navigation error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong!</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
