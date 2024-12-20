import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, getDocs, orderBy, query, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from './firebase.config'; // Import firestore from config
import useNotifTest from './testNotif';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { signOut } from 'firebase/auth'; // Import signOut from auth
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for icons
import { Picker } from '@react-native-picker/picker'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserCount from './UserCount';
import { MaterialIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

const NotificationCard = ({ user, userName, level, ppm, datetime, color, mobileNumber }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <View style={styles.textContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.user}>{user}</Text>  
      <Text style={styles.mobileNumber}>{mobileNumber}</Text>
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigation = useNavigation();
  

  useNotifTest();

  // Define fetchUsers before useEffect
  const fetchUsers = async () => {
    const usersList = await getAllUsers(); 
    setUsers(usersList); // Ensure users state is set correctly
  };

  const getAllUsers = async () => {
    try {
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
     
      return usersList;

    } catch (error) {
      console.error('Error fetching users: ', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      
      // Set up real-time listener for notifications
      const q = query(
        collection(firestore, 'notifications1'), 
        orderBy('datetime', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsList = [];
        querySnapshot.forEach((doc) => {
          const notificationData = doc.data();
          notificationsList.push({
            id: doc.id,
            userName: notificationData.userName,
            user: notificationData.userEmail,
            level: notificationData.level,
            ppm: notificationData.ppm,
            datetime: notificationData.datetime.toDate().toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true}),
            color: notificationData.color,
            mobileNumber: notificationData.mobileNumber,
          });
        });

        // Filter notifications based on selectedUserId
        const filteredNotifications = selectedUserId === "ALL"
          ? notificationsList // Show all notifications if "ALL" is selected
          : selectedUserId
          ? notificationsList.filter(notification => notification.user === selectedUserId)
          : notificationsList; // Show all notifications if selectedUserId is null

        setNotifications(filteredNotifications); // Set filtered notifications in state
        setLoading(false);
      }, (error) => {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications: ', error);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchNotifications();
    fetchUsers(); // Call fetchUsers here
  }, [selectedUserId]);

  const downloadExcel = async () => {
    try {
      // Fetch notifications based on selectedUserId
      let q;
      if (selectedUserId) {
        q = query(collection(firestore, 'notifications1'), where('userEmail', '==', selectedUserId), orderBy('datetime', 'desc'));
      } else {
        q = query(collection(firestore, 'notifications1'), orderBy('datetime', 'desc'));
      }
      const querySnapshot = await getDocs(q);
      
      // Format data for Excel
      const notificationsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          'Email': data.userEmail,
          'Mobile Number': data.mobileNumber,
          'Level': data.level,
          'PPM': data.ppm,
          'Date & Time': data.datetime.toDate().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
        };
      });

      // Check if there are any notifications to download
      if (notificationsList.length === 0) {
        Alert.alert('No Data', 'No notifications to download.');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(notificationsList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Notifications");

      const wbout = XLSX.write(wb, { type: 'base64', bookType: "xlsx" });
      
      const fileName = `notifications_${new Date().getTime()}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Download Notifications Data'
      });

    } catch (error) {
      console.error('Error downloading Excel:', error);
      Alert.alert('Error', 'Failed to download notifications data');
    }
  };

  const handleSignOut = async () => {

    try {
      await updateDoc(doc(firestore, 'users', auth.currentUser.email), {
        isActive: false, 
      });
    } catch (error) {
      console.error('Error updating user activity:', error);
    }

    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDataAnalytics = async () => {
    try {
      navigation.navigate('DataAnalytics');
    } catch (error) {
      console.error('Error switching to Analytics Screen: ', error);
    }
  };

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

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <UserCount/>
      <View style={styles.container}>
        
        {/* Logo */}
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Admin Notifications</Text>
        <View style={styles.divider} />



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

    {/* Notifications List */}
    <View style={styles.notificationList}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications} // Use filtered notifications
          keyExtractor={(item) => item.id} // Use the document ID as key
          renderItem={({ item }) => (
            <NotificationCard
              userName={item.userName}
              user={item.user}
              level={item.level}
              ppm={item.ppm}
              datetime={item.datetime}
              color={item.color}
              mobileNumber={item.mobileNumber}
            />
          )}
        />
      ) : (
        <Text style={{textAlign: 'center', fontWeight: 600,}}>No Warning or Danger levels in this account</Text>
      )}
    </View>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={downloadExcel} style={styles.navButton}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDataAnalytics} style={styles.navButton}>
          <Ionicons name="analytics-outline" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.navButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginTop: 10,
    
  },
  title: {
    fontSize: 24,
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
    marginBottom: -40,
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
    marginBottom: 5,
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
  picker: {
    width: '100%',
    zIndex: 2,
  },
  pickerContainer: {
    marginTop: 50,
    zIndex: 3,

    
  },
  notificationList: {
    flex: 1, // Ensures the FlatList takes the remaining space
    // Adds spacing between the picker and the notifications list
    // borderWidth: 2,
    // borderColor: '000',
  },
});

export default NotificationAdminScreen;
