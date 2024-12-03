import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.config';
import { auth, firestore } from './firebase.config';
import { doc, getDoc } from 'firebase/firestore';

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
          unsubscribeGas = onValue(gasRef, (snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
              console.log(`Real-time Gas Level: ${value} ppm`);
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
