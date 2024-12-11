import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebase.config'; // Ensure you have the correct imports
import { it } from 'date-fns/locale';

const screenWidth = Dimensions.get('window').width;

const DataAnalyticsScreen = () => {
  const [selectedUserId, setSelectedUserId] = useState(null); // Default to null
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [selectedUserData, setSelectedUserData] = useState([]);
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(firestore, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const usersList = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          id: doc.id,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          isAdmin: userData.isAdmin,
        });
      });
      setUsers(usersList);
    };

    const fetchNotifications = async () => {
      const notificationsQuery = query(collection(firestore, 'notifications1'), orderBy('datetime', 'desc'));
      const unsubscribe = onSnapshot(notificationsQuery, (querySnapshot) => {
        const notificationsList = [];
        querySnapshot.forEach((doc) => {
          const notificationData = doc.data();
          notificationsList.push({
            id: doc.id,
            userName: notificationData.userName,
            user: notificationData.userEmail,
            level: notificationData.level,
            ppm: notificationData.ppm,
            datetime: notificationData.datetime, 
            color: notificationData.color,
            mobileNumber: notificationData.mobileNumber,
          });
        });
    
        setNotifications(notificationsList);
      });

      return () => unsubscribe();
    };

    fetchUsers();
    fetchNotifications();
  }, [selectedUserId]);

  useEffect(() => {
    // Combine user data with notifications for chart data
    const combinedData = users.map(user => {
      const userNotifications = notifications.filter(notification => notification.user === user.email);
      
      return {
        userId: user.id,
        email: user.email,
        data: userNotifications.map(notification => ({
          datetime: notification.datetime, 
          ppm: notification.ppm,
        })),
      };
    });

  

    if (selectedUserId) {
      const foundUser = combinedData.find(user => {
        const normalizedUserId = user.userId.trim().toLowerCase();
        const normalizedSelectedId = selectedUserId.trim().toLowerCase();
        return normalizedUserId === normalizedSelectedId;
      });

      if (foundUser) {
        setSelectedUserData(foundUser.data); // Update state with found user data
        
      } else {
        setSelectedUserData([]); // Reset if no user found
      }
    } else {
      setSelectedUserData([]); // Reset if no user is selected
    }



    // Filter out notifications older than today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today



    const recentData = selectedUserData.filter(item => {
        const itemDate = item.datetime.toDate();

        return itemDate >= todayStart && itemDate <= todayEnd;
    });

    setRecentData(recentData);





    const chartData = recentData
        .map(item => {
        
            return {
                datetime: item.datetime.toDate(), 
                ppm: item.ppm,
            };
        })
        .sort((a, b) => b.datetime - a.datetime) // Sort from most recent to oldest
        .slice(0, 7) // Limit to the last 7 entries
        .reverse(); // Reverse the order to have the oldest on the left

    setChartData(chartData);

  }, [users, notifications, selectedUserId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Data Analytics</Text>
      <View style={styles.divider} />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedUserId}
          onValueChange={(itemValue) => setSelectedUserId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Choose a user" value={null} />
          {users.map((user) => (
            <Picker.Item key={user.id} label={user.email} value={user.id} />
          ))}
        </Picker>
      </View>

      {/* Line Chart for selected user's gas detection */}
      {chartData.length > 0 && (
        <View style={styles.graphContainer}>
          <Text style={styles.subtitle}>
            {`Warning/Danger History \n of ${selectedUserId === null ? "All Users" : users.find(user => user.id === selectedUserId)?.email} \n (Day)`}
          </Text>
          <LineChart
            data={{
              labels: chartData.map(data => 
                data.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format time without seconds
              ), 
              datasets: [
                {
                  data: chartData.map(data => data.ppm), // PPM values for the selected user
                  strokeWidth: 2,
                  labelFontSize: 2,
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
              labelFontSize: 10,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Message if no user is selected or no data available */}
      {chartData.length === 0 && (
        <Text style={styles.noDataText}>
          No data available for the selected user.
        </Text>
      )}
    </ScrollView>
  );
};

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

export default DataAnalyticsScreen;
