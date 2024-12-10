import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { signOut } from 'firebase/auth'; // Import signOut from auth
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const screenWidth = Dimensions.get('window').width;

const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDataAnalytics = async () => {
    try {
      await signOut(auth);
      navigation.navigate('DataAnalytics');
    } catch (error) {
      console.error('Error switching to Analytics Screen: ', error);
    }
  };

const DataAnalyticsScreen = () => {
  const [selectedUserId, setSelectedUserId] = useState("ALL");
  const [users, setUsers] = useState([]);
  const [gasData, setGasData] = useState({});

  // Dummy data for testing (comment out once integrated with the backend)
  useEffect(() => {
    const dummyUsers = [
      { id: "1", email: "user1@example.com" },
      { id: "2", email: "user2@example.com" },
    ];

    const dummyGasData = {
      "1": [10, 12, 15, 20, 18, 25, 22], // User 1's gas data
      "2": [8, 9, 14, 13, 17, 19, 21], // User 2's gas data
    };

    setUsers(dummyUsers);
    setGasData(dummyGasData);
  }, []);

  // Filtered data for the selected user
  const selectedUserData =
    selectedUserId !== "ALL" && gasData[selectedUserId]
      ? gasData[selectedUserId]
      : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Data Analytics</Text>
        <View style={styles.divider} />
      {/* Picker for selecting user */}
      <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedUserId}
            onValueChange={(itemValue) => setSelectedUserId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Users" value={"ALL"} />
            {users
              .filter(user => user.email)
              .map((user) => (
                <Picker.Item key={user.id} label={user.email} value={user.id} />
              ))}
          </Picker>
        </View>

      {/* Line Chart for selected user's gas detection */}
      {selectedUserId !== "ALL" && selectedUserData.length > 0 && (
        <View style={styles.graphContainer}>
          <Text style={styles.subtitle}>
            {`Gas Detection for ${users.find(user => user.id === selectedUserId)?.email}`}
          </Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
              datasets: [
                {
                  data: selectedUserData, // Gas values for the selected user
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={{
              backgroundColor: '#1e293b',
              backgroundGradientFrom: '#334155',
              backgroundGradientTo: '#64748b',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Message if no user is selected or no data available */}
      {selectedUserId !== "ALL" && selectedUserData.length === 0 && (
        <Text style={styles.noDataText}>
          No data available for the selected user.
        </Text>
      )}


    </ScrollView>
  );
};

export default DataAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  graphContainer: {
    marginBottom: 20,
  },
  
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 0,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    zIndex: 1,
    width: '60%',
    height: 3,
    backgroundColor: '#007ACC',
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    borderWidth:2,
    borderColor:'#007ACC',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  picker: {
    width: '100%',
    zIndex: 2,
  },
  signOutButton: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#007ACC',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
    marginTop:40,
  },
  downloadButton: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#007ACC',
    padding: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    marginTop:40,
  },
  dataAnalyticsButton:{
    position: 'absolute',
    top: -10,
    left: 165,
    backgroundColor: '#007ACC',
    padding: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    marginTop:40,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  mobileNumber: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007ACC',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
