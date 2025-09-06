import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Sample ABC config for development
const firebaseConfig = {
  apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",
  authDomain: "goaly-app.firebaseapp.com",
  projectId: "goaly-app",
  storageBucket: "goaly-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;