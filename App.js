import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import HomeScreen from './Home'; // This is your bottom navigation container.
import LoginAdminScreen from './LoginAdmin';
import NotificationAdminScreen from './NotificationAdmin';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
        <Stack.Screen name="NotificationAdmin" component={NotificationAdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
