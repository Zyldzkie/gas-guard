import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.config'; // Ensure Firebase config is correct
import { auth, firestore } from './firebase.config'; // Ensure Firestore and Authentication are included
import { doc, getDoc } from 'firebase/firestore';

const NotifTest = () => {
  // Fetch hardware ID and set up gas level listener
  const fetchGasLevel = async () => {
    if (!auth.currentUser) {
      console.error('No user is logged in.');
      return;
    }

    try {
      // Fetch hardware ID from Firestore
      const userRef = doc(firestore, 'users', auth.currentUser.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const fetchedHardwareId = userDoc.data().hardwareId;

        // Set up real-time listener for gas level
        const gasRef = ref(db, `${fetchedHardwareId}/gas_value`);
        onValue(gasRef, (snapshot) => {
          const value = snapshot.val();
          if (value !== null) {
            console.log(`Real-time Gas Level: ${value} ppm`); // Log the gas level
          }
        });
      } else {
        console.error('No hardware ID found for user.');
      }
    } catch (error) {
      console.error('Error fetching gas level:', error);
    }
  };

  useEffect(() => {
    fetchGasLevel();
  }, []);

  return null; // No UI component since this is a utility module
};

export default NotifTest;
