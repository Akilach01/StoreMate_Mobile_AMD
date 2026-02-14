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

console.log('[Firebase] Starting initialization');

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log('[Firebase] App initialized');

// Get Firestore
export const db = getFirestore(app);
console.log('[Firebase] Firestore ready');

// Get Storage
export const storage = getStorage(app);
console.log('[Firebase] Storage ready');

// Initialize Auth
let authInstance: any = null;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log('[Firebase] Auth initialized with persistence');
} catch (error) {
  console.warn('[Firebase] Auth with persistence failed, trying default:', error);
  try {
    authInstance = getAuth(app);
    console.log('[Firebase] Auth obtained with getAuth');
  } catch (e) {
    console.error('[Firebase] Auth initialization completely failed:', e);
  }
}

export const auth = authInstance;
console.log('[Firebase] Export complete, auth available:', !!authInstance);

