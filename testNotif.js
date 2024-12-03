import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.config';
import { auth, firestore } from './firebase.config';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const useNotifTest = () => {
  useEffect(() => {
    let unsubscribeGas;

    const fetchGasLevel = async () => {
      if (!auth.currentUser) {
        console.error('No user is logged in.');
        return;
      }

      try {
        const userRef = doc(firestore, 'users', auth.currentUser.email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const fetchedHardwareId = userDoc.data().hardwareId;

          const gasRef = ref(db, `${fetchedHardwareId}/gas_value`);
          unsubscribeGas = onValue(gasRef, async (snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
              // Skip database insertion for gas levels <= 100
              if (value <= 100) {
                console.log('Gas level is safe; no notification added.');
                return;
              }

              const userEmail = auth.currentUser.email;
              const datetime = new Date().toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              }); // Example: "Dec 02, 2024, 10:15:30 PM"

              let notification = {
                color: '',
                datetime: `${datetime}`, // Ensures datetime is a string
                level: '',
                ppm: value,
                userEmail,
              };

              if (value <= 300) {
                notification.color = '#FFC000'; // Orange for warning levels
                notification.level = 'Warning';
              } else {
                notification.color = '#FF0000'; // Red for danger levels
                notification.level = 'Danger';
              }

              try {
                const notificationsCollection = collection(firestore, 'notifications');
                await addDoc(notificationsCollection, notification);
                console.log('Notification added:', notification);
              } catch (error) {
                console.error('Error adding notification:', error);
              }
            }
          });
        } else {
          console.error('No hardware ID found for user.');
        }
      } catch (error) {
        console.error('Error fetching gas level:', error);
      }
    };

    fetchGasLevel();

    return () => {
      if (unsubscribeGas) {
        unsubscribeGas();
      }
    };
  }, []);
};

export default useNotifTest;
