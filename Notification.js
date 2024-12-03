import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase.config'; // Import firestore from config
import { getAuth } from 'firebase/auth'; // For getting current user email
import useNotifTest from './testNotif';

const NotificationCard = ({ level, ppm, datetime, color }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <View style={styles.textContainer}>
      <Text style={styles.level}>{level}</Text>
      <Text style={styles.datetime}>{datetime}</Text>
    </View>
    <View style={styles.ppmContainer}>
      <Text style={styles.ppm}>{ppm}</Text>
      <Text style={styles.unit}>ppm</Text>
    </View>
  </View>
);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useNotifTest();

  const fetchNotifications = async () => {
    try {
      const auth = getAuth(); // Initialize Firebase auth
      const currentUserEmail = auth.currentUser?.email; // Get current user's email

      if (!currentUserEmail) {
        setError('User not logged in');
        return;
      }

      // Query Firestore to get documents where userEmail matches current user's email
      const notificationsQuery = query(
        collection(firestore, 'notifications'),
        where('userEmail', '==', currentUserEmail)
      );

      const querySnapshot = await getDocs(notificationsQuery); // Execute the query
      const notificationsList = [];

      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        notificationsList.push({
          id: doc.id, // Document ID as key
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
    fetchNotifications(); // Fetch notifications on component mount
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
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.divider} />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id} // Use the document ID as key
        renderItem={({ item }) => (
          <NotificationCard
            level={item.level}
            ppm={item.ppm}
            datetime={item.datetime}
            color={item.color}
          />
        )}
      />
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
  level: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 16,
    color: '#fff',
    marginTop: -5,
  },
});

export default Notification;
