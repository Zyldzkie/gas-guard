import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAK10sRhturnXsuptxTVELR6DlIQ0JDiCY",
  authDomain: "gasensor-6739e.firebaseapp.com",
  projectId: "gasensor-6739e",
  storageBucket: "gasensor-6739e.firebasestorage.app",
  messagingSenderId: "328442376687",
  appId: "1:328442376687:android:558a3b0799a41a9683c61a",
  databaseURL: 'https://gasensor-6739e-default-rtdb.asia-southeast1.firebasedatabase.app'
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const dbUrl = firebaseConfig.databaseURL;
export const db = getDatabase(app);
export default app; 