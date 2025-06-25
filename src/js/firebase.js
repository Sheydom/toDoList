// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Add Auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXV6yVzXzrtH7TuaqW6PQt1GxCoMvImWM",
  authDomain: "todoapp-96218.firebaseapp.com",
  projectId: "todoapp-96218",
  storageBucket: "todoapp-96218.firebasestorage.app",
  messagingSenderId: "738411019480",
  appId: "1:738411019480:web:9a283e6b604dc19251ebad",
  measurementId: "G-NWN6Z0EM08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore
const auth = getAuth(app); // ✅ Initialize Auth
export { app, db, auth }; // ✅ Export Auth
