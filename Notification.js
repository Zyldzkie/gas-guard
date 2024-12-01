import React from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';

const NotificationCard = ({ level, ppm, timestamp, color }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <View style={styles.textContainer}>
      <Text style={styles.level}>{level}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
    <View style={styles.ppmContainer}>
      <Text style={styles.ppm}>{ppm}</Text>
      <Text style={styles.unit}>ppm</Text>
    </View>
  </View>
);

const NotificationScreen = () => {
  // Sample notifications
  const notifications = [
    {
      id: '1',
      level: 'MODERATE',
      ppm: 250,
      timestamp: 'Dec 01 | 11:00 AM',
      color: '#FF8C00', // Moderate orange color
    },
    {
      id: '2',
      level: 'DANGEROUS',
      ppm: 390,
      timestamp: 'Dec 01 | 11:00 AM',
      color: '#FF0000', // Dangerous red color
    },
    {
      id: '3',
      level: 'DANGEROUS',
      ppm: 332,
      timestamp: 'Dec 01 | 11:00 AM',
      color: '#FF0000', // Dangerous red color
    },
  ];

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.divider} />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            level={item.level}
            ppm={item.ppm}
            timestamp={item.timestamp}
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
    marginHorizontal:10,
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
  timestamp: {
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

export default NotificationScreen;
