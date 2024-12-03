import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDQlMozGGzcTU47CAUv9XKQFTX-TOUDe70",
  authDomain: "gas-guard-5f836.firebaseapp.com",
  projectId: "gas-guard-5f836",
  storageBucket: "gas-guard-5f836.firebasestorage.app",
  messagingSenderId: "707700442055",
  appId: "1:707700442055:android:abe83a7fd5355fd52bcfe2",
  databaseURL: 'https://gas-guard-5f836-default-rtdb.asia-southeast1.firebasedatabase.app'
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const dbUrl = firebaseConfig.databaseURL;
export const db = getDatabase(app);
export default app; 