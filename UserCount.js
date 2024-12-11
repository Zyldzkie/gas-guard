import { auth, firestore } from './firebase.config';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';

function UserCount() {
    const [activeUsers, setActiveUsers] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchUserCounts = async () => {
            const usersCollection = collection(firestore, 'users');
            const totalUsersSnapshot = await getDocs(usersCollection);
            setTotalUsers(totalUsersSnapshot.size);

            const activeUsersQuery = query(usersCollection, where('isActive', '==', true));
            const activeUsersSnapshot = await getDocs(activeUsersQuery);
            setActiveUsers(activeUsersSnapshot.size);
        };

        fetchUserCounts();
    }, []);

    return (
        <View>
            <Text>{activeUsers} out of {totalUsers} active users</Text>
        </View>
    );
}

export default UserCount;