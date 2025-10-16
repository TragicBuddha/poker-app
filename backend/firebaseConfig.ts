// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3NqdyL2HSR8J2Tq8b2QVILjZmRXpefZI",
  authDomain: "poker-app-ba63f.firebaseapp.com",
  projectId: "poker-app-ba63f",
  storageBucket: "poker-app-ba63f.firebasestorage.app",
  messagingSenderId: "156332634233",
  appId: "1:156332634233:web:d579fe9daf214d9752e4a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);