import { useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
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
      
              const warningThreshRef = ref(db, `${fetchedHardwareId}/warningThresh`);
              const dangerThreshRef = ref(db, `${fetchedHardwareId}/dangerThresh`);
    
              const warningThreshSnapshot = await get(warningThreshRef);
              const dangerThreshSnapshot = await get(dangerThreshRef);
              
              const warningThreshold = warningThreshSnapshot.val() || 300; 
              const dangerThreshold = dangerThreshSnapshot.val() || 400; 

              const userEmail = auth.currentUser.email;


              // const datetime = new Date().toLocaleString('en-US', {
              //   month: 'short',
              //   day: '2-digit',
              //   year: 'numeric',
              //   hour: '2-digit',
              //   minute: '2-digit',
              //   second: '2-digit',
              //   hour12: true,
              // });

              let notification = {
                color: '',
                datetime: new Date(),
                level: '',
                ppm: value,
                userEmail,
                mobileNumber: userDoc.data().mobileNumber,
              };

              
              if (value >= dangerThreshold) {
                notification.color = '#FF0000'; 
                notification.level = 'Danger';
                console.log('Danger threshold reached');
              } else if (value >= warningThreshold) {
                notification.color = '#FFC000'; 
                notification.level = 'Warning';
                console.log('Warning threshold reached');
              } else {
                console.log('Gas level is safe; no notification added.');
                return;
              }

              

      

              try {
                const notificationsCollection = collection(firestore, 'notifications1');
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
