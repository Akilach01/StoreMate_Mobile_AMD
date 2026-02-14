// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSoJDXxLz9yjQHsbjZbAAt9dG7bZDWPs4",
  authDomain: "storemate-amd.firebaseapp.com",
  projectId: "storemate-amd",
  storageBucket: "storemate-amd.firebasestorage.app",
  messagingSenderId: "1018762947491",
  appId: "1:1018762947491:web:3e070b0c239da3ac078816"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore
export const db = getFirestore(app);

// Get Storage
export const storage = getStorage(app);

// Initialize Auth
let authInstance: any = null;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  try {
    authInstance = getAuth(app);
  } catch (e) {
    // Auth initialization failed
  }
}

export const auth = authInstance;

