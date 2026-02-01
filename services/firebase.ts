// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSoJDXxLz9yjQHsbjZbAAt9dG7bZDWPs4",
  authDomain: "storemate-amd.firebaseapp.com",
  projectId: "storemate-amd",
  storageBucket: "storemate-amd.firebasestorage.app",
  messagingSenderId: "1018762947491",
  appId: "1:1018762947491:web:3e070b0c239da3ac078816"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);