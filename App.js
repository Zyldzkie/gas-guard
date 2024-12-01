import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './Home';
import NotificationScreen from './Notification';
import ProfileScreen from './Profile';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default App;
