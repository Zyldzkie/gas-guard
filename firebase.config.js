import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCiiBVW7hWqKSd0GiLAuk5b04lBK1-pYrk",
  authDomain: "gas-sensor-new-79b87.firebaseapp.com",
  projectId: "gas-sensor-new-79b87",
  storageBucket: "gas-sensor-new-79b87.firebasestorage.app",
  messagingSenderId: "878742388247",
  appId: "1:878742388247:android:7ece91bb3b50b3f75c6652",
  databaseURL: 'https://gas-sensor-new-79b87-default-rtdb.asia-southeast1.firebasedatabase.app'
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const dbUrl = firebaseConfig.databaseURL;
export const db = getDatabase(app);
export default app; 