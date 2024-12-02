import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore } from './firebase.config'; // Import firestore from config

const NotificationCard = ({ user, userName, level, ppm, datetime, color }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <View style={styles.textContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.user}>{user}</Text>  
      <Text style={styles.level}>{level}</Text>
      <Text style={styles.datetime}>{datetime}</Text>
    </View>
    <View style={styles.ppmContainer}>
      <Text style={styles.ppm}>{ppm}</Text>
      <Text style={styles.unit}>ppm</Text>
    </View>
  </View>
);

const NotificationAdminScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Fetch notifications from Firestore
  const fetchNotifications = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'notifications')); // Fetch notifications
      const notificationsList = [];

      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        notificationsList.push({
          id: doc.id, // Document ID as key
          userName: notificationData.userName,
          user: notificationData.userEmail,
          level: notificationData.level,
          ppm: notificationData.ppm,
          datetime: notificationData.datetime,
          color: notificationData.color,
        });
      });

      setNotifications(notificationsList); // Update state with fetched notifications
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications: ', err);
    } finally {
      setLoading(false); // Turn off loading spinner
    }
  };

  useEffect(() => {
    fetchNotifications(); // Call the function when component mounts
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007ACC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Admin Notifications</Text>
      <View style={styles.divider} />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id} // Use the document ID as key
        renderItem={({ item }) => (
          <NotificationCard
            userName={item.userName}
            user={item.user}
            level={item.level}
            ppm={item.ppm}
            datetime={item.datetime}
            color={item.color}
          />
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signUpContainer}>
        <Text style={styles.signUpLink}>Go back to Sign Up</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  user: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 5, 
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5, 
  },
  level: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  datetime: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  ppmContainer: {
    alignItems: 'flex-end',
  },
  ppm: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 16,
    color: '#fff',
    marginTop: -5,
  },
  signUpContainer: {
    alignItems: 'center', // Center the link horizontally
    marginVertical: 20,   // Add some spacing from other elements
    marginBottom:60,
  },
  signUpLink: {
    color: '#ff0000',      // Use a color that fits the design
    fontWeight: 'bold',    // Make the text bold
    fontSize: 16,          // Adjust font size for better readability
  },
});

export default NotificationAdminScreen;
